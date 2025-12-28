'use client';

import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@/ui/components/toast/ToastProvider";

interface ProvidersProps {
  children: React.ReactNode;
  session?: Session | null;
}

export function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <ToastProvider>{children}</ToastProvider>
    </SessionProvider>
  );
}
