'use client';

import Header from "@/ui/components/header";
import Link from "next/link";

type Plan = {
  id: string;
  name: string;
  price: string;
  currency: string;
  billing: string;
  devices: number;
  quality: string;
  status: "Actif" | "Archivé";
};

const plans: Plan[] = [
  { id: "plan-1", name: "Starter", price: "1 500", currency: "XOF", billing: "mensuel", devices: 1, quality: "HD", status: "Actif" },
  { id: "plan-2", name: "Family", price: "4 500", currency: "XOF", billing: "mensuel", devices: 4, quality: "Full HD", status: "Actif" },
  { id: "plan-3", name: "Premium", price: "7 000", currency: "XOF", billing: "mensuel", devices: 6, quality: "4K", status: "Archivé" },
];

export default function Page() {
  return (
    <div className="space-y-5">
      <Header title="Plans d'abonnement" className="rounded-2xl border border-base-300 px-5 py-3">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/subscriptions/new" className="btn btn-primary btn-sm rounded-full">
            Créer un plan
          </Link>
          <Link href="/dashboard/subscriptions" className="btn btn-ghost btn-sm border-base-300 rounded-full">
            Voir transactions
          </Link>
        </div>
      </Header>

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
                <span className={`badge ${plan.status === "Actif" ? "badge-success" : "badge-ghost"}`}>{plan.status}</span>
              </div>
              <span>{plan.price} {plan.currency}</span>
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
        </div>
      </div>
    </div>
  );
}
