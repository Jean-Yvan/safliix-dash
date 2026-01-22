import { useState } from "react";

export type UploadStep = "idle" | "presign" | "upload" | "finalize" | "error";

export type UploadFileDescriptor<TSlot extends string> = {
  key: TSlot;
  file: File;
};

export type PresignedSlot<TSlot extends string> = {
  key: TSlot;
  uploadUrl: string;
  finalUrl: string;
};

type UploadWorkflowConfig<TSlot extends string> = {
  presign: (files: UploadFileDescriptor<TSlot>[]) => Promise<PresignedSlot<TSlot>[]>;
  uploadToUrl: (uploadUrl: string, file: File) => Promise<void>;
  finalize: (uploads: { key: TSlot; finalUrl: string }[]) => Promise<void>;
};

// ... (tes types restent identiques)

export function useUploadWorkflow<TSlot extends string>() {
  const [detail, setDetail] = useState<string | null>(null);
  const [step, setStep] = useState<UploadStep>("idle");

  const runUpload = async (
    files: UploadFileDescriptor<TSlot>[], // Utilisation de ton type
    handlers: UploadWorkflowConfig<TSlot>,
    options: { parallel?: boolean } = { parallel: false }
  ) => {
    try {
      setStep("presign");
      const slots = await handlers.presign(files);

      setStep("upload");
      
      if (options.parallel) {
        setDetail("Synchronisation..."); // Message groupé pour le mode parallèle
        await Promise.all(slots.map(async (slot) => {
          const file = files.find((f) => f.key === slot.key)?.file;
          if (file) {
            return handlers.uploadToUrl(slot.uploadUrl, file);
          }
        }));
      } else {
        for (const slot of slots) {
          const file = files.find((f) => f.key === slot.key)?.file;
          if (file) {
            setDetail(`Chargement : ${slot.key}`); // UX précise
            await handlers.uploadToUrl(slot.uploadUrl, file);
          }
        }
      }

      setStep("finalize");
      setDetail("Finalisation...");
      await handlers.finalize(slots.map((s) => ({ key: s.key, finalUrl: s.finalUrl })));

      setStep("idle");
      setDetail(null);
    } catch (e) {
      setStep("error");
      setDetail(e instanceof Error ? e.message : "Erreur inconnue");
      throw e;
    }
  };

  return { step, detail, runUpload };
}