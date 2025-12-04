'use client';

import { useState } from "react";
import Header from "@/ui/components/header";
import InputField from "@/ui/components/inputField";
import ConfirmationDialog, { DialogStatus } from "@/ui/components/confirmationDialog";
import { Controller, useForm } from "react-hook-form";
import { useToast } from "@/ui/components/toast/ToastProvider";
import { withRetry } from "@/lib/api/retry";
import { formatApiError } from "@/lib/api/errors";
import { plansApi } from "@/lib/api/subscriptions";
import { useAccessToken } from "@/lib/auth/useAccessToken";

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogStatus, setDialogStatus] = useState<DialogStatus>("idle");
  const [dialogResult, setDialogResult] = useState<string | null>(null);
  const [pendingPlan, setPendingPlan] = useState<PlanForm | null>(null);
  const toast = useToast();
  const accessToken = useAccessToken();

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
    setPendingPlan(data);
    setDialogOpen(true);
    setDialogStatus("idle");
    setDialogResult(null);
  };

  const closeDialog = () => {
    if (dialogStatus === "loading") return;
    setDialogOpen(false);
    setDialogResult(null);
    setDialogStatus("idle");
  };

  const confirmSend = async () => {
    if (!pendingPlan) return;

    setDialogStatus("loading");
    setDialogResult(null);

    try {
      await withRetry(() =>
        plansApi.create(
          {
            name: pendingPlan.name,
            price: pendingPlan.price,
            period: pendingPlan.billing,
            features: pendingPlan.description ? [pendingPlan.description] : [],
            status: "active",
            devices: pendingPlan.devices,
            quality: pendingPlan.quality,
            currency: pendingPlan.currency,
          },
          accessToken,
        ),
      );

      setDialogStatus("success");
      setDialogResult("Plan créé avec succès.");
      toast.success({
        title: "Plan",
        description: "Plan créé avec succès.",
      });
    } catch (error) {
      setDialogStatus("error");
      const friendly = formatApiError(error);
      setDialogResult(friendly.message || "Échec de la création du plan.");
      toast.error({
        title: "Plan",
        description: friendly.message || "Impossible de créer le plan.",
      });
    }
  };

  return (
    <>
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

      <ConfirmationDialog
        open={dialogOpen}
        title="Confirmer la création du plan"
        message="Vérifiez les informations avant de les envoyer au back."
        status={dialogStatus}
        resultMessage={dialogResult}
        confirmLabel="Envoyer"
        onCancel={closeDialog}
        onConfirm={confirmSend}
      >
        {pendingPlan && (
          <div className="bg-base-100/10 border border-base-300 rounded-xl p-3 text-sm text-white/80 space-y-2">
            <div className="flex justify-between">
              <span className="text-white/60">Nom</span>
              <span>{pendingPlan.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Tarif</span>
              <span>{pendingPlan.price} {pendingPlan.currency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Facturation</span>
              <span>{pendingPlan.billing}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Essai</span>
              <span>{pendingPlan.trialDays} jours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Appareils</span>
              <span>{pendingPlan.devices}</span>
            </div>
          </div>
        )}
      </ConfirmationDialog>
    </>
  );
}
