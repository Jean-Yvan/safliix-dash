'use client';

import Header from "@/ui/components/header";
import { useState } from "react";
import { useToast } from "@/ui/components/toast/ToastProvider";
import { apiRequest } from "@/lib/api/client";
import { useAccessToken } from "@/lib/auth/useAccessToken";

type PromoForm = {
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
};

const initialForm: PromoForm = {
  name: "",
  startDate: "",
  endDate: "",
  isActive: true,
};

export default function Page() {
  const [form, setForm] = useState<PromoForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();
  const accessToken = useAccessToken();

  const handleChange = (key: keyof PromoForm, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiRequest("/promotions", {
        method: "POST",
        body: form,
        accessToken,
      });
      toast.success({ title: "Promo", description: "Promotion créée avec succès." });
      setForm(initialForm);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Impossible de créer la promo pour le moment.";
      toast.error({ title: "Promo", description: message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <Header title="Créer une promo" className="rounded-2xl border border-base-300 px-5 py-3" />

      <form onSubmit={handleSubmit} className="bg-neutral rounded-2xl border border-base-300 p-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <label className="form-control">
            <span className="label-text text-white/70 text-sm">Nom</span>
            <input
              type="text"
              className="input input-bordered bg-neutral text-white"
              placeholder="Black Friday"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </label>
          <label className="form-control">
            <span className="label-text text-white/70 text-sm">Actif</span>
            <select
              className="select select-bordered bg-neutral text-white"
              value={form.isActive ? "true" : "false"}
              onChange={(e) => handleChange("isActive", e.target.value === "true")}
            >
              <option value="true">Oui</option>
              <option value="false">Non</option>
            </select>
          </label>
          <label className="form-control">
            <span className="label-text text-white/70 text-sm">Date de début</span>
            <input
              type="date"
              className="input input-bordered bg-neutral text-white"
              value={form.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
              required
            />
          </label>
          <label className="form-control">
            <span className="label-text text-white/70 text-sm">Date de fin</span>
            <input
              type="date"
              className="input input-bordered bg-neutral text-white"
              value={form.endDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
              required
            />
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button type="submit" className="btn btn-primary rounded-full" disabled={submitting}>
            {submitting ? "Envoi..." : "Créer la promo"}
          </button>
          <button
            type="button"
            className="btn btn-ghost border-base-300 rounded-full"
            onClick={() => setForm(initialForm)}
            disabled={submitting}
          >
            Réinitialiser
          </button>
        </div>
      </form>
    </div>
  );
}
