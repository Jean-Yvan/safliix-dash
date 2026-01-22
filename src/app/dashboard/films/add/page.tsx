'use client';

import React, { useEffect, useMemo, useState } from "react";
import Header from "@/ui/components/header";
import UploadBox from "@/ui/specific/films/components/uploadBox";
import InputField, { MultipleInputField } from "@/ui/components/inputField";
import ConfirmationDialog from "@/ui/components/confirmationDialog";
import { Controller, useWatch } from "react-hook-form";
import SuggestionsInput from "@/ui/components/suggestionField";
import { useSearchParams } from "next/navigation";
import { type CountryEntry, getCountries } from "@/lib/countries";
import Image from "next/image";
// Import du nouveau hook
import { useFilmForm } from "./useFilm";

import { FilmFormData } from "@/types/api/films";
import { SuggestionOption } from "./useFilmForm";

// --- 1. COMPOSANTS INTERNES (Intouchés) ---

function ActorsSelector({
  value,
  onChange,
  options,
}: {
  value: { actorId?: string; name: string }[];
  onChange: (val: { actorId?: string; name: string }[]) => void;
  options: SuggestionOption[]; // J'ai relaxé le type ici pour éviter les erreurs d'import manquants, tu peux remettre SuggestionOption si tu l'as exporté
}) {
  const [input, setInput] = React.useState("");
  const [actors, setActors] = React.useState<{ actorId?: string; name: string }[]>(value ?? []);

  useEffect(() => {
    setActors((value ?? []).filter((a) => a && a.name));
  }, [value]);

  const commit = (name: string) => {
    const clean = name.trim();
    if (!clean) return;
    const existing = actors.find((a) => a.name.toLowerCase() === clean.toLowerCase());
    if (existing) {
      setInput("");
      return;
    }
		console.log('from actor selector');
		console.dir(options, {depth:2});
    const matched = options.find((opt) => opt.label.toLowerCase() === clean.toLowerCase());
    const actor = matched ? { name: matched.label, actorId: matched.value !== matched.label ? matched.value : undefined } : { name: clean };
    const next = [...actors, actor];
    setActors(next);
    onChange(next);
    setInput("");
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input
          list="actor-suggestions"
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
        <datalist id="actor-suggestions">
          {options.map((opt,index) => (
            <option key={index} value={opt.label} />
          ))}
        </datalist>
      </div>
      {actors.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {actors.map((actor,index) => (
            <span key={index}	 className="badge badge-outline border-primary/50 text-primary gap-2">
              {actor.name}
              <button
                type="button"
                className="btn btn-ghost btn-xs text-primary"
                onClick={() => {
                  const next = actors.filter((a) => (a.actorId ?? a.name) !== (actor.actorId ?? actor.name));
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
  availableCountries: { code: string; name: string; flag: string }[];
  value: string[];
  onChange: (codes: string[]) => void;
}) {
  const [search, setSearch] = React.useState("");
  const showList = search.trim().length > 0;
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
      {showList && (
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
      )}
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

function VideoUpload({
  id,
  label,
  fileLabel,
  file,
  onSelect,
  onPreview,
}: {
  id: string;
  label: string;
  fileLabel: string;
  file: File | null;
  onSelect: (file?: File | null) => void;
  onPreview: (url: string) => void;
}) {
  return (
    <label
      htmlFor={id}
      className="flex flex-col justify-center border-2 border-dashed border-base-300 rounded-xl bg-base-100/5 min-h-[140px] cursor-pointer px-4 py-6 text-center text-white/80"
    >
      <span className="text-4xl mb-2">🎬</span>
      <span className="text-sm mb-2">{label}</span>
      <span className="text-xs text-white/60">{file ? file.name : fileLabel}</span>
      <input
        id={id}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => onSelect(e.target.files?.[0] ?? null)}
      />
      {file && (
        <div className="mt-2 flex justify-center">
          <button
            type="button"
            className="btn btn-outline btn-primary btn-xs"
            onClick={(e) => {
                e.preventDefault(); // Ajout important pour ne pas ouvrir le sélecteur de fichier
                const url = URL.createObjectURL(file);
                onPreview(url);
            }}
          >
            Prévisualiser
          </button>
        </div>
      )}
    </label>
  );
}

// --- 2. LA PAGE PRINCIPALE REFACTORISÉE ---

export default function Page() {

  // Utilisation du nouveau Hook structuré
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    trigger, // Ajouté pour valider manuellement l'étape 1
    
    // Engine & Dialog
    openConfirm,
    confirmSubmit,
    closeDialog,
    dialogOpen,
    dialogStatus,
    
    // State Objects
    upload, // Contient step, detail
    meta,   // Contient options, loading, error
		pendingData,
		resetEngine,
   
    setEntityId,
		entityId
  } = useFilmForm();

  const searchParams = useSearchParams();
  const [countries, setCountries] = useState<CountryEntry[]>([]);
  const [uiStep, setUiStep] = useState<"meta" | "files">("meta");
  
  // Watch fields
  const typeValue = useWatch({ control, name: "type" });
  const movieFile = useWatch({ control, name: "movieFile" }) as File | null;
  const trailerFile = useWatch({ control, name: "trailerFile" }) as File | null;
  const priceValue = useWatch({ control, name: "price" });

  // Video Preview State
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);

	const filmId = searchParams.get("id");
  useEffect(() => {
    //const id = searchParams.get("id");
    if (filmId) {
    setEntityId(filmId);
  }
  }, [filmId, setEntityId]);

  useEffect(() => {
    setCountries(getCountries("fr"));
  }, []);

  useEffect(() => {
  if (
    (typeValue || "").toLowerCase() === "abonnement" &&
    priceValue !== null
  ) {
    setValue("price", null, { shouldValidate: true });
  }
}, [typeValue, priceValue, setValue]);

  // Logique de navigation personnalisée
  const handleFormSubmit = async (data: FilmFormData) => {
    if (uiStep === "meta") {
        // Validation partielle avant de passer à l'étape suivante
        const isValid = await trigger(["title", "productionHouse", "country", "type", "releaseDate", "publishDate", "format", "category", "genre", "actors", "director", "duration", "description", "language"]);
        
        if (isValid) {
            setUiStep("files");
        }
        return;
    }
    // Si on est à l'étape files, on ouvre la modale de confirmation globale
    openConfirm(data);
  };

  return (
    <div className="space-y-4">
      <Header
        title="Edition de film"
        className="rounded-2xl border border-base-300 shadow-sm px-5"
      >
        <div className="text-sm text-white/80 flex items-center gap-3">
          <span className="px-3 py-1 rounded-lg bg-base-200/60 border border-base-300">
            Étape {uiStep === "meta" ? "1/2 • Métadonnées" : "2/2 • Fichiers"}
          </span>
        </div>
      </Header>

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="bg-neutral px-5 py-6 rounded-2xl shadow border border-base-300 space-y-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <div className="bg-base-200/40 border border-base-300 rounded-xl p-4 h-full flex items-center justify-center overflow-hidden">
              <Image src="/ICONE_SFLIX.png" alt="SaFlix" width={240} height={240} className="object-contain" />
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            
            {/* Gestion unifiée des erreurs et chargements via 'meta' */}
            {meta.loading && (
              <div className="alert alert-info bg-base-200/60 border border-base-300 text-sm text-white">
                Chargement des données...
              </div>
            )}
            {meta.error && (
              <div className="alert alert-error bg-red-900/40 border border-red-700 text-sm text-red-100">
                {meta.error}
              </div>
            )}

            {uiStep === "meta" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label text-sm mb-1" htmlFor="fullName">Nom du Film</label>
                    <Controller
                      name="title"
                      control={control}
                      rules={{
                        required: "Titre du film",
                        minLength: { value: 1, message: "Le film doit comporter au moins 1 caractères" },
                      }}
                      render={({ field }) => <InputField {...field} value={field.value ?? ""} className="input bg-base-200 border-base-300" />}
                    />
                    {errors.title && <p className="text-red-600 text-sm">{errors.title.message as string}</p>}
                  </div>
                  <div>
                    <label className="label text-sm mb-1">Maison de Production</label>
                    <Controller
                      name="productionHouse"
                      control={control}
                      rules={{ required: "La maison de production est obligatoire" }}
                      render={({ field }) => (
                        <SuggestionsInput
                          optionList={(meta.options?.productionHouses ?? []).map((item) => ({
														label:item,
														value:item
													}))}
                          {...field}
                          value={field.value ?? ""}
                          className="input bg-base-200 border-base-300"
                        />
                      )}
                    />
                    {errors.productionHouse && <p className="text-red-600 text-sm">{errors.productionHouse.message as string}</p>}
                  </div>
                  <div>
                    <label className="label text-sm mb-1">Pays de Production</label>
                    <Controller
                      name="country"
                      control={control}
                      rules={{ required: "Le pays de production est obligatoire" }}
                      render={({ field }) => (
                        <SuggestionsInput
                          optionList={(meta.options?.countries ?? []).map((item) => ({
														label:item,
														value:item
													}))}
                          {...field}
                          value={field.value ?? ""}
                          className="input bg-base-200 border-base-300"
                        />
                      )}
                    />
                    {errors.country && <p className="text-red-600 text-sm">{errors.country.message as string}</p>}
                  </div>
                  <div>
                    <label className="label text-sm mb-1">Type</label>
                    <Controller
                      name="type"
                      control={control}
                      rules={{ required: "Le type est obligatoire" }}
                      render={({ field }) => (
                        <select
                          {...field}
                          onChange={(e) => field.onChange(e.target.value)}
                          value={field.value ?? ""}
                          className="input bg-base-200 border-base-300"
                        >
                          <option value={"abonnement"}>Abonnement</option>
                          <option value={"location"}>Location</option>
                        </select>
                      )}
                    />
                    {errors.type && <p className="text-red-600 text-sm">{errors.type.message as string}</p>}
                  </div>
                  <div>
                    <label className="label text-sm mb-1">Prix de location</label>
                    <Controller
                      name="price"
                      control={control}
                      rules={{
                        validate: (val) => {
                          if ((typeValue || "").toLowerCase() === "abonnement") return true;
                          return val !== null && val !== undefined ? true : "Le prix est obligatoire";
                        },
                      }}
                      render={({ field }) => (
                        <InputField
                          type="number"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
                          disabled={(typeValue || "").toLowerCase() === "abonnement"}
                          className="input bg-base-200 border-base-300"
                        />
                      )}
                    />
                    {errors.price && <p className="text-red-600 text-sm">{errors.price.message as string}</p>}
                  </div>
                  <div>
                    <label className="label text-sm mb-1">Date de sortie du film</label>
                    <Controller
                      name="releaseDate"
                      control={control}
                      rules={{ required: "La date de sortie est obligatoire" }}
                      render={({ field }) => <InputField type="date" {...field} value={field.value ?? ""} className="input bg-base-200 border-base-300" />}
                    />
                    {errors.releaseDate && <p className="text-red-600 text-sm">{errors.releaseDate.message as string}</p>}
                  </div>
                  <div>
                    <label className="label text-sm mb-1">Date de publication sur SaFLIX</label>
                    <Controller
                      name="publishDate"
                      control={control}
                      rules={{ required: "La date de publication sur SaFliix est obligatoire" }}
                      render={({ field }) => <InputField type="date" {...field} value={field.value ?? ""} className="input bg-base-200 border-base-300" />}
                    />
                    {errors.publishDate && <p className="text-red-600 text-sm">{errors.publishDate.message as string}</p>}
                  </div>
                  <div>
                    <label className="label text-sm mb-1">Format</label>
                    <Controller
                      name="format"
                      control={control}
                      rules={{ required: "Le format est obligatoire" }}
                      render={({ field }) => (
                        <select
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="input bg-base-200 border-base-300"
                        >
                          <option value={"COURT-METRAGE"}>COURT-METRAGE</option>
                          <option value={"LONG-METRAGE"}>LONG-METRAGE</option>
                        </select>
                      )}
                    />
                    {errors.format && <p className="text-red-600 text-sm">{errors.format.message as string}</p>}
                  </div>
                  <div>
                    <label className="label text-sm mb-1">Catégorie</label>
                    <Controller
                      name="category"
                      control={control}
                      rules={{ required: "La catégorie est obligatoire" }}
                      render={({ field }) => (
                        <SuggestionsInput
                          optionList={(meta.options?.categories ?? []).map((item) => ({
														label:item.category,
														value:item.category
													}))}
                          {...field}
                          value={field.value ?? ""}
                          className="input bg-base-200 border-base-300"
                        />
                      )}
                    />
                    {errors.category && <p className="text-red-600 text-sm">{errors.category.message as string}</p>}
                  </div>
                  <div>
                    <label className="label text-sm mb-1">Genre</label>
                    <Controller
                      name="genre"
                      control={control}
                      rules={{ required: "Le genre est obligatoire" }}
                      render={({ field }) => (
                        <SuggestionsInput
                          optionList={(meta.options?.genres ?? []).map((item) => ({
														label:item.name,
														value:item.name
													}))}
                          {...field}
                          value={field.value ?? ""}
                          className="input bg-base-200 border-base-300"
                        />
                      )}
                    />
                    {errors.genre && <p className="text-red-600 text-sm">{errors.genre.message as string}</p>}
                  </div>
                  <div>
                    <label className="label text-sm mb-1">Nom des acteurs principaux</label>
                    <Controller
                      name="actors"
                      control={control}
                      rules={{ required: "Les acteurs sont obligatoires" }}
                      render={({ field }) => (
                        <ActorsSelector
                          value={field.value ?? []}
                          onChange={(val) => field.onChange(val)}
                          options={(meta.options?.actors ?? []).map((item) => ({
														label:item.name,
														value:item.id
													}))}
                        />
                      )}
                    />
                    {errors.actors && <p className="text-red-600 text-sm">{errors.actors.message as string}</p>}
                  </div>
                  <div>
                    <label className="label text-sm mb-1">Directeur de production</label>
                    <Controller
                      name="director"
                      control={control}
                      rules={{ required: "Le directeur est obligatoire" }}
                      render={({ field }) => <InputField  {...field} value={field.value ?? ""} className="input bg-base-200 border-base-300" />}
                    />
                    {errors.director && <p className="text-red-600 text-sm">{errors.director.message as string}</p>}
                  </div>
                  <div>
                    <label className="label text-sm mb-1">Durée du film</label>
                    <Controller
                      name="duration"
                      control={control}
                      rules={{ required: "La durée est obligatoire" }}
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
                    {errors.duration && <p className="text-red-600 text-sm">{errors.duration.message as string}</p>}
                  </div>
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
                    <label className="label text-sm mb-1">Ayant droit</label>
                    <Controller
                      name="rightHolderId"
                      control={control}
                      render={({ field }) => (
                        <SuggestionsInput
                          optionList={(meta.options?.rightHolders ?? []).map((item) => ({
														label: `${item.firstName} ${item.lastName}`,
														value: item.id
													}))}
                          {...field}
                          value={field.value ?? ""}
                          className="input bg-base-200 border-base-300"
                        />
                      )}
                    />
                  </div>

                  <div>
                    <label className="label text-sm mb-1">Type du programme</label>
                    <Controller
                      name="entertainmentMode"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="input bg-base-200 border-base-300"
                        >
                          <option>Film</option>
                          <option>Divers</option>
                        </select>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="label text-sm mb-1" htmlFor="image">Description du film (synopsis)</label>
                  <Controller
                    name="description"
                    control={control}
                    rules={{ required: "La description est obligatoire" }}
                    render={({ field }) => (
                      <MultipleInputField
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        name="description"
                        className="bg-base-200 border-base-300"
                      />
                    )}
                  />
                  {errors.description && <p className="text-red-600 text-sm">{errors.description.message as string}</p>}
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
                        />
                        Production SaFlix
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
                        />
                        Sous-titre
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
                        <SuggestionsInput
                          optionList={(meta.options?.languages ?? []).map((item) => ({
														label:item,
														value:item
													}))}
                          {...field}
                          value={field.value ?? ""}
                          className="input bg-base-200 border-base-300"
                        />
                      )}
                    />
                    {errors.language && <p className="text-red-600 text-sm">{errors.language.message as string}</p>}
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

                <div className="flex justify-end">
                  <button
                    type="submit" // Changé en submit pour déclencher handleFormSubmit et trigger validation
                    className="btn btn-primary"
                    disabled={meta.loading || dialogStatus === 'loading'}
                  >
                    {dialogStatus === 'loading' ? "Chargement..." : "Continuer vers les fichiers"}
                  </button>
                </div>
              </>
            )}

            {uiStep === "files" && (
              <>
                <div className="grid grid-cols-6 grid-rows-2 gap-4">
                  <UploadBox
                    id="main"
                    label="Image principale"
                    className="row-span-2 col-span-3 min-h-[220px]"
                    onFileSelect={(file) => setValue("mainImage", file ?? null, { shouldValidate: true })}
                  />
                  <UploadBox
                    id="sec"
                    label="Image secondaire"
                    className="col-span-3 min-h-[100px]"
                    onFileSelect={(file) => setValue("secondaryImage", file ?? null, { shouldValidate: false })}
                  />
                  <VideoUpload
                    id="film-file"
                    label={typeValue?.toLowerCase() === "abonnement" ? "Vidéo (optionnel)" : "Vidéo du film"}
                    fileLabel="Choisir une vidéo"
                    file={movieFile}
                    onSelect={(file) => setValue("movieFile", file ?? null, { shouldValidate: false })}
                    onPreview={(url) => {
                      setVideoPreview(url);
                      setShowVideoModal(true);
                    }}
                  />
                  <VideoUpload
                    id="trailer-file"
                    label="Bande annonce"
                    fileLabel="Choisir une bande annonce"
                    file={trailerFile}
                    onSelect={(file) => setValue("trailerFile", file ?? null, { shouldValidate: false })}
                    onPreview={(url) => {
                      setVideoPreview(url);
                      setShowVideoModal(true);
                    }}
                  />
                </div>

                <div className="flex items-center gap-3 pt-2 justify-between">
                  <button
                    type="button"
                    className="btn btn-ghost text-white"
                    onClick={() => setUiStep("meta")}
                  >
                    Retour métadonnées
                  </button>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="btn btn-outline btn-ghost text-white"
                      onClick={handleSubmit((data) => openConfirm(data))} // Enregistrer brouillon = tout envoyer
                      disabled={meta.loading || dialogStatus === 'loading'}
                    >
                      Enregistrer en brouillon
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary rounded-full px-8"
                      disabled={meta.loading || dialogStatus === 'loading'}
                    >
                      {dialogStatus === 'loading' ? "Traitement..." : "Publier le film"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </form>

      {/* MODALE DE PRÉVISUALISATION VIDÉO */}
      {showVideoModal && videoPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-neutral rounded-2xl border border-base-300 p-4 max-w-4xl w-full shadow-lg space-y-3 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Prévisualisation vidéo</h3>
              <button
                className="btn btn-ghost btn-sm text-white"
                onClick={() => {
                    setShowVideoModal(false);
                    setVideoPreview(null);
                }}
              >✕</button>
            </div>
            <div className="relative w-full h-full bg-black rounded-lg overflow-hidden flex items-center justify-center">
                <video src={videoPreview} controls className="max-w-full max-h-[70vh]" />
            </div>
          </div>
        </div>
      )}

      {/* MODALE DE CONFIRMATION GLOBALE (Connectée à l'Engine) */}
      <ConfirmationDialog
        open={dialogOpen}
        // Titre dynamique selon l'étape UI
        title={
          uiStep === "meta"
            ? (entityId ? "Mettre à jour les infos ?" : "Enregistrer le brouillon ?")
            : "Publier le film ?"
        }
        // Message dynamique
        message={
          uiStep === "meta"
            ? "Les métadonnées seront sauvegardées. Vous pourrez ensuite passer à l'ajout des fichiers."
            : "Vous êtes sur le point d'envoyer les fichiers définitifs vers le serveur."
        }
        status={dialogStatus}
        // Bouton de confirmation
        confirmLabel={uiStep === "meta" ? "Sauvegarder et Continuer" : "Envoyer les fichiers"}
        
        onCancel={() => {
          closeDialog();
          // Si on annule pendant l'étape meta, on peut vouloir reset le status
          if (dialogStatus === 'error') resetEngine(); 
        }}
        
        onConfirm={confirmSubmit}
      >
        {/* 1. ÉTAT DE CHARGEMENT / PROGRESSION */}
        {(dialogStatus === "loading" || upload.step !== 'idle') && (
          <div className="text-sm text-white/80 space-y-2 mt-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="loading loading-spinner loading-xs text-primary" />
              <span className="font-semibold">
                {/* Mapping des étapes du nouveau moteur vers tes textes */}
                {upload.step === "idle" && "Préparation..."}
                {upload.step === "presign" && "Sécurisation de l'envoi..."}
                {upload.step === "upload" && "Transfert des fichiers vers le cloud..."}
                {upload.step === "finalize" && "Finalisation et enregistrement..."}
              </span>
            </div>
            
            {/* Barre de progression visuelle */}
            {upload.step === 'upload' && (
               <progress className="progress progress-primary w-full" />
            )}
            
            <p className="text-xs text-white/50 italic pl-6">
               {upload.detail || "Veuillez patienter..."}
            </p>
          </div>
        )}

        {/* 2. GESTION DES ERREURS */}
        {dialogStatus === "error" && (
          <div className="mt-4 text-sm rounded-lg border border-red-600/60 bg-red-900/40 text-red-200 px-3 py-2 flex items-start gap-2">
            <span>⚠️</span>
            <span>Une erreur est survenue lors du traitement. Veuillez réessayer.</span>
          </div>
        )}

        {/* 3. RÉSUMÉ DES DONNÉES (PENDING FILM) */}
        {/* On affiche le résumé seulement si on n'est pas en train de charger/upload */}
        {pendingData && dialogStatus !== "loading" && upload.step === 'idle' && (
          <div className="mt-4 bg-base-100/40 border border-base-300 rounded-xl p-4 text-sm text-white/80 space-y-3">
            
            {/* CAS 1 : RÉSUMÉ MÉTADONNÉES */}
            {uiStep === "meta" ? (
              <>
                <h4 className="font-bold text-white mb-2 border-b border-white/10 pb-1">Récapitulatif</h4>
                <div className="flex justify-between">
                  <span className="text-white/60">Titre</span>
                  <span className="font-medium text-white">{pendingData.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Type</span>
                  <span>{pendingData.type || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Format</span>
                  <span>{pendingData.format || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Genre</span>
                  <span>{pendingData.genre || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Acteurs</span>
                  <span>{pendingData.actors?.length || 0} sélectionné(s)</span>
                </div>
              </>
            ) : (
              /* CAS 2 : RÉSUMÉ FICHIERS */
              <>
                <p className="font-bold text-white mb-2 border-b border-white/10 pb-1">Fichiers prêts à l'envoi</p>
                <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                  {/* On vérifie chaque fichier présent dans pendingData */}
                  {pendingData.mainImage ? (
                    <li className="text-green-400">Image principale : <span className="text-white/70">{pendingData.mainImage.name}</span></li>
                  ) : <li className="text-white/30">Pas d'image principale</li>}
                  
                  {pendingData.movieFile ? (
                    <li className="text-blue-400">Vidéo du film : <span className="text-white/70">{pendingData.movieFile.name}</span></li>
                  ) : <li className="text-white/30">Pas de vidéo de film</li>}
                  
                  {pendingData.trailerFile ? (
                    <li className="text-yellow-400">Bande annonce : <span className="text-white/70">{pendingData.trailerFile.name}</span></li>
                  ) : <li className="text-white/30">Pas de bande annonce</li>}
                </ul>
                
                {(!pendingData.movieFile && !pendingData.trailerFile && !pendingData.mainImage) && (
                   <div className="alert alert-warning text-xs py-2 mt-2">
                     Aucun nouveau fichier n'a été sélectionné. Seules les métadonnées seront mises à jour.
                   </div>
                )}
              </>
            )}
          </div>
        )}
      </ConfirmationDialog>
    </div>
  );
}