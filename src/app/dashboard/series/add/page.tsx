'use client';

import Header from "@/ui/components/header";
import UploadBox from "@/ui/specific/films/components/uploadBox";
import InputField, { MultipleInputField } from "@/ui/components/inputField";
import { Controller, useForm } from "react-hook-form";
import SuggestionsInput from "@/ui/components/suggestionField";
import { useEffect, useMemo, useState } from "react";
import ConfirmationDialog, { DialogStatus } from "@/ui/components/confirmationDialog";
import { seriesApi } from "@/lib/api/series";
import { uploadToPresignedUrl } from "@/lib/api/uploads";
import { useAccessToken } from "@/lib/auth/useAccessToken";
import { useToast } from "@/ui/components/toast/ToastProvider";
import { formatApiError } from "@/lib/api/errors";
import { withRetry } from "@/lib/api/retry";
import { type CountryEntry, getCountries } from "@/lib/countries";
import { type EpisodeUploadDescriptor, type SeriesMetadataPayload } from "@/types/api/series";

type SeriesFormData = {
  title: string;
  description: string;
  language: string;
  productionHouse: string;
  country: string;
  blockCountries: string[];
  releaseDate: string;
  publishDate: string;
  category: string;
  seasonCount: number | null;
  genre: string;
  actors: string[];
  director: string;
  ageRating: string;
  isSafliixProd: boolean;
  haveSubtitles: boolean;
  subtitleLanguages: string[];
  rightHolderId?: string;
  posterFile: File | null;
  heroFile: File | null;
  trailerFile: File | null;
};

export default function Page() {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SeriesFormData>({
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<"draft" | "publish">("draft");
  const [dialogStatus, setDialogStatus] = useState<DialogStatus>("idle");
  const [dialogResult, setDialogResult] = useState<string | null>(null);
  const [pendingData, setPendingData] = useState<SeriesFormData | null>(null);
  const [seriesId, setSeriesId] = useState<string | null>(null);
  const [countries, setCountries] = useState<CountryEntry[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uiStep, setUiStep] = useState<"meta" | "files">("meta");
  const [metaSaving, setMetaSaving] = useState(false);
  const toast = useToast();
  const accessToken = useAccessToken();
  const actorsValue = watch("actors");
  const posterFile = watch("posterFile");

  useEffect(() => {
    setCountries(getCountries("fr"));
  }, []);

  useEffect(() => {
    if (posterFile) {
      const url = URL.createObjectURL(posterFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [posterFile]);

  const openDialog = (action: "draft" | "publish", data: SeriesFormData) => {
    if (!seriesId) {
      toast.error({ title: "Fichiers", description: "Enregistrez d'abord les métadonnées." });
      return;
    }
    setDialogAction(action);
    setDialogResult(null);
    setDialogStatus("idle");
    setPendingData(data);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (dialogStatus === "loading") return;
    setDialogOpen(false);
    setDialogResult(null);
    setPendingData(null);
    setDialogStatus("idle");
  };

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
    actors: (data.actors ?? []).filter(Boolean).map((name) => ({ name })),
    isSafliixProd: data.isSafliixProd,
    haveSubtitles: data.haveSubtitles,
    subtitleLanguages: data.subtitleLanguages,
    mainLanguage: data.language,
    ageRating: data.ageRating || undefined,
    rightHolderId: data.rightHolderId || undefined,
    blockedCountries: data.blockCountries ?? [],
  });

  const confirmDialog = async () => {
    if (!pendingData) return;
    if (!seriesId) {
      toast.error({ title: "Fichiers", description: "Enregistrez d'abord les métadonnées." });
      return;
    }
    setDialogStatus("loading");
    setDialogResult(null);

    try {
      const files = [
        pendingData.posterFile ? { key: "poster" as const, file: pendingData.posterFile } : null,
        pendingData.heroFile ? { key: "hero" as const, file: pendingData.heroFile } : null,
        pendingData.trailerFile ? { key: "trailer" as const, file: pendingData.trailerFile } : null,
      ].filter(Boolean) as Array<{ key: "poster" | "hero" | "trailer"; file: File }>;

      if (files.length) {
        const slots = await seriesApi.presignUploads(
          seriesId,
          files.map((f) => {
            const attachmentMap: Record<string, EpisodeUploadDescriptor["attachmentType"]> = {
              poster: "POSTER",
              hero: "BANNER",
              trailer: "TRAILER",
            };
            return {
              key: f.key,
              name: f.file.name,
              type: f.file.type || "application/octet-stream",
              attachmentType: attachmentMap[f.key] ?? "BONUS",
            };
          }),
          accessToken,
        );
        for (const slot of slots) {
          const file = files.find((f) => f.key === slot.key)?.file;
          if (file) {
            await withRetry(() => uploadToPresignedUrl(slot.uploadUrl, file), { retries: 2 });
          }
        }
        await seriesApi.finalizeUploads(seriesId, slots, accessToken);
      }

      setDialogStatus("success");
      const msg = dialogAction === "publish" ? "Fichiers envoyés." : "Fichiers enregistrés.";
      setDialogResult(msg);
      toast.success({ title: "Série", description: msg });
    } catch (error) {
      const friendly = formatApiError(error);
      setDialogStatus("error");
      setDialogResult(friendly.message || "Échec de l'envoi des fichiers.");
      toast.error({ title: "Série", description: friendly.message });
    }
  };

  return (
    <div className="space-y-4">
      <Header
        title="Nouvelle série"
        className="rounded-2xl border border-base-300 shadow-sm px-5"
      >
        <div className="text-sm text-white/80 px-3 py-1 rounded-lg bg-base-200/60 border border-base-300">
          Étape {uiStep === "meta" ? "1/2 • Métadonnées" : "2/2 • Fichiers"}
        </div>
      </Header>

      <form
        onSubmit={handleSubmit(async (data) => {
          if (uiStep === "meta") {
            setMetaSaving(true);
            try {
              const metadata = buildMetadata(data);
              const { id } = await withRetry(() => seriesApi.create(metadata, accessToken), { retries: 1 });
              setSeriesId(id);
              toast.success({ title: "Métadonnées", description: "Série enregistrée. Ajoutez les fichiers si besoin." });
              setPendingData(data);
              setUiStep("files");
            } catch (error) {
              const friendly = formatApiError(error);
              toast.error({ title: "Métadonnées", description: friendly.message });
            } finally {
              setMetaSaving(false);
            }
            return;
          }
          if (!seriesId) {
            toast.error({ title: "Fichiers", description: "Enregistrez d'abord les métadonnées." });
            return;
          }
          openDialog("publish", data);
        })}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-neutral px-5 py-6 rounded-2xl shadow border border-base-300"
      >
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-base-200/40 border border-base-300 rounded-xl p-4 h-full flex items-center justify-center overflow-hidden">
            {previewUrl ? (
              <img src={previewUrl} alt="Aperçu" className="rounded-lg max-h-full object-cover" />
            ) : (
              <span className="text-white/70 text-sm text-center">Ajoutez l’image principale pour l’aperçu.</span>
            )}
          </div>
          {uiStep === "files" && (
            <>
              <div className="grid grid-cols-6 grid-rows-2 gap-4">
                <UploadBox
                  id="main"
                  label="Image principale"
                  className="row-span-2 col-span-3 min-h-[220px]"
                  onFileSelect={(file) => setValue("posterFile", file)}
                />
                <UploadBox
                  id="sec"
                  label="Image secondaire"
                  className="col-span-3 min-h-[100px]"
                  onFileSelect={(file) => setValue("heroFile", file)}
                />
                <UploadBox
                  id="qua"
                  label="Vidéo"
                  className="col-span-3 min-h-[100px]"
                  onFileSelect={(file) => setValue("trailerFile", file)}
                />
                <UploadBox
                  id="tert"
                  label="Bande annonce"
                  className="col-span-3 row-span-1 min-h-[100px]"
                  onFileSelect={(file) => setValue("trailerFile", file)}
                />
              </div>
              <div className="space-y-2">
                <label className="label text-sm mb-1" htmlFor="image">Acteurs à afficher</label>
                {(actorsValue ?? []).length ? (
                  <div className="flex gap-2 items-center flex-wrap">
                    {(actorsValue ?? []).map((name: string, index: number) => (
                      <UploadBox key={name + index} id={`image-${index}`} label={name} className="w-20 h-20" />
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-white/60 bg-base-200/60 border border-base-300 rounded-lg px-3 py-2">
                    Ajoutez des acteurs pour afficher leurs vignettes ici.
                  </div>
                )}
                <p className="text-xs text-white/60">Veillez à ce que la photo corresponde au nom sélectionné.</p>
              </div>
            </>
          )}
        </div>

        <div className="lg:col-span-8 flex flex-col gap-3">
          <div>
            <label className="label text-sm mb-1">Nom de la série</label>
            <Controller
              name="title"
              control={control}
              rules={{ required: "Titre de la série", minLength: { value: 1, message: "Au moins 1 caractère" } }}
              render={({ field }) => <InputField {...field} value={field.value ?? ""} className="input bg-base-200 border-base-300" />}
            />
            {errors.title && <p className="text-red-600 text-sm">{errors.title.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label text-sm mb-1">Maison de production</label>
              <Controller
                name="productionHouse"
                control={control}
                rules={{ required: "Obligatoire" }}
                render={({ field }) => <SuggestionsInput optionList={[]} {...field} value={field.value ?? ""} className="input bg-base-200 border-base-300" />}
              />
              {errors.productionHouse && <p className="text-red-600 text-sm">{errors.productionHouse.message}</p>}
            </div>
            <div>
              <label className="label text-sm mb-1">Pays de production</label>
              <Controller
                name="country"
                control={control}
                rules={{ required: "Obligatoire" }}
                render={({ field }) => <SuggestionsInput optionList={[]} {...field} value={field.value ?? ""} className="input bg-base-200 border-base-300" />}
              />
              {errors.country && <p className="text-red-600 text-sm">{errors.country.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label text-sm mb-1">Catégorie</label>
              <Controller
                name="category"
                control={control}
                rules={{ required: "Obligatoire" }}
                render={({ field }) => <SuggestionsInput optionList={[]} {...field} value={field.value ?? ""} className="input bg-base-200 border-base-300" />}
              />
              {errors.category && <p className="text-red-600 text-sm">{errors.category.message}</p>}
            </div>
            <div>
              <label className="label text-sm mb-1">Genre</label>
              <Controller
                name="genre"
                control={control}
                rules={{ required: "Obligatoire" }}
                render={({ field }) => <SuggestionsInput optionList={[]} {...field} value={field.value ?? ""} className="input bg-base-200 border-base-300" />}
              />
              {errors.genre && <p className="text-red-600 text-sm">{errors.genre.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label text-sm mb-1">Date de sortie de la série</label>
              <Controller
                name="releaseDate"
                control={control}
                rules={{ required: "Obligatoire" }}
                render={({ field }) => <InputField type="date" {...field} value={field.value ?? ""} className="input bg-base-200 border-base-300" />}
              />
              {errors.releaseDate && <p className="text-red-600 text-sm">{errors.releaseDate.message}</p>}
            </div>
            <div>
              <label className="label text-sm mb-1">Date de publication sur SaFLIX</label>
              <Controller
                name="publishDate"
                control={control}
                rules={{ required: "La date de publication sur SaFliix est obligatoire" }}
                render={({ field }) => <InputField type="date" {...field} value={field.value ?? ""} className="input bg-base-200 border-base-300" />}
              />
              {errors.publishDate && <p className="text-red-600 text-sm">{errors.publishDate.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label text-sm mb-1">Nombre de saisons</label>
              <Controller
                name="seasonCount"
                control={control}
                rules={{ required: "Obligatoire" }}
                render={({ field }) => (
                  <InputField
                    type="number"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
                    className="input bg-base-200 border-base-300"
                  />
                )}
              />
              {errors.seasonCount && <p className="text-red-600 text-sm">{errors.seasonCount.message}</p>}
            </div>
            <div>
              <label className="label text-sm mb-1">Réalisateur</label>
              <Controller
                name="director"
                control={control}
                rules={{ required: "Obligatoire" }}
                render={({ field }) => <InputField {...field} value={field.value ?? ""} className="input bg-base-200 border-base-300" />}
              />
              {errors.director && <p className="text-red-600 text-sm">{errors.director.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label text-sm mb-1">Nom des acteurs principaux</label>
              <Controller
                name="actors"
                control={control}
                rules={{ required: "Obligatoire" }}
                render={({ field }) => (
                  <ActorsSelector
                    value={field.value ?? []}
                    onChange={(val) => field.onChange(val)}
                  />
                )}
              />
              {errors.actors && <p className="text-red-600 text-sm">{errors.actors.message}</p>}
            </div>
            <div>
              <label className="label text-sm mb-1">Ayant droit</label>
              <Controller
                name="rightHolderId"
                control={control}
                render={({ field }) => (
                  <InputField
                    {...field}
                    value={field.value ?? ""}
                    className="input bg-base-200 border-base-300"
                    placeholder="ID de l'ayant droit"
                  />
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label text-sm mb-1">Pays bloqués</label>
              <Controller
                name="blockCountries"
                control={control}
                render={({ field }) => (
                  <CountryMultiSelect
                    availableCountries={countries}
                    value={field.value ?? []}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
            <div>
              <label className="label text-sm mb-1">Langues de sous-titres</label>
              <Controller
                name="subtitleLanguages"
                control={control}
                render={({ field }) => (
                  <InputField
                    {...field}
                    value={(field.value ?? []).join(", ")}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value
                          .split(",")
                          .map((v) => v.trim())
                          .filter(Boolean),
                      )
                    }
                    placeholder="Ex: fr, en"
                    className="input bg-base-200 border-base-300"
                  />
                )}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="label text-sm mb-1" htmlFor="image">Description de la série (synopsis)</label>
            <Controller
              name="description"
              control={control}
              rules={{ required: "La description est obligatoire" }}
              render={({ field }) => (
                <MultipleInputField
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  name={"description"}
                  className="bg-base-200 border-base-300"
                />
              )}
            />
            {errors.description && <p className="text-red-600 text-sm">{errors.description.message}</p>}
          </div>
          <div className="flex items-center gap-6">
            <Controller
              name="isSafliixProd"
              control={control}
              render={({ field }) => (
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  /> Production SaFlix
                </label>
              )}
            />
            <Controller
              name="haveSubtitles"
              control={control}
              render={({ field }) => (
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  /> Sous-titre
                </label>
              )}
            />
          </div>
          <div className="grid grid-cols-3 gap-3 items-end">
            <div>
              <label className="label text-sm mb-1">Langue</label>
              <Controller
                name="language"
                control={control}
                rules={{ required: "La langue est obligatoire" }}
                render={({ field }) => (
                  <SuggestionsInput optionList={[]} {...field} value={field.value ?? ""} className="input bg-base-200 border-base-300" />
                )}
              />
              {errors.language && <p className="text-red-600 text-sm">{errors.language.message}</p>}
            </div>
            <div>
              <label className="label text-sm mb-1">Classification (age)</label>
              <Controller
                name="ageRating"
                control={control}
                render={({ field }) => (
                  <InputField
                    {...field}
                    value={field.value ?? ""}
                    placeholder="Ex: R, PG-13"
                    className="input bg-base-200 border-base-300"
                  />
                )}
              />
            </div>
            <UploadBox id="trailer" label="Sous titre" className="w-full min-h-[80px]" />
          </div>

          <div className="w-full flex items-center justify-between gap-4 pt-2">
            {uiStep === "files" ? (
              <>
                <button
                  type="button"
                  className="btn btn-ghost text-white"
                  onClick={() => setUiStep("meta")}
                  disabled={metaSaving}
                >
                  Retour métadonnées
                </button>
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="btn bg-white text-black rounded-full px-6"
                    onClick={() => handleSubmit((data) => openDialog("draft", data))()}
                    disabled={metaSaving}
                  >
                    Enregistrer en brouillon
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary rounded-full px-8"
                    disabled={metaSaving}
                  >
                    Publier série
                  </button>
                </div>
              </>
            ) : (
              <div className="flex justify-end w-full">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={metaSaving}
                >
                  {metaSaving ? "Sauvegarde..." : "Continuer vers les fichiers"}
                </button>
              </div>
            )}
          </div>
        </div>
      </form>

      <ConfirmationDialog
        open={dialogOpen}
        title={dialogAction === "publish" ? "Envoyer les fichiers ?" : "Enregistrer les fichiers ?"}
        message="Seuls les fichiers seront envoyés."
        status={dialogStatus}
        resultMessage={dialogResult ?? undefined}
        confirmLabel={dialogAction === "publish" ? "Envoyer les fichiers" : "Enregistrer"}
        onConfirm={confirmDialog}
        onCancel={closeDialog}
      >
        {pendingData && (
          <div className="text-white/70 text-sm space-y-2">
            <p>ID série : {seriesId ?? "Non créé"}</p>
            <p>Fichiers à envoyer :</p>
            <ul className="list-disc list-inside space-y-1">
              {pendingData.posterFile && <li>Image principale : {pendingData.posterFile.name}</li>}
              {pendingData.heroFile && <li>Image secondaire : {pendingData.heroFile.name}</li>}
              {pendingData.trailerFile && <li>Bande annonce : {pendingData.trailerFile.name}</li>}
              {!pendingData.posterFile && !pendingData.heroFile && !pendingData.trailerFile && (
                <li className="text-white/60">Aucun fichier sélectionné</li>
              )}
            </ul>
          </div>
        )}
      </ConfirmationDialog>
    </div>
  );
}
function ActorsSelector({
  value,
  onChange,
}: {
  value: string[];
  onChange: (val: string[]) => void;
}) {
  const [input, setInput] = useState("");
  const [actors, setActors] = useState<string[]>(value ?? []);

  useEffect(() => {
    setActors((value ?? []).filter(Boolean));
  }, [value]);

  const commit = (name: string) => {
    const clean = name.trim();
    if (!clean) return;
    if (actors.includes(clean)) {
      setInput("");
      return;
    }
    const next = [...actors, clean];
    setActors(next);
    onChange(next);
    setInput("");
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input
          className="input input-bordered w-full bg-base-200 border-base-300"
          placeholder="Saisir ou sélectionner un acteur"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit(input);
            }
          }}
        />
        <button type="button" className="btn btn-primary btn-sm" onClick={() => commit(input)}>
          Ajouter
        </button>
      </div>
      {actors.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {actors.map((actor) => (
            <span key={actor} className="badge badge-outline border-primary/50 text-primary gap-2">
              {actor}
              <button
                type="button"
                className="btn btn-ghost btn-xs text-primary"
                onClick={() => {
                  const next = actors.filter((a) => a !== actor);
                  setActors(next);
                  onChange(next);
                }}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function CountryMultiSelect({
  availableCountries,
  value,
  onChange,
}: {
  availableCountries: CountryEntry[];
  value: string[];
  onChange: (codes: string[]) => void;
}) {
  const [search, setSearch] = useState("");
  const toggle = (code: string) => {
    if (value.includes(code)) {
      onChange(value.filter((c) => c !== code));
    } else {
      onChange([...value, code]);
    }
  };
  const filtered = useMemo(
    () =>
      availableCountries.filter(
        (c) =>
          c.code.toLowerCase().includes(search.toLowerCase()) ||
          c.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [availableCountries, search],
  );

  return (
    <div className="space-y-2">
      <input
        className="input input-bordered w-full bg-base-200 border-base-300"
        placeholder="Rechercher un pays"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="max-h-48 overflow-y-auto space-y-1 border border-base-300 rounded-lg p-2 bg-base-200/60">
        {filtered.map((country) => {
          const selected = value.includes(country.code);
          return (
            <label key={country.code} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                className="checkbox checkbox-sm checkbox-primary"
                checked={selected}
                onChange={() => toggle(country.code)}
              />
              <span className="text-lg">{country.flag}</span>
              <span className="text-white/80">{country.name}</span>
            </label>
          );
        })}
        {filtered.length === 0 && <div className="text-xs text-white/60">Aucun pays trouvé</div>}
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((code) => {
            const country = availableCountries.find((c) => c.code === code);
            return (
              <span
                key={code}
                className="badge badge-outline border-primary/40 text-primary gap-2"
                title={country?.name || code}
              >
                {country?.flag} {code}
                <button
                  type="button"
                  className="btn btn-ghost btn-xs text-primary"
                  onClick={() => toggle(code)}
                >
                  ✕
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
