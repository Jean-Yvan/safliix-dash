'use client';

import Header from "@/ui/components/header";
import Link from "next/link";

type PlanDetail = {
  id: string;
  name: string;
  price: string;
  currency: string;
  billing: string;
  devices: number;
  quality: string;
  status: "Actif" | "Archivé";
  trialDays: number;
  description: string;
  perks: string[];
  activity: { label: string; at: string }[];
};

const samplePlan: PlanDetail = {
  id: "plan-1",
  name: "Family",
  price: "4 500",
  currency: "XOF",
  billing: "mensuel",
  devices: 4,
  quality: "Full HD",
  status: "Actif",
  trialDays: 7,
  description: "Plan familial permettant de regarder sur 4 appareils simultanés en Full HD.",
  perks: ["Streaming sans pub", "Téléchargement offline", "Support prioritaire", "Profils enfants"],
  activity: [
    { label: "Plan créé", at: "01/05/2024" },
    { label: "Tarif ajusté +500 XOF", at: "01/06/2024" },
    { label: "Ajout essai 7 jours", at: "10/06/2024" },
  ],
};

export default function Page({ params }: { params: { id: string } }) {
  const plan = samplePlan;

  return (
    <div className="space-y-5">
      <Header title="Détail plan" className="rounded-2xl border border-base-300 px-5 py-3">
        <div className="flex items-center gap-2 text-sm text-white/80">
          <span className="badge badge-outline border-primary/50 text-primary">ID {plan.id}</span>
          <span className="w-[1px] h-4 bg-base-300" />
          <span>Statut : {plan.status}</span>
        </div>
      </Header>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4 bg-neutral rounded-2xl border border-base-300 p-4 space-y-3">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-white">{plan.name}</h2>
            <p className="text-white/70 text-sm">{plan.description}</p>
            <span className={`badge ${plan.status === "Actif" ? "badge-success" : "badge-ghost"}`}>{plan.status}</span>
          </div>
          <div className="space-y-1 text-sm text-white/70">
            <p>Tarif : {plan.price} {plan.currency} · {plan.billing}</p>
            <p>Appareils simultanés : {plan.devices}</p>
            <p>Qualité max : {plan.quality}</p>
            <p>Essai : {plan.trialDays} jours</p>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {plan.perks.map((perk, idx) => (
              <span key={idx} className="badge badge-outline border-primary/40 text-primary">
                {perk}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 pt-2">
            <button className="btn btn-primary btn-sm rounded-full">Mettre à jour</button>
            <button className="btn btn-ghost btn-sm border-base-300 rounded-full">Archiver</button>
          </div>
        </div>

        <div className="col-span-8 space-y-4">
          <div className="bg-neutral rounded-2xl border border-base-300 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Activité</h3>
              <Link href="/dashboard/subscriptions/plans" className="btn btn-ghost btn-xs text-primary border-primary/50 rounded-full">
                Retour liste
              </Link>
            </div>
            <ul className="space-y-2 text-sm text-white/80">
              {plan.activity.map((a, idx) => (
                <li key={idx} className="flex items-center justify-between bg-base-200/30 border border-base-300 rounded-lg px-3 py-2">
                  <span>{a.label}</span>
                  <span className="text-xs text-white/50">{a.at}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
