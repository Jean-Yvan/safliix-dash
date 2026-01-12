'use client';

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/ui/components/toast/ToastProvider";
import { promosApi } from "@/lib/api/subscriptions";
import { useAccessToken } from "@/lib/auth/useAccessToken";
import { formatApiError } from "@/lib/api/errors";
import type { DialogStatus } from "@/ui/components/confirmationDialog";
import type { PromotionPayload } from "@/types/api/subscriptions";

export function usePromoForm(id?: string) {
  const isEdit = !!id && id !== "new";
  const toast = useToast();
  const accessToken = useAccessToken();

  /* ---------------- form ---------------- */
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<PromotionPayload>({
    defaultValues: {
      name: "",
      startDate: "",
      endDate: "",
      description: "",
      isActive: true,
    },
  });

  /* ---------------- confirmation dialog ---------------- */
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogStatus, setDialogStatus] = useState<DialogStatus>("idle");
  const [dialogResult, setDialogResult] = useState<string | null>(null);
  const [pendingData, setPendingData] = useState<PromotionPayload | null>(null);

  const openConfirm = handleSubmit((data) => {
    setPendingData(data);
    setDialogOpen(true);
    setDialogStatus("idle");
    setDialogResult(null);
  });

  const closeDialog = () => {
    if (dialogStatus === "loading") return;
    setDialogOpen(false);
    setPendingData(null);
    setDialogStatus("idle");
  };

  /* ---------------- submit ---------------- */
  const confirmSubmit = async () => {
    if (!pendingData) return;

    setDialogStatus("loading");

    try {
      if (isEdit) {
        await promosApi.update(id!, pendingData, accessToken);
      } else {
        await promosApi.create(pendingData, accessToken);
      }

      toast.success({
        title: isEdit ? "Promotion modifiée" : "Promotion créée",
        description: "Opération effectuée avec succès.",
      });

      setDialogStatus("success");
      setDialogResult("Opération réussie.");
      reset();
      setTimeout(closeDialog, 800);
    } catch (err) {
      const friendly = formatApiError(err);
      setDialogStatus("error");
      setDialogResult(friendly.message || "Erreur serveur");
      toast.error({ title: "Promotion", description: friendly.message || "Erreur serveur" });
    }
  };

  /* ---------------- pré-remplissage édition ---------------- */
  useEffect(() => {
    if (!isEdit) return;

    promosApi
      .getById(id!, accessToken)
      .then((data) => {
        reset({
          name: data.name,
          startDate: data.startDate,
          endDate: data.endDate,
          description: data.description,
          isActive: data.isActive ?? true,
        });
      })
      .catch(() => {
        toast.error({
          title: "Chargement",
          description: "Impossible de charger la promotion.",
        });
      });
  }, [id, accessToken, reset]);

  return {
    isEdit,
    control,
    errors,
    isSubmitting,
    openConfirm,
    confirmSubmit,
    closeDialog,
    dialogOpen,
    dialogStatus,
    dialogResult,
    pendingData,
    reset
  };
}
