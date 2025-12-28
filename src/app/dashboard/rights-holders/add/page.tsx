'use client';

import { FormEvent, useState } from "react";
import Link from "next/link";
import Header from "@/ui/components/header";
import { useToast } from "@/ui/components/toast/ToastProvider";
import { imageRightsApi } from "@/lib/api/imageRights";
import { useAccessToken } from "@/lib/auth/useAccessToken";
import { formatApiError } from "@/lib/api/errors";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  scope: string;
  sharePercentage: string;
  startDate: string;
  endDate: string;
  status: "actif" | "en attente" | "expiré";
  legal: string;
  notes: string;
};

const initialState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  role: "",
  scope: "Portrait, bande-annonce, affiches",
  sharePercentage: "0",
  startDate: "",
  endDate: "",
  status: "en attente",
  legal: "",
  notes: "",
};

export default function Page() {
  const [form, setForm] = useState<FormState>(initialState);
  const [contents, setContents] = useState<string[]>([]);
  const [newContent, setNewContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();
  const accessToken = useAccessToken();

  const updateField = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddContent = () => {
    const value = newContent.trim();
    if (!value) return;
    if (!contents.includes(value)) {
      setContents((prev) => [...prev, value]);
    }
    setNewContent("");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone || undefined,
      role: form.role,
      scope: form.scope,
      sharePercentage: Number(form.sharePercentage) || 0,
      status: form.status,
      legalMentions: form.legal || undefined,
      notes: form.notes || undefined,
      startedAt: form.startDate || undefined,
      expiresAt: form.endDate || undefined,
    };

    imageRightsApi
      .create(payload, accessToken)
      .then(() => {
        toast.success({
          title: "Ayant droit créé",
          description: "Créé avec succès, prêt à être relié aux films/séries.",
        });
        setForm(initialState);
        setContents([]);
        setNewContent("");
      })
      .catch((err) => {
        const friendly = formatApiError(err);
        toast.error({ title: "Création", description: friendly.message });
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="space-y-4">
      <Header title="Ajouter un ayant droit" className="rounded-2xl border border-base-300 shadow-sm px-5">
        <div className="flex items-center gap-3 text-sm text-white/80">
          <Link href="/dashboard/rights-holders" className="btn btn-ghost btn-xs border-base-300 text-white rounded-full">
            Retour liste
          </Link>
          <span className="badge badge-outline border-primary/60 text-primary">Contrat image</span>
        </div>
      </Header>

      <form
        onSubmit={handleSubmit}
        className="bg-neutral border border-base-300 rounded-2xl p-5 space-y-5 shadow-sm"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-white/70">Prénom</label>
            <input
              className="input input-bordered w-full bg-base-200 border-base-300"
              value={form.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/70">Nom</label>
            <input
              className="input input-bordered w-full bg-base-200 border-base-300"
              value={form.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/70">Rôle / fonction</label>
            <input
              className="input input-bordered w-full bg-base-200 border-base-300"
              value={form.role}
              onChange={(e) => updateField("role", e.target.value)}
              placeholder="Acteur principal, figurant..."
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/70">Email</label>
            <input
              type="email"
              className="input input-bordered w-full bg-base-200 border-base-300"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/70">Téléphone</label>
            <input
              className="input input-bordered w-full bg-base-200 border-base-300"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="+229..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/70">Périmètre d'usage</label>
            <input
              className="input input-bordered w-full bg-base-200 border-base-300"
              value={form.scope}
              onChange={(e) => updateField("scope", e.target.value)}
              placeholder="Affiches, bande-annonce, réseaux sociaux..."
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/70">Partage de revenus (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              className="input input-bordered w-full bg-base-200 border-base-300"
              value={form.sharePercentage}
              onChange={(e) => updateField("sharePercentage", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/70">Statut</label>
            <select
              className="select select-bordered w-full bg-base-200 border-base-300"
              value={form.status}
              onChange={(e) => updateField("status", e.target.value)}
            >
              <option value="actif">Actif</option>
              <option value="en attente">En attente</option>
              <option value="expiré">Expiré</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/70">Début de validité</label>
            <input
              type="date"
              className="input input-bordered w-full bg-base-200 border-base-300"
              value={form.startDate}
              onChange={(e) => updateField("startDate", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/70">Fin de validité</label>
            <input
              type="date"
              className="input input-bordered w-full bg-base-200 border-base-300"
              value={form.endDate}
              onChange={(e) => updateField("endDate", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-white/70">Mentions légales / contrat</label>
            <textarea
              className="textarea textarea-bordered w-full bg-base-200 border-base-300"
              rows={4}
              value={form.legal}
              onChange={(e) => updateField("legal", e.target.value)}
              placeholder="Conditions de cession, territoires, supports autorisés..."
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/70">Notes internes</label>
            <textarea
              className="textarea textarea-bordered w-full bg-base-200 border-base-300"
              rows={4}
              value={form.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              placeholder="Contraintes spécifiques, validations à prévoir..."
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70">Contenus associés</p>
              <p className="text-xs text-white/50">Film, série ou campagne à lier dès la création.</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="input input-bordered w-48 bg-base-200 border-base-300"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Titre du contenu"
              />
              <button type="button" className="btn btn-primary btn-sm" onClick={handleAddContent}>
                Ajouter
              </button>
            </div>
          </div>
          {contents.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {contents.map((content) => (
                <span key={content} className="badge badge-outline border-primary/50 text-primary gap-2">
                  {content}
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs text-primary"
                    onClick={() => setContents((prev) => prev.filter((c) => c !== content))}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-white/60">Aucun contenu ajouté pour le moment.</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            className="btn btn-ghost border-base-300 text-white rounded-full"
            onClick={() => {
              setForm(initialState);
              setContents([]);
              setNewContent("");
            }}
          >
            Réinitialiser
          </button>
          <button type="submit" className="btn btn-primary rounded-full" disabled={submitting}>
            {submitting ? "Enregistrement..." : "Créer l'ayant droit"}
          </button>
        </div>
      </form>
    </div>
  );
}
