'use client';

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import clsx from "clsx";

type ToastKind = "success" | "error" | "info" | "warning";

type ToastRecord = {
  id: string;
  title?: string;
  description?: string;
  kind: ToastKind;
  duration?: number;
};

type ToastInput = Omit<ToastRecord, "id" | "kind"> & { kind?: ToastKind };

interface ToastContextValue {
  push: (toast: ToastInput) => string;
  success: (toast: ToastInput) => string;
  error: (toast: ToastInput) => string;
  info: (toast: ToastInput) => string;
  warning: (toast: ToastInput) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const variantClasses: Record<ToastKind, string> = {
  success: "bg-green-500 text-black",
  error: "bg-red-500 text-white",
  info: "bg-sky-500 text-white",
  warning: "bg-amber-400 text-black",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushBase = useCallback(
    (toast: ToastInput, kind: ToastKind): string => {
      const id = crypto.randomUUID();
      const duration = toast.duration ?? 4000;
      setToasts((prev) => [...prev, { ...toast, id, kind, duration }]);
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss],
  );

  const push = useCallback((toast: ToastInput) => pushBase(toast, toast.kind || "info"), [pushBase]);
  const success = useCallback((toast: ToastInput) => pushBase(toast, "success"), [pushBase]);
  const error = useCallback((toast: ToastInput) => pushBase(toast, "error"), [pushBase]);
  const info = useCallback((toast: ToastInput) => pushBase(toast, "info"), [pushBase]);
  const warning = useCallback((toast: ToastInput) => pushBase(toast, "warning"), [pushBase]);

  const value = useMemo(
    () => ({ push, success, error, info, warning, dismiss }),
    [push, success, error, info, warning, dismiss],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-3 w-[320px] max-w-[80vw]">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={clsx(
              "rounded-xl shadow-lg px-4 py-3 border border-base-300/60 flex flex-col gap-1",
              variantClasses[toast.kind],
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                {toast.title && <p className="font-semibold text-sm">{toast.title}</p>}
                {toast.description && <p className="text-sm opacity-90">{toast.description}</p>}
              </div>
              <button
                aria-label="Fermer"
                className="btn btn-xs btn-ghost text-current"
                onClick={() => dismiss(toast.id)}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};
