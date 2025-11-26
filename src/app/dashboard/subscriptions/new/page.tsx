'use client';

import Header from "@/ui/components/header";
import InputField from "@/ui/components/inputField";
import { Controller, useForm } from "react-hook-form";

type PlanForm = {
  name: string;
  price: number;
  currency: "XOF" | "EUR" | "USD";
  billing: "mensuel" | "annuel";
  trialDays: number;
  devices: number;
  quality: string;
  description: string;
};

export default function Page() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PlanForm>({
    defaultValues: {
      billing: "mensuel",
      currency: "XOF",
      trialDays: 0,
      devices: 1,
      quality: "HD",
    },
  });

  const onSubmit = (data: PlanForm) => {
    console.log("Plan à créer", data);
    alert("Plan créé (mock) !");
  };

  return (
    <div className="space-y-5">
      <Header title="Nouveau plan" className="rounded-2xl border border-base-300 px-5 py-3" />

      <form onSubmit={handleSubmit(onSubmit)} className="bg-neutral rounded-2xl border border-base-300 p-5 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label text-sm mb-1">Nom du plan</label>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Nom requis" }}
              render={({ field }) => <InputField {...field} className="input bg-base-200 border-base-300" />}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label text-sm mb-1">Prix</label>
              <Controller
                name="price"
                control={control}
                rules={{ required: "Prix requis", min: { value: 0, message: ">= 0" } }}
                render={({ field }) => <InputField type="number" {...field} className="input bg-base-200 border-base-300" />}
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className="label text-sm mb-1">Devise</label>
              <Controller
                name="currency"
                control={control}
                render={({ field }) => (
                  <select {...field} className="select bg-base-200 border-base-300 w-full">
                    <option value="XOF">XOF</option>
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                  </select>
                )}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label text-sm mb-1">Facturation</label>
            <Controller
              name="billing"
              control={control}
              render={({ field }) => (
                <div className="btn-group">
                  {["mensuel", "annuel"].map((b) => (
                    <button
                      key={b}
                      type="button"
                      className={`btn btn-sm ${field.value === b ? "btn-primary" : "btn-ghost"}`}
                      onClick={() => field.onChange(b)}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              )}
            />
          </div>
          <div>
            <label className="label text-sm mb-1">Essai (jours)</label>
            <Controller
              name="trialDays"
              control={control}
              render={({ field }) => <InputField type="number" {...field} className="input bg-base-200 border-base-300" />}
            />
          </div>
          <div>
            <label className="label text-sm mb-1">Appareils simultanés</label>
            <Controller
              name="devices"
              control={control}
              render={({ field }) => <InputField type="number" {...field} className="input bg-base-200 border-base-300" />}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label text-sm mb-1">Qualité max</label>
            <Controller
              name="quality"
              control={control}
              render={({ field }) => (
                <select {...field} className="select bg-base-200 border-base-300 w-full">
                  <option value="SD">SD</option>
                  <option value="HD">HD</option>
                  <option value="Full HD">Full HD</option>
                  <option value="4K">4K</option>
                </select>
              )}
            />
          </div>
          <div>
            <label className="label text-sm mb-1">Description</label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <textarea {...field} className="textarea bg-base-200 border-base-300 w-full min-h-[100px]" />
              )}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" className="btn btn-primary rounded-full px-6">Créer le plan</button>
          <a href="/dashboard/subscriptions" className="btn btn-ghost rounded-full border-base-300">Annuler</a>
        </div>
      </form>
    </div>
  );
}
