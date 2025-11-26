'use client';

import Header from "@/ui/components/header";
import VideoCard from "@/ui/specific/films/components/videoCard";
import FilterBtn from "@/ui/components/filterBtn";
import { Download } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

export default function Page() {
	const mode: "location" | "abonnement" = "abonnement";
	const filters = useMemo(
		() => [
			"Filtrer par statut",
			"Catégorie de film",
			"Meilleures ventes",
			"Abonnement",
			"Dernier ajout",
		],
		[]
	);

	const series = [
		{
			id: "s1",
			title: "Au fil du temps",
			status: "Actif",
			director: "SFLIX",
			dp: "Gildas",
			number: "20582",
			category: "Documentaire",
			poster: "/elegbara.png",
			hero: "/elegbara.png",
			stats: { locations: 234, revenue: "23k f" },
			stars: 4,
			geo: [
				{ label: "France", value: 5000, max: 10000, color: "progress-success" },
				{ label: "Togo", value: 7000, max: 10000, color: "progress-error" },
				{ label: "Bénin", value: 10000, max: 10000, color: "progress-primary" },
				{ label: "Sénégal", value: 1000, max: 10000, color: "progress-warning" },
			],
			donut: { catalog: 2, viewed: 98, revenue: "150 $" },
		},
		{
			id: "s2",
			title: "Au fil du temps",
			status: "Actif",
			director: "SFLIX",
			dp: "Gildas",
			number: "20582",
			category: "Documentaire",
			poster: "/elegbara.png",
			hero: "/elegbara.png",
			stats: { locations: 234, revenue: "23k f" },
			stars: 4,
			geo: [
				{ label: "France", value: 5000, max: 10000, color: "progress-success" },
				{ label: "Togo", value: 7000, max: 10000, color: "progress-error" },
				{ label: "Bénin", value: 10000, max: 10000, color: "progress-primary" },
				{ label: "Sénégal", value: 1000, max: 10000, color: "progress-warning" },
			],
			donut: { catalog: 2, viewed: 98, revenue: "150 $" },
		},
	];

    return (
      <div className="space-y-5">
        <Header title="Nos séries" className="rounded-2xl border border-base-300 shadow-sm px-5">
          <div className="flex items-center gap-3 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <span>Dernière actualisation</span>
              <div className="flex items-center gap-2 bg-base-200 px-3 py-2 rounded-lg border border-base-300">
                <span>September 28, 2023 12:35 PM</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn btn-primary btn-sm rounded-lg">
                <Download className="w-4 h-4" />
                <span className="ml-1">Exporter les rapports</span>	
              </button>
              <Link className="btn btn-primary btn-sm rounded-lg" href={"/dashboard/series/add"}>
                Ajouter une série
              </Link>
            </div>
          </div>
        </Header>

        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {filters.map((label) => (
              <FilterBtn key={label} title={label} />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {series.map((serie) => (
            <VideoCard
              key={serie.id}
              film={serie}
              mode={mode}
              detailHref={`/dashboard/series/detail/${serie.id}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm text-white/70">
          <button className="btn btn-ghost btn-xs">◀</button>
          <button className="btn btn-primary btn-xs">1</button>
          <button className="btn btn-ghost btn-xs">2</button>
          <button className="btn btn-ghost btn-xs">▶</button>
        </div>
      </div>
    );
}
