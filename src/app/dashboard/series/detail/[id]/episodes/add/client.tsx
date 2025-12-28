"use client";

import React, { useEffect, useMemo, useState } from "react";
import UploadBox from "@/ui/specific/films/components/uploadBox";
import { useEpisodeForm } from "./useEpisodeForm";

export default function SeriesEpisodeAddClient({ seriesId, seasonId }: { seriesId: string; seasonId: string }) {
  const {
    form,
    files,
    updateField,
    updateFile,
    statusOptions,
    submitDraft,
    submitPublish,
    step,
    message,
    success,
  } = useEpisodeForm(seriesId, seasonId);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [uiStep, setUiStep] = useState<"meta" | "files">("meta");

  const actorNames = useMemo(
    () =>
      (form.actors || "")
        .split(",")
        .map((name) => name.trim())
        .filter(Boolean),
    [form.actors],
  );

  useEffect(() => {
    if (files.video) {
      const url = URL.createObjectURL(files.video);
      setVideoPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setVideoPreview(null);
  }, [files.video]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (uiStep === "meta") {
      setUiStep("files");
      return;
    }
    submitPublish();
  };

  return (
    <form
      id="episode-form"
      onSubmit={handleSubmit}
      className="bg-neutral rounded-2xl border border-base-300 p-6 space-y-6 shadow-lg"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <div className="bg-base-200/40 border border-base-300 rounded-xl p-4 h-full flex items-center justify-center text-white/70">
            <span>Aperçu / aide visuelle (placeholder)</span>
          </div>
        </div>
        <div className="lg:col-span-8 space-y-6">
          {uiStep === "meta" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Nom de l'épisode">
                  <input
                    className="input input-bordered w-full"
                    placeholder="Titre"
                    value={form.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    required
                  />
                </Field>
                <Field label="Numéro d'épisode">
                  <input
                    className="input input-bordered w-full"
                    type="number"
                    placeholder="Ex: 1"
                    value={form.episodeNumber ?? ""}
                    onChange={(e) =>
                      updateField("episodeNumber", e.target.value === "" ? null : Number(e.target.value))
                    }
                    required
                  />
                </Field>
                <Field label="Date de sortie">
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    value={form.releaseDate}
                    onChange={(e) => updateField("releaseDate", e.target.value)}
                    required
                  />
                </Field>
                <Field label="Publication sur SaFLIX">
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    value={form.plateformDate}
                    onChange={(e) => updateField("plateformDate", e.target.value)}
                    required
                  />
                </Field>
                <Field label="Réalisateur">
                  <input
                    className="input input-bordered w-full"
                    placeholder="John Doe"
                    value={form.director}
                    onChange={(e) => updateField("director", e.target.value)}
                    required
                  />
                </Field>
                <Field label="Durée (minutes)">
                  <input
                    className="input input-bordered w-full"
                    placeholder="44"
                    type="number"
                    value={form.duration ?? ""}
                    onChange={(e) => updateField("duration", e.target.value === "" ? null : Number(e.target.value))}
                    required
                  />
                </Field>
                <Field label="Production personnalisée">
                  <label className="flex items-center gap-2 text-white/80 text-sm">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      checked={form.isCustomProduction}
                      onChange={(e) => updateField("isCustomProduction", e.target.checked)}
                    />
                    <span>Oui</span>
                  </label>
                </Field>
                <Field label="Statut">
                  <select
                    className="select select-bordered w-full"
                    value={form.status}
                    onChange={(e) => updateField("status", e.target.value)}
                  >
                    {statusOptions.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Description de l'épisode (synopsis)">
                <textarea
                  className="textarea textarea-bordered w-full min-h-[120px]"
                  placeholder="Résumé de l'épisode..."
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                />
              </Field>

              <Field label="Nom des acteurs principaux">
                <ActorsSelector
                  value={form.actors}
                  onChange={(val) => updateField("actors", val)}
                />
              </Field>

              <div className="flex justify-end gap-2">
                <button type="button" className="btn btn-primary" onClick={() => setUiStep("files")}>
                  Continuer vers les fichiers
                </button>
              </div>
            </>
          )}

          {uiStep === "files" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UploadBox
                  id="episode-poster"
                  label={files.poster ? files.poster.name : "Image principale"}
                  className="min-h-[220px]"
                  onFileSelect={(file) => updateFile("poster", file ?? undefined)}
                />
                <div className="space-y-2">
                  <VideoUpload
                    label="Fichier vidéo de l'épisode"
                    file={files.video}
                    onSelect={(file) => updateFile("video", file ?? undefined)}
                  />
                  {videoPreview && (
                    <button
                      type="button"
                      className="btn btn-outline btn-primary btn-sm"
                      onClick={() => setShowVideoModal(true)}
                    >
                      Prévisualiser la vidéo
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <span className="label-text text-white/70 text-sm mb-1">Acteurs à afficher</span>
                {actorNames.length === 0 ? (
                  <div className="text-xs text-white/60 bg-base-200/60 border border-base-300 rounded-lg px-3 py-2">
                    Ajoutez des acteurs pour afficher leurs vignettes ici.
                  </div>
                ) : (
                  <div className="flex gap-2 items-center flex-wrap">
                    {actorNames.map((label, index) => (
                      <div key={label + index} className="flex flex-col items-center gap-1">
                        <UploadBox
                          id={`episode-actor-${index}`}
                          label={label}
                          className="w-20 h-20"
                        />
                        <span className="text-xs text-white/60 max-w-[5rem] text-center">{label}</span>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-white/60">Veillez à ce que la photo corresponde à la sélection du nom de l’acteur.</p>
              </div>

              <div className="flex items-end gap-4">
                <div className="w-48">
                  <SubtitleUpload
                    label="Sous-titre"
                    file={files.subtitle}
                    onSelect={(file) => updateFile("subtitle", file ?? undefined)}
                  />
                </div>
              </div>

              <div className="flex justify-between gap-3 pt-2">
                <button type="button" className="btn btn-ghost text-white" onClick={() => setUiStep("meta")}>
                  Retour métadonnées
                </button>
                <div className="flex gap-3">
                  <button
                    className="btn btn-outline btn-ghost text-white"
                    onClick={(e) => {
                      e.preventDefault();
                      submitDraft();
                    }}
                    disabled={step === "loading"}
                    type="button"
                  >
                    {step === "loading" ? "Sauvegarde..." : "Enregistrer en brouillon"}
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={(e) => {
                      e.preventDefault();
                      submitPublish();
                    }}
                    disabled={step === "loading"}
                    type="button"
                  >
                    {step === "loading" ? "Publication..." : "Publier l'épisode"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

      </div>

      {step === "result" && (
        <div
          className={`alert ${success ? "alert-success" : "alert-error"} bg-base-100/10 border border-base-300`}
        >
          <span>{message ?? (success ? "Opération réussie" : "Une erreur est survenue")}</span>
        </div>
      )}

      {showVideoModal && videoPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-neutral rounded-2xl border border-base-300 p-4 max-w-4xl w-full shadow-lg space-y-3 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Prévisualisation vidéo</h3>
              <button
                className="btn btn-ghost btn-sm text-white"
                onClick={() => setShowVideoModal(false)}
              >
                Fermer
              </button>
            </div>
            <div className="flex-1 min-h-0">
              <video
                controls
                src={videoPreview}
                className="w-full h-full rounded-lg border border-base-300 object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

function VideoUpload({ label, file, onSelect }: { label: string; file?: File; onSelect: (file?: File) => void }) {
  return (
    <label className="flex flex-col justify-center border-2 border-dashed border-base-300 rounded-xl bg-base-100/5 min-h-[220px] cursor-pointer px-4 py-6 text-center text-white/80">
      <span className="text-4xl mb-2">🎬</span>
      <span className="text-sm">{file ? file.name : label}</span>
      <input
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => onSelect(e.target.files?.[0])}
      />
    </label>
  );
}

function SubtitleUpload({ label, file, onSelect }: { label: string; file?: File; onSelect: (file?: File) => void }) {
  return (
    <label className="w-full h-[64px] border-2 border-dashed border-base-300 rounded-xl text-white/70 text-sm bg-base-100/5 flex items-center justify-center gap-2 cursor-pointer">
      <span className="text-lg">⇪</span>
      <span>{file ? file.name : label}</span>
      <input
        type="file"
        accept=".srt,.vtt,text/plain"
        className="hidden"
        onChange={(e) => onSelect(e.target.files?.[0])}
      />
    </label>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="form-control w-full">
      <span className="label-text text-white/70 text-sm mb-1">{label}</span>
      {children}
    </label>
  );
}

const actorOptions = [
  "Jean Dupont",
  "Aïssatou Traoré",
  "Ibrahim Soglo",
  "Léa Mensah",
  "Gildas Aho",
];

function ActorsSelector({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  const [input, setInput] = React.useState("");
  const [actors, setActors] = React.useState<string[]>([]);

  React.useEffect(() => {
    const current = value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    setActors(current);
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
    onChange(next.join(", "));
    setInput("");
  };

  const suggestions = actorOptions.filter((opt) => !actors.includes(opt));

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input
          list="episode-actor-suggestions"
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
        <datalist id="episode-actor-suggestions">
          {suggestions.map((opt) => (
            <option key={opt} value={opt} />
          ))}
        </datalist>
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
                  onChange(next.join(", "));
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
