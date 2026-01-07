'use client';

import Header from "@/ui/components/header";
import Link from "next/link";
import { useEffect, useState } from "react";
import { plansApi } from "@/lib/api/subscriptions";
import { useAccessToken } from "@/lib/auth/useAccessToken";
import { formatApiError } from "@/lib/api/errors";
import { useToast } from "@/ui/components/toast/ToastProvider";

type Plan = {
  id: string;
  name: string;
  price: number;
  currency?: string;
  billing: string;
  devices?: number;
  quality?: string;
  status?: string;
};

export default function Page() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const accessToken = useAccessToken();
  const toast = useToast();

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await plansApi.list({ page: 1, pageSize: 20 }, accessToken);
        if (cancelled) return;
        const mapped = res.items.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          currency: p.currency || "XOF",
          billing: p.period,
          devices: p.devices,
          quality: p.quality,
          status: p.status,
        }));
        setPlans(mapped);
      } catch (err) {
        if (cancelled || controller.signal.aborted) return;
        const friendly = formatApiError(err);
        setError(friendly.message);
        toast.error({ title: "Plans", description: friendly.message });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [accessToken, toast]);

  return (
    <div className="space-y-5">
      <Header title="Plans d'abonnement" className="rounded-2xl border border-base-300 px-5 py-3">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/subscriptions/new" className="btn btn-primary btn-sm rounded-full">
            Créer un plan
          </Link>
          <Link href="/dashboard/subscriptions/promos/new" className="btn btn-secondary btn-sm rounded-full">
            Créer une promo
          </Link>
          <Link href="/dashboard/subscriptions" className="btn btn-ghost btn-sm border-base-300 rounded-full">
            Voir transactions
          </Link>
        </div>
      </Header>

      {loading && <div className="alert alert-info text-sm">Chargement des plans...</div>}
      {error && <div className="alert alert-error text-sm">{error}</div>}

      <div className="bg-neutral rounded-2xl border border-base-300 p-4 space-y-3">
        <div className="grid grid-cols-6 text-xs uppercase text-white/50 px-2">
          <span>Plan</span>
          <span>Tarif</span>
          <span>Facturation</span>
          <span>Appareils</span>
          <span>Qualité</span>
          <span className="text-right">Actions</span>
        </div>
        <div className="divide-y divide-base-300/60">
          {plans.map((plan) => (
            <div key={plan.id} className="grid grid-cols-6 items-center text-sm text-white/80 px-2 py-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">{plan.name}</span>
                <span className={`badge ${plan.status === "Actif" ? "badge-success" : "badge-ghost"}`}>{plan.status || "—"}</span>
              </div>
              <span>{plan.price} {plan.currency || "XOF"}</span>
              <span>{plan.billing}</span>
              <span>{plan.devices}</span>
              <span>{plan.quality}</span>
              <div className="flex justify-end gap-2">
                <Link href={`/dashboard/subscriptions/plans/${plan.id}`} className="btn btn-ghost btn-xs text-primary border-primary/50 rounded-full">
                  Voir les détails
                </Link>
              </div>
            </div>
          ))}
          {!loading && !error && plans.length === 0 && (
            <div className="px-2 py-4 text-sm text-white/70">Aucun plan disponible.</div>
          )}
        </div>
      </div>
    </div>
  );
}
