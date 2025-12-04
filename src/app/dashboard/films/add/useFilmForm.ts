import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { filmsApi } from "@/lib/api/films";
import { uploadToPresignedUrl } from "@/lib/api/uploads";
import { formatApiError } from "@/lib/api/errors";
import { withRetry } from "@/lib/api/retry";
import { useToast } from "@/ui/components/toast/ToastProvider";
import { useSession } from "next-auth/react";
import { DialogStatus } from "@/ui/components/confirmationDialog";

export type FilmFormData = {
  title: string;
  description: string;
  status: string;
  language: string;
  productionHouse: string;
  country: string;
  type: string;
  price: number | null;
  releaseDate: string;
  publishDate: string;
  format: string;
  category: string;
  genre: string;
  actors: string;
  director: string;
  duration: string;
  secondType: string;
  mainImage: File | null;
  secondaryImage: File | null;
  trailerFile: File | null;
  movieFile: File | null;
};

export type SubmitAction = "draft" | "publish" | "update";

type FileSlotType = "main_image" | "secondary_image" | "trailer" | "movie";
type FileDescriptor = { key: FileSlotType; file: File };
type PresignedSlot = { key: FileSlotType; uploadUrl: string; finalUrl: string };
type MetadataPayload = Omit<FilmFormData, "mainImage" | "secondaryImage" | "trailerFile" | "movieFile">;
type ProgressStep = "idle" | "metadata" | "presign" | "upload" | "finalize";

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
      status: "",
      language: "",
      productionHouse: "",
      country: "",
      type: "",
      price: null,
      releaseDate: "",
      publishDate: "",
      format: "",
      category: "",
      genre: "",
      actors: "",
      director: "",
      duration: "",
      secondType: "",
      mainImage: null,
      secondaryImage: null,
      trailerFile: null,
      movieFile: null,
    },
  });

  const mainImage = watch("mainImage");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogStatus, setDialogStatus] = useState<DialogStatus>("idle");
  const [dialogResult, setDialogResult] = useState<string | null>(null);
  const [pendingFilm, setPendingFilm] = useState<FilmFormData | null>(null);
  const [pendingAction, setPendingAction] = useState<SubmitAction>("publish");
  const [filmId, setFilmId] = useState<string | null>(null);
  const [prefillLoading, setPrefillLoading] = useState(false);
  const [prefillError, setPrefillError] = useState<string | null>(null);
  const [progressStep, setProgressStep] = useState<ProgressStep>("idle");
  const [progressDetail, setProgressDetail] = useState<string | null>(null);
  const [uploadErrorDetail, setUploadErrorDetail] = useState<string | null>(null);
  const toast = useToast();
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

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
          status: film.status ?? "",
          language: film.language ?? "",
          productionHouse: film.productionHouse ?? "",
          country: film.country ?? "",
          type: film.type ?? "",
          price: film.price ?? null,
          releaseDate: film.releaseDate ?? "",
          publishDate: film.publishDate ?? "",
          format: film.format ?? "",
          category: film.category ?? "",
          genre: film.genre ?? "",
          actors: film.actors ?? "",
          director: film.director ?? "",
          duration: film.duration ?? "",
          secondType: film.secondType ?? "",
        };

        Object.entries(payload).forEach(([key, value]) => {
          setValue(key as keyof FilmFormData, value as never, { shouldValidate: false });
        });
      } catch (error) {
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
    const { mainImage, secondaryImage, trailerFile, movieFile, ...metadata } = film;
    return metadata;
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

  const submitMetadata = async ({ action, ...metadata }: MetadataPayload & { action: SubmitAction }) => {
    const payload: MetadataPayload = {
      ...metadata,
      status: metadata.status || (action === "publish" ? "publish" : metadata.status),
    };

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

  const confirmSend = async () => {
    if (!pendingFilm) return;
    setDialogStatus("loading");
    setDialogResult(null);
    setProgressDetail(null);
    setUploadErrorDetail(null);

    try {
      const metadata = buildMetadataPayload(pendingFilm);
      const files = collectFiles(pendingFilm);

      setProgressStep("metadata");
      const createdFilmId = await submitMetadata({
        ...metadata,
        action: pendingAction,
      });
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
    previewUrl,
    formState: { errors },
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
  };
}
