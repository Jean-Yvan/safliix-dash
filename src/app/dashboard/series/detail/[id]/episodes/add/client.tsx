"use client";

import { useEpisodeForm } from "./useEpisodeForm";

type Props = {
  id: string;
};

export default function SeriesEpisodeAddClient({ id }: Props) {
  const {
    form,
    updateField,
    statusOptions,
    languageOptions,
    productionLabel,
    submitDraft,
    submitPublish,
    step,
    message,
    success,
  } = useEpisodeForm();

  return (
    <div className="bg-neutral rounded-2xl border border-base-300 p-6 space-y-6 shadow-lg">
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-7 grid grid-cols-2 gap-4">
          <UploadPlaceholder label="Image principale" />
          <UploadPlaceholder label="Upload épisode" />
        </div>
        <div className="col-span-5 space-y-3">
          <Field label="Nom de l'épisode">
            <input
              className="input input-bordered w-full"
              placeholder="Titre"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date de sortie">
              <input
                type="date"
                className="input input-bordered w-full"
                value={form.releaseDate}
                onChange={(e) => updateField("releaseDate", e.target.value)}
              />
            </Field>
            <Field label="Publication sur SaFLIX">
              <input
                type="date"
                className="input input-bordered w-full"
                value={form.publishDate}
                onChange={(e) => updateField("publishDate", e.target.value)}
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Réalisateur">
              <input
                className="input input-bordered w-full"
                placeholder="John Doe"
                value={form.director}
                onChange={(e) => updateField("director", e.target.value)}
              />
            </Field>
            <Field label="Durée">
              <input
                className="input input-bordered w-full"
                placeholder="44 min"
                value={form.duration}
                onChange={(e) => updateField("duration", e.target.value)}
              />
            </Field>
          </div>
        </div>
      </div>

      <Field label="Description de l'épisode (synopsis)">
        <textarea
          className="textarea textarea-bordered w-full min-h-[120px]"
          placeholder="Résumé de l'épisode..."
          value={form.synopsis}
          onChange={(e) => updateField("synopsis", e.target.value)}
        />
      </Field>

      <div className="grid grid-cols-12 gap-4 items-end">
        <div className="col-span-4">
          <fieldset className="bg-base-100/10 border border-base-300 rounded-xl p-3 space-y-2">
            <legend className="text-white/80 text-sm px-2">Type</legend>
            {(["saflix", "subtitle"] as const).map((value) => (
              <label key={value} className="flex items-center gap-2 text-white/80 text-sm">
                <input
                  type="radio"
                  name="production"
                  className="radio radio-primary radio-sm"
                  checked={form.production === value}
                  onChange={() => updateField("production", value)}
                />
                <span>{productionLabel[value]}</span>
              </label>
            ))}
          </fieldset>
        </div>

        <div className="col-span-3">
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

        <div className="col-span-3">
          <Field label="Langue">
            <select
              className="select select-bordered w-full"
              value={form.language}
              onChange={(e) => updateField("language", e.target.value)}
            >
              {languageOptions.map((lang) => (
                <option key={lang}>{lang}</option>
              ))}
            </select>
          </Field>
        </div>

        <div className="col-span-2">
          <UploadSmall label="Sous-titre" />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          className="btn btn-outline btn-ghost text-white"
          onClick={submitDraft}
          disabled={step === "loading"}
        >
          {step === "loading" ? "Sauvegarde..." : "Enregistrer en brouillon"}
        </button>
        <button
          className="btn btn-success"
          onClick={submitPublish}
          disabled={step === "loading"}
        >
          {step === "loading" ? "Publication..." : "Publier l'épisode"}
        </button>
      </div>

      {step === "result" && (
        <div
          className={`alert ${success ? "alert-success" : "alert-error"} bg-base-100/10 border border-base-300`}
        >
          <span>{message ?? (success ? "Opération réussie" : "Une erreur est survenue")}</span>
        </div>
      )}
    </div>
  );
}

function UploadPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center border-2 border-dashed border-base-300 rounded-xl bg-base-100/5 min-h-[220px]">
      <div className="text-4xl text-white/50 mb-2">☁️</div>
      <p className="text-white/70 text-sm">{label}</p>
    </div>
  );
}

function UploadSmall({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="w-full h-[64px] border-2 border-dashed border-base-300 rounded-xl text-white/70 text-sm bg-base-100/5 flex items-center justify-center gap-2"
    >
      <span className="text-lg">⇪</span>
      <span>{label}</span>
    </button>
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
