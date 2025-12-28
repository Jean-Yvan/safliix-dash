'use client';

import { useEffect, useMemo, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { status } = useSession();
  const [loading, setLoading] = useState(false);

  const callbackUrl = useMemo(
    () => searchParams?.get("callbackUrl") || "/dashboard",
    [searchParams],
  );

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  const handleLogin = async () => {
    setLoading(true);
    await signIn("keycloak", { callbackUrl });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 text-white">
      <div className="w-full max-w-md bg-base-300 p-8 rounded-2xl shadow-xl space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Connexion</h1>
          <p className="text-sm text-base-content/70">
            Connectez-vous avec votre compte Keycloak pour accéder au dashboard.
          </p>
        </div>
        <button
          className="btn btn-primary w-full"
          onClick={handleLogin}
          disabled={loading || status === "loading"}
        >
          {loading ? "Redirection..." : "Se connecter avec Keycloak"}
        </button>
        <p className="text-xs text-center text-base-content/60">
          Vous serez redirigé vers votre fournisseur d&apos;identité puis vers le dashboard.
        </p>
      </div>
    </div>
  );
}
