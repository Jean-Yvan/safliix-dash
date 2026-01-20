import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { filmsApi } from "@/lib/api/films";
import { uploadToPresignedUrl } from "@/lib/api/uploads";
import { formatApiError } from "@/lib/api/errors";
import { withRetry } from "@/lib/api/retry";
import { useToast } from "@/ui/components/toast/ToastProvider";
import { useSession } from "next-auth/react";
import { DialogStatus } from "@/ui/components/confirmationDialog";
import { type FilmMetadataPayload, type FilmUploadFileDescriptor } from "@/types/api/films";

export type SuggestionOption = { label: string; value: string };
export type FilmActor = { actorId?: string; name: string };
export type FilmFormData = {
  title: string;
  description: string;
  language: string;
  productionHouse: string;
  country: string;
  blockCountries: string[];
  type: string;
  price: number | null;
  releaseDate: string;
  publishDate: string;
  format: string;
  category: string;
  genre: string;
  actors: FilmActor[];
  director: string;
  duration: number | null;
  ageRating: string;
  isSafliixProd: boolean;
  haveSubtitles: boolean;
  subtitleLanguages: string[];
  rightHolderId?: string;
  mainImage: File | null;
  secondaryImage: File | null;
  trailerFile: File | null;
  movieFile: File | null;
  entertainmentMode: string;
};

export type SubmitAction = "draft" | "publish" | "update" | "meta";

type FileSlotType = "main" | "secondary" | "trailer" | "movie";
type FileDescriptor = { key: FileSlotType; file: File };
type PresignedSlot = { key: FileSlotType; uploadUrl: string; finalUrl: string };
type MetadataPayload = FilmMetadataPayload;
type ProgressStep = "idle" | "metadata" | "presign" | "upload" | "finalize";
type OptionLists = {
  types: SuggestionOption[];
  categories: SuggestionOption[];
  formats: SuggestionOption[];
  genres: SuggestionOption[];
  actors: SuggestionOption[];
  countries: SuggestionOption[];
  productionHouses: SuggestionOption[];
  rightHolders: SuggestionOption[];
  languages: SuggestionOption[];
};

export function useFilmForm() {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FilmFormData>({
    defaultValues: {
      title: "",
      description: "",
      language: "",
      productionHouse: "",
      country: "",
      blockCountries: [],
      type: "",
      price: null,
      releaseDate: "",
      publishDate: "",
      format: "",
      category: "",
      genre: "",
      actors: [],
      director: "",
      duration: null,
      ageRating: "",
      isSafliixProd: true,
      haveSubtitles: false,
      subtitleLanguages: [],
      rightHolderId: "",
      mainImage: null,
      secondaryImage: null,
      trailerFile: null,
      movieFile: null,
    },
    shouldUnregister: false,
  });

  const mainImage = watch("mainImage");
  const actorsValue = watch("actors");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogStatus, setDialogStatus] = useState<DialogStatus>("idle");
  const [dialogResult, setDialogResult] = useState<string | null>(null);
  const [pendingFilm, setPendingFilm] = useState<FilmFormData | null>(null);
  const [pendingAction, setPendingAction] = useState<SubmitAction>("publish");
  const [metaSaved, setMetaSaved] = useState(false);
  const [metaSaving, setMetaSaving] = useState(false);
  const [filmId, setFilmId] = useState<string | null>(null);
  const [prefillLoading, setPrefillLoading] = useState(false);
  const [prefillError, setPrefillError] = useState<string | null>(null);
  const [progressStep, setProgressStep] = useState<ProgressStep>("idle");
  const [progressDetail, setProgressDetail] = useState<string | null>(null);
  const [uploadErrorDetail, setUploadErrorDetail] = useState<string | null>(null);
  const [options, setOptions] = useState<OptionLists>({
    types: [],
    categories: [],
    formats: [],
    genres: [],
    actors: [],
    countries: [],
    productionHouses: [],
    rightHolders: [],
    languages: [],
  });
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [optionsError, setOptionsError] = useState<string | null>(null);
  const toast = useToast();
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  useEffect(() => {
    const mapStrings = (values?: string[]) => (values ?? []).filter(Boolean).map((v) => ({ label: v, value: v }));
    const mapObjects = <T>(items: T[] | undefined, key: keyof T, idKey?: keyof T) =>
      (items ?? [])
        .map((item) => {
          const raw = (item as Record<string, unknown>)?.[key as string];
          const idRaw = idKey ? (item as Record<string, unknown>)?.[idKey as string] : undefined;
          const label = typeof raw === "string" ? raw : "";
          const value = typeof idRaw === "string" && idRaw ? idRaw : label;
          return label ? { label, value } : null;
        })
        .filter((opt): opt is SuggestionOption => Boolean(opt));
    const dedupe = (list: SuggestionOption[]) => {
      const seen = new Set<string>();
      return list.filter((opt) => {
        if (seen.has(opt.value)) return false;
        seen.add(opt.value);
        return true;
      });
    };

    const loadOptions = async () => {
      setOptionsLoading(true);
      setOptionsError(null);
      try {
        const res = await filmsApi.metaOptions(accessToken);
        setOptions({
          types: dedupe(mapStrings(res.types)),
          categories: dedupe(mapObjects(res.categories, "category")),
          formats: dedupe(mapObjects(res.formats, "format")),
          genres: dedupe(mapObjects(res.genres, "name")),
          actors: dedupe(mapObjects(res.actors, "name", "id")),
          countries: dedupe(mapStrings(res.countries)),
          productionHouses: dedupe(mapStrings(res.productionHouses)),
          languages: dedupe(mapStrings(res.languages ?? [])),
          rightHolders: dedupe((res.rightHolders ?? []).map((r) => ({
            label: `${r.firstName ?? ""} ${r.lastName ?? ""}`.trim() || r.email || r.id,
            value: r.id,
          }))),
        });
      } catch (error) {
        const friendly = formatApiError(error);
        setOptionsError(friendly.message);
        toast.error({ title: "Options", description: friendly.message });
      } finally {
        setOptionsLoading(false);
      }
    };

    loadOptions();
  }, [accessToken, toast]);

  useEffect(() => {
    if (mainImage) {
      const url = URL.createObjectURL(mainImage);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [mainImage]);

  useEffect(() => {
    if (!filmId) return;
    setPrefillLoading(true);
    setPrefillError(null);

    const loadFilm = async () => {
      try {
        const film = await filmsApi.detail(filmId, accessToken);
        const payload: Partial<FilmFormData> = {
          title: film.title,
          description: film.description ?? film.synopsis ?? "",
          language: (film as { mainLanguage?: string }).mainLanguage ?? film.language ?? "",
          productionHouse: film.productionHouse ?? "",
          country: (film as { productionCountry?: string }).productionCountry ?? film.country ?? "",
          blockCountries: (film as { blockCountries?: string[] }).blockCountries ?? [],
          type: film.type ?? "",
          price: (film as { rentalPrice?: number | null }).rentalPrice ?? film.price ?? null,
          releaseDate: film.releaseDate ?? "",
          publishDate: (film as { plateformDate?: string }).plateformDate ?? film.publishDate ?? "",
          format: film.format ?? "",
          category: film.category ?? "",
          genre: (film as { gender?: string }).gender ?? film.genre ?? "",
          actors:
            typeof film.actors === "string"
              ? film.actors
                  .split(",")
                  .map((a) => a.trim())
                  .filter(Boolean)
                  .map((name) => ({ name }))
              : Array.isArray((film as { actors?: unknown[] }).actors)
                ? (film as { actors?: Array<string | { name?: string; actorId?: string }> }).actors?.map((a) => {
                    if (typeof a === "string") return { name: a };
                    const name = (a as { name?: string }).name ?? "";
                    const actorId = (a as { actorId?: string }).actorId;
                    return name ? { name, actorId } : null;
                  }).filter(Boolean) as FilmActor[]
                : [],
          director: film.director ?? "",
          duration: film.duration ? Number(film.duration) : null,
          ageRating: (film as { ageRating?: string }).ageRating ?? "",
          isSafliixProd: (film as { isSafliixProd?: boolean }).isSafliixProd ?? true,
          haveSubtitles: (film as { haveSubtitles?: boolean }).haveSubtitles ?? false,
          subtitleLanguages: (film as { subtitleLanguages?: string[] }).subtitleLanguages ?? [],
          rightHolderId: (film as { rightHolderId?: string }).rightHolderId ?? "",
        };

        Object.entries(payload).forEach(([key, value]) => {
          setValue(key as keyof FilmFormData, value as never, { shouldValidate: false });
        });
      } catch {
        setPrefillError("Impossible de préremplir le formulaire.");
      } finally {
        setPrefillLoading(false);
      }
    };

    loadFilm();
  }, [filmId, setValue, accessToken]);

  const openConfirm = (data: FilmFormData, action: SubmitAction) => {
    if (action === "meta") {
      if (!data.type || !data.format || !data.genre) {
        toast.error({
          title: "Champs requis",
          description: "Type, format et genre sont obligatoires avant l'envoi.",
        });
        return;
      }
    } else {
      if (!filmId) {
        toast.error({
          title: "Métadonnées manquantes",
          description: "Enregistrez d'abord les métadonnées avant d'ajouter les fichiers.",
        });
        return;
      }
    }
    setPendingFilm(data);
    setPendingAction(filmId ? "update" : action);
    setDialogOpen(true);
    setDialogStatus("idle");
    setDialogResult(null);
  };

  const closeDialog = () => {
    if (dialogStatus === "loading") return;
    setDialogOpen(false);
    setDialogStatus("idle");
    setDialogResult(null);
    setPendingAction("publish");
    setPendingFilm(null);
  };

  const resetForm = () => {
    reset();
    setFilmId(null);
    setMetaSaved(false);
    setPendingFilm(null);
    setPendingAction("publish");
    setDialogOpen(false);
    setDialogStatus("idle");
    setDialogResult(null);
  };

  const buildMetadataPayload = (film: FilmFormData): MetadataPayload => {
    const normalizeType = (raw?: string) => {
      const low = (raw ?? "").trim().toLowerCase();
      if (low === "subscription") return "abonnement";
      if (low === "rent" || low === "rental") return "location";
      if (low === "abonnement" || low === "location") return low;
      return low;
    };
    const rentalPrice = normalizeType(film.type) === "abonnement" ? null : film.price;
    const actors = (film.actors ?? []).filter(Boolean).map((actor) => ({
      actorId: actor.actorId,
      name: actor.name,
    }));

    return {
      title: film.title,
      description: film.description,
      productionHouse: film.productionHouse,
      productionCountry: film.country,
      type: normalizeType(film.type),
      rentalPrice,
      releaseDate: film.releaseDate,
      plateformDate: film.publishDate,
      format: film.format?.trim(),
      category: film.category?.trim(),
      entertainmentMode: "MOVIE",
      gender: film.genre?.trim(),
      director: film.director,
      actors,
      isSafliixProd: film.isSafliixProd,
      haveSubtitles: film.haveSubtitles,
      subtitleLanguages: film.subtitleLanguages,
      mainLanguage: film.language,
      ageRating: film.ageRating || undefined,
      duration: film.duration ?? null,
      rightHolderId: film.rightHolderId || undefined,
      blockedCountries: film.blockCountries ?? [],
    };
  };

  const collectFiles = (film: FilmFormData): FileDescriptor[] => {
    const slots: Array<[FileSlotType, File | null]> = [
      ["main", film.mainImage],
      ["secondary", film.secondaryImage],
      ["trailer", film.trailerFile],
      ["movie", film.movieFile],
    ];
    return slots
      .filter(([, file]) => !!file)
      .map(([key, file]) => ({ key, file: file as File }));
  };

  const submitMetadata = async (metadata: MetadataPayload) => {
    const payload: MetadataPayload = { ...metadata };
    const response = filmId
      ? await withRetry(() => filmsApi.update(filmId, payload, accessToken))
      : await withRetry(() => filmsApi.create(payload, accessToken));

    return response.id;
  };

  const requestUploadSlots = async (id: string, files: FileDescriptor[]): Promise<PresignedSlot[]> => {
    const attachmentTypeBySlot: Record<FileSlotType, FilmUploadFileDescriptor["attachmentType"]> = {
      main: "POSTER",
      secondary: "THUMBNAIL",
      trailer: "TRAILER",
      movie: "MAIN",
    };
    const descriptors: FilmUploadFileDescriptor[] = files.map((f) => ({
      key: f.key,
      name: f.file.name,
      type: f.file.type || "application/octet-stream",
      attachmentType: attachmentTypeBySlot[f.key],
    }));
    return withRetry(() => filmsApi.presignUploads(id, descriptors, accessToken));
  };

  const uploadFileToUrl = async (slot: PresignedSlot, file: File) => {
    await withRetry(() => uploadToPresignedUrl(slot.uploadUrl, file), {
      retries: 2,
      delayMs: 500,
    });
  };

  const finalizeUploads = async (id: string, uploads: PresignedSlot[]) => {
    await withRetry(
      () =>
        filmsApi.finalizeUploads(
          id,
          {
            uploads: uploads.map((u) => ({ key: u.key, finalUrl: u.finalUrl })),
          },
          accessToken,
        ),
      { retries: 2 },
    );
  };

  const saveMetadataOnly = async (film: FilmFormData) => {
    setMetaSaving(true);
    setProgressStep("metadata");
    try {
      const metadata = buildMetadataPayload(film);
      console.log("[films] sauvegarde meta seule", { metadata, filmId });
      const createdFilmId = await submitMetadata(metadata);
      setFilmId(createdFilmId);
      setMetaSaved(true);
      toast.success({
        title: "Métadonnées sauvegardées",
        description: "Vous pouvez passer à l’étape des fichiers.",
      });
      return createdFilmId;
    } catch (error) {
      const friendly = formatApiError(error);
      setUploadErrorDetail(friendly.message);
      toast.error({ title: "Métadonnées", description: friendly.message });
      throw error;
    } finally {
      setMetaSaving(false);
      setProgressStep("idle");
    }
  };

  const confirmSend = async (onMetaSuccess?: () => void) => {
    if (!pendingFilm) return;
    setDialogStatus("loading");
    setDialogResult(null);
    setProgressDetail(null);
    setUploadErrorDetail(null);
    const isMetaOnly = pendingAction === "meta";
    if (isMetaOnly) setMetaSaving(true);

    try {
      const files = collectFiles(pendingFilm);
      console.log("[films] ready to submit", {
        action: pendingAction,
        filmId,
        metaSaved,
        files: files.map((f) => ({ key: f.key, name: f.file.name, type: f.file.type, size: f.file.size })),
      });

      // Cas métadonnées seules (étape 1)
      if (isMetaOnly) {
        setProgressStep("metadata");
        const metadata = buildMetadataPayload(pendingFilm);
        const createdFilmId = await submitMetadata(metadata);
        setFilmId(createdFilmId);
        setMetaSaved(true);
        setDialogStatus("success");
        setDialogResult("Métadonnées enregistrées.");
        setProgressStep("idle");
        toast.success({
          title: "Métadonnées",
          description: "Film créé, vous pouvez passer aux fichiers.",
        });
        if (onMetaSuccess) onMetaSuccess();
        closeDialog();
        setPendingAction("publish");
        return;
      }

      // Étape fichiers uniquement : on suppose les métadonnées déjà enregistrées
      if (!filmId) {
        const err = new Error("Aucun film créé. Enregistrez les métadonnées avant d'ajouter les fichiers.");
        console.error("[films] missing filmId before presign", { filmId, pendingAction, files });
        throw err;
      }
      const workingFilmId = filmId;

      if (files.length) {
        setProgressStep("presign");
        const slots = await requestUploadSlots(workingFilmId, files);

        setProgressStep("upload");
        for (const slot of slots) {
          const file = files.find((f) => f.key === slot.key)?.file;
          if (file) {
            setProgressDetail(`Upload: ${slot.key}`);
            try {
              await uploadFileToUrl(slot, file);
            } catch (err) {
              setUploadErrorDetail(`Echec upload ${slot.key}`);
              throw err;
            }
          }
        }

        setProgressStep("finalize");
        await finalizeUploads(workingFilmId, slots);
      } else {
        setDialogStatus("success");
        setDialogResult("Aucun fichier à envoyer.");
        setProgressStep("idle");
        setProgressDetail(null);
        toast.success({
          title: "Fichiers",
          description: "Aucun fichier à transmettre.",
        });
        closeDialog();
        return;
      }

      setDialogStatus("success");
      setDialogResult("Fichiers envoyés avec succès.");
      setProgressStep("idle");
      setProgressDetail(null);
      toast.success({
        title: "Fichiers envoyés",
        description: "Les fichiers ont été transmis.",
      });
      closeDialog();
    } catch (error) {
      setDialogStatus("error");
      const friendly = formatApiError(error);
      setDialogResult(friendly.message || "Échec de l'envoi du film.");
      setProgressStep("idle");
      setUploadErrorDetail(uploadErrorDetail || friendly.message);
      toast.error({
        title: "Échec d'envoi",
        description: friendly.message,
      });
    } finally {
      if (isMetaOnly) setMetaSaving(false);
    }
  };

  return {
    control,
    handleSubmit,
    setValue,
    actorsValue,
    previewUrl,
    formState: { errors },
    saveMetadataOnly,
    metaSaving,
    openConfirm,
    closeDialog,
    confirmSend,
    dialogOpen,
    dialogStatus,
    dialogResult,
    pendingFilm,
    filmId,
    setFilmId,
    pendingAction,
    setPendingAction,
    resetForm,
    prefillLoading,
    prefillError,
    progressStep,
    progressDetail,
    uploadErrorDetail,
    options,
    optionsLoading,
    optionsError,
  };
}
