"use client";

import Header from "@/ui/components/header";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { useToast } from "@/ui/components/toast/ToastProvider";

const poster = "/Disponible.jpg";

type Status = "Actif" | "Brouillon" | "Archivé";

export default function Page() {
  const toast = useToast();
  const [title, setTitle] = useState("Ni lui Ni moi");
  const [description, setDescription] = useState(
    "politiamque nec voluitat vnt consque nebtion. Sed posuere quam ol menna ultric ondimentum ultrices lacus. Aenean ao lobor moltur. Curabitur cursus eu in ur varius. Praesent volutpat elit idconsi gi. Praesent ullamcorper dui et ulrlcs. Praesent pulvinar, diam, in vita....",
  );
  const [startDate, setStartDate] = useState("2023-08-23");
  const [endDate, setEndDate] = useState("2023-08-23");
  const [line, setLine] = useState("3");
  const [status, setStatus] = useState<Status>("Actif");

  const onSave = (variant: "draft" | "publish") => {
    toast.success({
      title: variant === "draft" ? "Brouillon enregistré" : "Pub publiée",
      description: variant === "draft" ? "Votre pub est enregistrée en brouillon." : "La pub est prête à être diffusée.",
    });
  };

  return (
    <div className="space-y-5">
      <Header title="Espace disponibilité" className="rounded-xl px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="badge badge-success badge-sm px-3 py-1 text-xs rounded-full">Disponible</span>
          <Link href="/dashboard/pub" className="btn btn-outline btn-sm border-base-300 text-white">
            Liste
          </Link>
        </div>
      </Header>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <div className="relative h-60 overflow-hidden rounded-2xl border border-base-300/60 bg-base-200/60 shadow-lg">
            <img src={poster} alt="Prévisualisation horizontale" className="h-full w-full object-cover" />
            <div className="absolute left-4 top-4 flex items-center gap-2">
              <span className="badge badge-success badge-sm px-3 py-1 rounded-full">Disponible</span>
            </div>
            <div className="absolute bottom-4 left-6 text-4xl font-black text-white drop-shadow">DU ROI</div>
          </div>

          <form
            className="space-y-3 rounded-2xl border border-base-300/60 bg-base-200/60 p-4 shadow-lg"
            onSubmit={(e) => e.preventDefault()}
          >
            <FormField label="Nom de la pub">
              <input
                type="text"
                className="input input-bordered w-full bg-base-100 text-white"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormField>

            <FormField label="Description">
              <textarea
                className="textarea textarea-bordered w-full bg-base-100 text-white min-h-[140px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Mise en ligne">
                <input
                  type="date"
                  className="input input-bordered w-full bg-base-100 text-white"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </FormField>
              <FormField label="Mise hors ligne">
                <input
                  type="date"
                  className="input input-bordered w-full bg-base-100 text-white"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Lien">
                <select
                  className="select select-bordered w-full bg-base-100 text-white"
                  value={line}
                  onChange={(e) => setLine(e.target.value)}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </FormField>
              <FormField label="Statut">
                <select
                  className="select select-bordered w-full bg-base-100 text-white"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Status)}
                >
                  <option value="Actif">Actif</option>
                  <option value="Brouillon">Brouillon</option>
                  <option value="Archivé">Archivé</option>
                </select>
              </FormField>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button type="button" className="btn btn-outline rounded-full px-6 text-white" onClick={() => onSave("draft")}>
                Enregistrer en brouillon
              </button>
              <button type="button" className="btn btn-primary rounded-full px-6 text-black font-semibold" onClick={() => onSave("publish")}>
                Publier pub
              </button>
            </div>
          </form>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-3">
          <div className="relative overflow-hidden rounded-2xl border border-base-300/60 bg-base-200/60 shadow-lg">
            <img src={poster} alt="Prévisualisation verticale" className="w-full object-cover" />
            <div className="absolute left-4 top-4">
              <span className="badge badge-success badge-sm px-3 py-1 rounded-full">Disponible</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="form-control w-full">
      <div className="label pb-1">
        <span className="label-text text-xs uppercase tracking-wide text-white/70">{label}</span>
      </div>
      {children}
    </label>
  );
}
