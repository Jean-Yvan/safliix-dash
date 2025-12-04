'use client';

import Header from "@/ui/components/header";
import VideoCard from "@/ui/specific/films/components/videoCard";
import FilterBtn from "@/ui/components/filterBtn";
import { Download } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { seriesApi } from "@/lib/api/series";
import { useAccessToken } from "@/lib/auth/useAccessToken";
import { formatApiError } from "@/lib/api/errors";
import { useToast } from "@/ui/components/toast/ToastProvider";

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

	const accessToken = useAccessToken();
	const [series, setSeries] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const toast = useToast();

	useEffect(() => {
		let cancelled = false;
		const controller = new AbortController();
		const load = async () => {
			setLoading(true);
			setError(null);
			try {
				const res = await seriesApi.list({ page: 1, pageSize: 10 }, accessToken);
				if (cancelled) return;
				setSeries(res.items);
			} catch (err) {
				if (cancelled || controller.signal.aborted) return;
				const friendly = formatApiError(err);
				setError(friendly.message);
				toast.error({ title: "Séries", description: friendly.message });
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

        {loading && <div className="alert alert-info text-sm">Chargement des séries...</div>}
        {error && <div className="alert alert-error text-sm">{error}</div>}

        <div className="space-y-4">
          {series.map((serie) => (
            <VideoCard
              key={serie.id}
              film={serie}
              mode={mode}
              detailHref={`/dashboard/series/detail/${serie.id}`}
            />
          ))}
          {!loading && !error && series.length === 0 && (
            <div className="text-sm text-white/70">Aucune série à afficher.</div>
          )}
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
