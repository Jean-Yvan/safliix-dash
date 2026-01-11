'use client';

import Header from "@/ui/components/header";
import Link from "next/link";
import { useEffect, useState } from "react";
import { plansApi } from "@/lib/api/subscriptions";
import { useAccessToken } from "@/lib/auth/useAccessToken";
import { formatApiError } from "@/lib/api/errors";
import { useToast } from "@/ui/components/toast/ToastProvider";
import DataTable from "@/ui/components/dataTable";
import { columns } from "./mapper";
import { PlanPayload } from "@/types/api/subscriptions";


export default function Page() {
  const [plans, setPlans] = useState<PlanPayload[]>([]);
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
          yearlyDiscount: p.yearlyDiscount
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
          <Link href="/dashboard/subscriptions/plans/edit" className="btn btn-primary btn-sm rounded-full">
            Créer un plan
          </Link>
          
        </div>
      </Header>

      {loading && <div className="alert alert-info text-sm">Chargement des plans...</div>}
      {error && <div className="alert alert-error text-sm">{error}</div>}

      
        <DataTable data={plans} columns={columns}/>
      
    </div>
  );
}
