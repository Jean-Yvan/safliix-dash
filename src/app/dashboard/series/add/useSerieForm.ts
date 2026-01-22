'use client';

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { seriesApi } from "@/lib/api/series";
import { useAccessToken } from "@/lib/auth/useAccessToken";
import { useToast } from "@/ui/components/toast/ToastProvider";
import { formatApiError } from "@/lib/api/errors";
import { withRetry } from "@/lib/api/retry";
import { SeriesFormData } from "./types";
import type { SeriesMetadataPayload } from "@/types/api/series";

export function useSeriesForm() {
  const toast = useToast();
  const accessToken = useAccessToken();

  const form = useForm<SeriesFormData>({
    defaultValues: {
      title: "",
      description: "",
      language: "",
      productionHouse: "",
      country: "",
      blockCountries: [],
      releaseDate: "",
      publishDate: "",
      category: "",
      seasonCount: null,
      genre: "",
      actors: [],
      director: "",
      ageRating: "",
      isSafliixProd: true,
      haveSubtitles: false,
      subtitleLanguages: [],
      rightHolderId: "",
      posterFile: null,
      heroFile: null,
      trailerFile: null,
    },
  });

  const [uiStep, setUiStep] = useState<"meta" | "files">("meta");
  const [seriesId, setSeriesId] = useState<string | null>(null);
  const [savingMeta, setSavingMeta] = useState(false);

  /* ---------------- build payload ---------------- */

  const buildMetadata = (data: SeriesFormData): SeriesMetadataPayload => ({
    title: data.title,
    description: data.description,
    productionHouse: data.productionHouse,
    productionCountry: data.country,
    releaseDate: data.releaseDate,
    plateformDate: data.publishDate,
    seasonCount: data.seasonCount,
    category: data.category,
    entertainmentMode: "SERIE",
    gender: data.genre,
    director: data.director,
    actors: data.actors.map((name : string) => ({ name })),
    isSafliixProd: data.isSafliixProd,
    haveSubtitles: data.haveSubtitles,
    subtitleLanguages: data.subtitleLanguages,
    mainLanguage: data.language,
    ageRating: data.ageRating || undefined,
    rightHolderId: data.rightHolderId || undefined,
    blockedCountries: data.blockCountries,
  });

  /* ---------------- step 1 : metadata ---------------- */

  const saveMetadata = async (data: SeriesFormData) => {
    setSavingMeta(true);
    try {
      const payload = buildMetadata(data);
      const { id } = await withRetry(
        () => seriesApi.create(payload, accessToken),
        { retries: 1 }
      );

      setSeriesId(id);
      setUiStep("files");

      toast.success({
        title: "Série",
        description: "Métadonnées enregistrées.",
      });
    } catch (err) {
      const friendly = formatApiError(err);
      toast.error({ title: "Série", description: friendly.message });
    } finally {
      setSavingMeta(false);
    }
  };

  useEffect(() =>{
    saveMetadata(form.getValues)
  })

  return {
    ...form,

    uiStep,
    seriesId,
    savingMeta,

    setUiStep,
    saveMetadata,
  };
}
