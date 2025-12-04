import { useState } from "react";
import { useEpisodeFormSteps } from "./useEpisodeFormSteps";

export type EpisodeForm = {
  title: string;
  releaseDate: string;
  publishDate: string;
  director: string;
  duration: string;
  synopsis: string;
  status: string;
  language: string;
  production: "saflix" | "subtitle" | "";
};

type EpisodeFiles = {
  poster?: File;
  video?: File;
  subtitle?: File;
};

type EpisodeMetadataPayload = Omit<EpisodeForm, "production"> & {
  isSaflix: boolean;
};

type EpisodeFileDescriptor = {
  kind: "poster" | "video" | "subtitle";
  file: File;
};

const statusOptions = ["Actif", "Brouillon", "Suspendu"];
const languageOptions = ["Français", "Anglais", "Espagnol"];
const productionLabel = {
  saflix: "Production SaFlix",
  subtitle: "Sous-titre",
} as const;

export function useEpisodeForm() {
  const [form, setForm] = useState<EpisodeForm>({
    title: "",
    releaseDate: "",
    publishDate: "",
    director: "",
    duration: "",
    synopsis: "",
    status: statusOptions[0],
    language: languageOptions[1],
    production: "",
  });
  const [files, setFiles] = useState<EpisodeFiles>({});

  const steps = useEpisodeFormSteps();

  const updateField = <K extends keyof EpisodeForm>(key: K, value: EpisodeForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateFile = (key: keyof EpisodeFiles, file?: File) => {
    setFiles((prev) => ({ ...prev, [key]: file }));
  };

  const buildMetadataPayload = (): EpisodeMetadataPayload => ({
    title: form.title,
    releaseDate: form.releaseDate,
    publishDate: form.publishDate,
    director: form.director,
    duration: form.duration,
    synopsis: form.synopsis,
    status: form.status,
    language: form.language,
    isSaflix: form.production === "saflix",
  });

  const collectFiles = (): EpisodeFileDescriptor[] => {
    const bucket: EpisodeFileDescriptor[] = [];
    if (files.poster) bucket.push({ kind: "poster", file: files.poster });
    if (files.video) bucket.push({ kind: "video", file: files.video });
    if (files.subtitle) bucket.push({ kind: "subtitle", file: files.subtitle });
    return bucket;
  };

  const submitDraft = () => {
    steps.setLoading();
    const meta = buildMetadataPayload();
    const uploadables = collectFiles();
    setTimeout(() => {
      steps.setResult(
        true,
        `Brouillon prêt pour "${meta.title || "épisode"}" (${uploadables.length} fichier(s))`
      );
    }, 400);
  };

  const submitPublish = () => {
    steps.setLoading();
    const meta = buildMetadataPayload();
    const uploadables = collectFiles();
    setTimeout(() => {
      steps.setResult(
        true,
        `Épisode prêt à publier : "${meta.title || "sans titre"}" (${uploadables.length} fichier(s))`
      );
    }, 400);
  };

  return {
    form,
    files,
    updateField,
    updateFile,
    statusOptions,
    languageOptions,
    productionLabel,
    buildMetadataPayload,
    collectFiles,
    submitDraft,
    submitPublish,
    ...steps,
  };
}
