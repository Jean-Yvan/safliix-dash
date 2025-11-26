'use client';

import Header from "@/ui/components/header";
import Link from "next/link";

type PubDetail = {
  id: string;
  title: string;
  status: "Actif" | "En pause";
  startDate: string;
  endDate: string;
  budget: string;
  poster: string;
  stats: {
    views: string;
    conversions: string;
    ctaClicks: number;
    reach: string;
  };
  geo: { label: string; value: number; max: number; color: string }[];
  activity: { label: string; at: string }[];
};

const samplePub: PubDetail = {
  id: "pub-1",
  title: "Campagne Premium Été",
  status: "Actif",
  startDate: "01/06/2024",
  endDate: "30/06/2024",
  budget: "1 200 000 F",
  poster: "/elegbara.png",
  stats: {
    views: "120k",
    conversions: "3.4%",
    ctaClicks: 15400,
    reach: "85k",
  },
  geo: [
    { label: "Côte d'Ivoire", value: 5000, max: 10000, color: "progress-accent" },
    { label: "Togo", value: 7000, max: 10000, color: "progress-error" },
    { label: "Bénin", value: 4000, max: 10000, color: "progress-primary" },
  ],
  activity: [
    { label: "Créée par Admin", at: "01/06/2024" },
    { label: "Ciblage ajusté (18-34)", at: "05/06/2024" },
    { label: "Budget augmenté de 10%", at: "10/06/2024" },
    { label: "Pause / reprise", at: "15/06/2024" },
  ],
};

export default function Page({ params }: { params: { id: string } }) {
  const pub = samplePub;

  return (
    <div className="space-y-5">
      <Header title="Détail campagne pub" className="rounded-2xl border border-base-300 shadow-sm px-5">
        <div className="flex items-center gap-3 text-sm text-white/80">
          <span className="badge badge-outline border-primary/50 text-primary">ID {pub.id}</span>
          <span className="w-[1px] h-4 bg-base-300" />
          <span>Statut : {pub.status}</span>
        </div>
      </Header>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4 bg-neutral rounded-2xl border border-base-300 p-4 space-y-4">
          <div className="flex flex-col items-center gap-3">
            <img src={pub.poster} alt={pub.title} className="w-48 h-64 object-cover rounded-xl border border-base-300" />
            <div className="text-center space-y-1">
              <h2 className="text-xl font-semibold text-white">{pub.title}</h2>
              <span className={`badge ${pub.status === "Actif" ? "badge-success" : "badge-warning"}`}>{pub.status}</span>
            </div>
          </div>
          <div className="space-y-1 text-sm text-white/70">
            <p>Début : {pub.startDate}</p>
            <p>Fin : {pub.endDate}</p>
            <p>Budget : {pub.budget}</p>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <button className="btn btn-primary btn-sm rounded-full">Mettre en avant</button>
            <button className="btn btn-ghost btn-sm text-white border-base-300 rounded-full">Mettre en pause</button>
          </div>
        </div>

        <div className="col-span-8 space-y-4">
          <div className="grid grid-cols-4 gap-3">
            <StatTile label="Vues" value={pub.stats.views} />
            <StatTile label="Conversions" value={pub.stats.conversions} />
            <StatTile label="Clics CTA" value={pub.stats.ctaClicks.toLocaleString()} />
            <StatTile label="Reach" value={pub.stats.reach} />
          </div>

          <div className="bg-neutral rounded-2xl border border-base-300 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Répartition géographique</h3>
              <Link href="/dashboard/stats/pub" className="btn btn-ghost btn-xs text-primary border-primary/50 rounded-full">
                Retour liste
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {pub.geo.map((g) => (
                <div key={g.label} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{g.label}</span>
                    <span>{g.value.toLocaleString()} f</span>
                  </div>
                  <progress className={`progress w-full ${g.color}`} value={g.value} max={g.max}></progress>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-neutral rounded-2xl border border-base-300 p-4 space-y-2">
            <h3 className="text-lg font-semibold text-white">Historique de campagne</h3>
            <ul className="space-y-2 text-sm text-white/80">
              {pub.activity.map((a, idx) => (
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

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-neutral rounded-2xl border border-base-300 p-4 space-y-1">
      <p className="text-xs uppercase text-white/50">{label}</p>
      <p className="text-xl font-semibold text-primary">{value}</p>
    </div>
  );
}
