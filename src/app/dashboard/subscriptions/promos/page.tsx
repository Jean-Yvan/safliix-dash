'use client';

import Header from "@/ui/components/header";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAccessToken } from "@/lib/auth/useAccessToken";
import { useToast } from "@/ui/components/toast/ToastProvider";
import { apiRequest } from "@/lib/api/client";
import { formatApiError } from "@/lib/api/errors";

type Promotion = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
};

export default function Page() {
  const accessToken = useAccessToken();
  const toast = useToast();
  const [promos, setPromos] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actioningId, setActioningId] = useState<string | null>(null);

  const fetchPromos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest<Promotion[]>("/promotions", { accessToken });
      setPromos(res || []);
    } catch (err) {
      const friendly = formatApiError(err);
      setError(friendly.message);
      toast.error({ title: "Promotions", description: friendly.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const handleToggle = async (promo: Promotion) => {
    setActioningId(promo.id);
    try {
      const updated = await apiRequest<Promotion>(`/promotions/${promo.id}`, {
        method: "PATCH",
        body: { isActive: !promo.isActive },
        accessToken,
      });
      setPromos((prev) => prev.map((p) => (p.id === promo.id ? { ...p, ...updated } : p)));
      toast.success({ title: "Promotions", description: `Promo ${promo.isActive ? "désactivée" : "activée"}.` });
    } catch (err) {
      const friendly = formatApiError(err);
      toast.error({ title: "Promotions", description: friendly.message });
    } finally {
      setActioningId(null);
    }
  };

  const handleDelete = async (promo: Promotion) => {
    if (!confirm("Supprimer cette promotion ?")) return;
    setActioningId(promo.id);
    try {
      await apiRequest(`/promotions/${promo.id}`, { method: "DELETE", accessToken });
      setPromos((prev) => prev.filter((p) => p.id !== promo.id));
      toast.success({ title: "Promotions", description: "Promotion supprimée." });
    } catch (err) {
      const friendly = formatApiError(err);
      toast.error({ title: "Promotions", description: friendly.message });
    } finally {
      setActioningId(null);
    }
  };

  const rows = useMemo(
    () =>
      promos.map((promo) => ({
        ...promo,
        start: promo.startDate ? new Date(promo.startDate).toLocaleDateString("fr-FR") : "—",
        end: promo.endDate ? new Date(promo.endDate).toLocaleDateString("fr-FR") : "—",
      })),
    [promos],
  );

  return (
    <div className="space-y-5">
      <Header title="Promotions" className="rounded-2xl border border-base-300 px-5 py-3">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/subscriptions/promos/new" className="btn btn-primary btn-sm rounded-full">
            Créer une promo
          </Link>
          <Link href="/dashboard/subscriptions" className="btn btn-ghost btn-sm border-base-300 rounded-full">
            Voir transactions
          </Link>
        </div>
      </Header>

      {loading && <div className="alert alert-info text-sm">Chargement des promotions...</div>}
      {error && <div className="alert alert-error text-sm">{error}</div>}

      <div className="bg-neutral rounded-2xl border border-base-300 p-4 space-y-3">
        <div className="grid grid-cols-6 text-xs uppercase text-white/50 px-2">
          <span>Nom</span>
          <span>Début</span>
          <span>Fin</span>
          <span>Statut</span>
          <span>Active</span>
          <span className="text-right">Actions</span>
        </div>
        <div className="divide-y divide-base-300/60">
          {rows.map((promo) => (
            <div key={promo.id} className="grid grid-cols-6 items-center text-sm text-white/80 px-2 py-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">{promo.name}</span>
              </div>
              <span>{promo.start}</span>
              <span>{promo.end}</span>
              <span className="text-xs">{promo.isActive ? "Active" : "Inactive"}</span>
              <span>
                <span className={`badge ${promo.isActive ? "badge-success" : "badge-ghost"}`}>
                  {promo.isActive ? "Oui" : "Non"}
                </span>
              </span>
              <div className="flex justify-end gap-2">
                <button
                  className="btn btn-ghost btn-xs border-base-300 rounded-full"
                  onClick={() => handleToggle(promo)}
                  disabled={actioningId === promo.id}
                >
                  {promo.isActive ? "Désactiver" : "Activer"}
                </button>
                <button
                  className="btn btn-error btn-xs rounded-full"
                  onClick={() => handleDelete(promo)}
                  disabled={actioningId === promo.id}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
          {!loading && !error && rows.length === 0 && (
            <div className="px-2 py-4 text-sm text-white/70">Aucune promotion disponible.</div>
          )}
        </div>
      </div>
    </div>
  );
}
