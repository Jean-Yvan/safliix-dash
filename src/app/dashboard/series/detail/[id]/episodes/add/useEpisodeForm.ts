import { useState } from "react";
import { seriesApi } from "@/lib/api/series";
import { formatApiError } from "@/lib/api/errors";
import { uploadToPresignedUrl } from "@/lib/api/uploads";
import { useToast } from "@/ui/components/toast/ToastProvider";
import { useAccessToken } from "@/lib/auth/useAccessToken";
import { useEpisodeFormSteps } from "./useEpisodeFormSteps";

export type EpisodeForm = {
  title: string;
  description: string;
  isCustomProduction: boolean;
  status: string;
  duration: number | null;
  releaseDate: string;
  plateformDate: string;
  director: string;
  episodeNumber: number | null;
  actors: string;
};

type EpisodeFiles = {
  poster?: File;
  video?: File;
  subtitle?: File;
};

type EpisodeFileDescriptor = {
  kind: "poster" | "video" | "subtitle";
  file: File;
};

const statusOptions = ["DRAFT", "PUBLISHED"] as const;

export function useEpisodeForm(seriesId?: string, seasonId?: string) {
  const [form, setForm] = useState<EpisodeForm>({
    title: "",
    description: "",
    isCustomProduction: true,
    status: statusOptions[0],
    duration: null,
    releaseDate: "",
    plateformDate: "",
    director: "",
    episodeNumber: null,
    actors: "",
  });
  const [files, setFiles] = useState<EpisodeFiles>({});

  const steps = useEpisodeFormSteps();
  const toast = useToast();
  const accessToken = useAccessToken();

  const updateField = <K extends keyof EpisodeForm>(key: K, value: EpisodeForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateFile = (key: keyof EpisodeFiles, file?: File) => {
    setFiles((prev) => ({ ...prev, [key]: file }));
  };

  const buildMetadataPayload = () => ({
    title: form.title,
    description: form.description,
    isCustomProduction: form.isCustomProduction,
    status: form.status,
    duration: form.duration ?? 0,
    releaseDate: form.releaseDate,
    plateformDate: form.plateformDate,
    director: form.director,
    episodeNumber: form.episodeNumber ?? 0,
  });

  const collectFiles = (): EpisodeFileDescriptor[] => {
    const bucket: EpisodeFileDescriptor[] = [];
    if (files.poster) bucket.push({ kind: "poster", file: files.poster });
    if (files.video) bucket.push({ kind: "video", file: files.video });
    if (files.subtitle) bucket.push({ kind: "subtitle", file: files.subtitle });
    return bucket;
  };

  const submit = async (action: "draft" | "publish") => {
    if (!seasonId) {
      steps.setResult(false, "Aucune saison cible.");
      toast.error({ title: "Episode", description: "Aucune saison cible." });
      return;
    }

    steps.setLoading();
    try {
      const meta = { ...buildMetadataPayload(), status: action === "publish" ? "PUBLISHED" : "DRAFT" };
      const uploadables = collectFiles();

      const { id: episodeId } = await seriesApi.createEpisode(seriesId ?? "", seasonId, meta, accessToken);

      if (uploadables.length) {
        const slots = await seriesApi.presignEpisodeUploads(
          episodeId,
          uploadables.map((f) => ({ key: f.kind, name: f.file.name, type: f.file.type })),
          accessToken,
        );

        for (const slot of slots) {
          const file = uploadables.find((f) => f.kind === slot.key)?.file;
          if (file) {
            await uploadToPresignedUrl(slot.uploadUrl, file);
          }
        }

        await seriesApi.finalizeEpisodeUploads(
          episodeId,
          slots.map((s) => ({ key: s.key, finalUrl: s.finalUrl })),
          accessToken,
        );
      }

      steps.setResult(true, action === "publish" ? "Episode publié." : "Brouillon enregistré.");
      toast.success({
        title: "Episode",
        description: action === "publish" ? "Episode publié." : "Brouillon enregistré.",
      });
    } catch (error) {
      const friendly = formatApiError(error);
      steps.setResult(false, friendly.message);
      toast.error({ title: "Episode", description: friendly.message });
    }
  };

  return {
    form,
    files,
    updateField,
    updateFile,
    statusOptions,
    buildMetadataPayload,
    collectFiles,
    submitDraft: () => submit("draft"),
    submitPublish: () => submit("publish"),
    ...steps,
  };
}
