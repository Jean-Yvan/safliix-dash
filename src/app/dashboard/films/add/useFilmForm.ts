import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { filmsApi } from "@/lib/api/films";
import { uploadToPresignedUrl } from "@/lib/api/uploads";
import { formatApiError } from "@/lib/api/errors";
import { withRetry } from "@/lib/api/retry";
import { useToast } from "@/ui/components/toast/ToastProvider";
import { useSession } from "next-auth/react";
import { DialogStatus } from "@/ui/components/confirmationDialog";
import { type FilmMetadataPayload } from "@/types/api/films";

export type SuggestionOption = { label: string; value: string };
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
  actors: string[];
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
};

export type SubmitAction = "draft" | "publish" | "update";

type FileSlotType = "main_image" | "secondary_image" | "trailer" | "movie";
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
  });

  const mainImage = watch("mainImage");
  const actorsValue = watch("actors");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogStatus, setDialogStatus] = useState<DialogStatus>("idle");
  const [dialogResult, setDialogResult] = useState<string | null>(null);
  const [pendingFilm, setPendingFilm] = useState<FilmFormData | null>(null);
  const [pendingAction, setPendingAction] = useState<SubmitAction>("publish");
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
    const mapObjects = <T>(items: T[] | undefined, key: keyof T) =>
      (items ?? [])
        .map((item) => {
          const raw = (item as Record<string, unknown>)?.[key as string];
          const value = typeof raw === "string" ? raw : "";
          return value ? { label: value, value } : null;
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
          actors: dedupe(mapObjects(res.actors, "name")),
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
          actors: typeof film.actors === "string"
            ? film.actors
                .split(",")
                .map((a) => a.trim())
                .filter(Boolean)
            : Array.isArray((film as { actors?: string[] }).actors)
              ? ((film as { actors?: string[] }).actors ?? [])
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
  };

  const buildMetadataPayload = (film: FilmFormData): MetadataPayload => {
    const rentalPrice = (film.type || "").toLowerCase() === "abonnement" ? null : film.price;
    const actors = (film.actors ?? []).filter(Boolean).map((name) => ({ name }));

    return {
      title: film.title,
      description: film.description,
      productionHouse: film.productionHouse,
      productionCountry: film.country,
      type: film.type,
      rentalPrice,
      releaseDate: film.releaseDate,
      plateformDate: film.publishDate,
      format: film.format,
      category: film.category,
      entertainmentMode: "MOVIE",
      gender: film.genre,
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
      ["main_image", film.mainImage],
      ["secondary_image", film.secondaryImage],
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
    const descriptors = files.map((f) => ({ key: f.key, name: f.file.name, type: f.file.type }));
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

  const confirmSend = async () => {
    if (!pendingFilm) return;
    setDialogStatus("loading");
    setDialogResult(null);
    setProgressDetail(null);
    setUploadErrorDetail(null);

    try {
      const metadata = buildMetadataPayload(pendingFilm);
      const files = collectFiles(pendingFilm);
      console.log("[films] ready to submit", {
        action: pendingAction,
        filmId,
        metadata,
        files: files.map((f) => ({ key: f.key, name: f.file.name, type: f.file.type, size: f.file.size })),
      });

      setProgressStep("metadata");
      const createdFilmId = await submitMetadata(metadata);
      setFilmId(createdFilmId);

      if (files.length) {
        setProgressStep("presign");
        const slots = await requestUploadSlots(createdFilmId, files);

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
      await finalizeUploads(createdFilmId, slots);
    }

    setDialogStatus("success");
    setDialogResult("Film envoyé avec succès.");
    setProgressStep("idle");
    setProgressDetail(null);
    toast.success({
      title: "Film envoyé",
      description: "Les métadonnées et fichiers ont été transmis.",
    });
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
