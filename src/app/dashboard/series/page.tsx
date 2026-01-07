'use client';

import Header from "@/ui/components/header";
import VideoCard from "@/ui/specific/films/components/videoCard";
import FilterBtn from "@/ui/components/filterBtn";
import { Download } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { imageRightsApi, normalizeRightsHolderGroups, type NormalizedRightsHolderGroup } from "@/lib/api/imageRights";
import { useAccessToken } from "@/lib/auth/useAccessToken";
import { formatApiError } from "@/lib/api/errors";
import { useToast } from "@/ui/components/toast/ToastProvider";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { RightsHolderMoviesReport, type MovieReportEntry } from "@/ui/pdf/RightsHolderMoviesReport";

type SeriesListItemWithRightsholder = {
  id: string;
  title: string;
  status: string;
  director?: string;
  dp?: string;
  number?: number | string;
  category?: string;
  poster?: string;
  hero?: string;
  stats?: Record<string, unknown>;
  stars?: number;
  geo?: { label?: string; name?: string; value?: number; max?: number; color?: string }[];
  donut?: { label?: string; value: number; color?: string };
  rightHolderId?: string;
  rightHolderName?: string;
  rightsholderName?: string;
  rightHolder?: string;
};

type RightsholderGroup<T> = NormalizedRightsHolderGroup<T>;

export default function Page() {
const mode: "location" | "abonnement" = "abonnement";
const dedupeOptions = (values: Array<string | number>) => {
  const seen = new Set<string>();
  return values.filter((val) => {
    const key = String(val).toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};
const reportPeriod = (() => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);
  const fmt = (d: Date) => d.toLocaleDateString("fr-FR");
  return { start: fmt(start), end: fmt(end) };
})();

	const accessToken = useAccessToken();
const [rawSeriesByRightsholder, setRawSeriesByRightsholder] = useState<RightsholderGroup<SeriesListItemWithRightsholder>[]>([]);
const [seriesByRightsholder, setSeriesByRightsholder] = useState<RightsholderGroup<SeriesListItemWithRightsholder>[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
const [statusFilter, setStatusFilter] = useState<string>("all");
const [categoryFilter, setCategoryFilter] = useState<string>("all");
const [sortFilter, setSortFilter] = useState<"none" | "best" | "latest">("none");
const toast = useToast();
const buildReportEntries = (items: SeriesListItemWithRightsholder[]): MovieReportEntry[] =>
  items.map((serie, idx) => ({
    order: `${idx + 1}`.padStart(3, "0"),
    title: serie.title ?? "Sans titre",
    share: (serie as any)?.sharePercentage ?? (serie as any)?.share ?? "",
    views:
      (serie as any)?.views ??
      (serie as any)?.stats?.views ??
      (serie as any)?.stats?.locations ??
      (serie as any)?.stats?.vues ??
      0,
    revenue:
      (serie as any)?.revenue ??
      (serie as any)?.stats?.revenue ??
      (serie as any)?.stats?.revenus ??
      (serie as any)?.donut?.revenue ??
      0,
  }));
const getRevenue = (serie: SeriesListItemWithRightsholder) =>
  Number(
    (serie as any)?.revenue ??
      (serie as any)?.stats?.revenue ??
      (serie as any)?.stats?.revenus ??
      (serie as any)?.donut?.revenue ??
      0,
  ) || 0;
const getDate = (serie: SeriesListItemWithRightsholder) =>
  (serie as any)?.createdAt ? new Date((serie as any).createdAt).getTime() : 0;

useEffect(() => {
  let cancelled = false;
  const controller = new AbortController();
  const load = async () => {
			setLoading(true);
			setError(null);
			try {
				const res = await imageRightsApi.contentsList("serie", { accessToken, signal: controller.signal });
				console.log("[rights-holders/contents series]", res);
				if (cancelled) return;
				const grouped = normalizeRightsHolderGroups<SeriesListItemWithRightsholder>(res);

				const validGroups = grouped.filter((group) => Array.isArray(group.items) && group.items.length > 0);
				setRawSeriesByRightsholder(validGroups);
        setSeriesByRightsholder(validGroups);
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
const toggleGroup = (id: string) =>
  setCollapsedGroups((prev) => {
    const next = new Set(prev);
			if (next.has(id)) {
				next.delete(id);
			} else {
				next.add(id);
    }
    return next;
  });
const applyFilters = useMemo(
  () => (groups: RightsholderGroup<SeriesListItemWithRightsholder>[]) =>
    groups
      .map((group) => {
        let items = group.items || [];
        if (statusFilter !== "all") {
          items = items.filter(
            (s) => String((s as any)?.status ?? "").toLowerCase() === statusFilter.toLowerCase(),
          );
        }
        if (categoryFilter !== "all") {
          items = items.filter(
            (s) => String((s as any)?.category ?? "").toLowerCase() === categoryFilter.toLowerCase(),
          );
        }
        if (sortFilter === "best") {
          items = [...items].sort((a, b) => getRevenue(b) - getRevenue(a));
        } else if (sortFilter === "latest") {
          items = [...items].sort((a, b) => getDate(b) - getDate(a));
        }
        return { ...group, items };
      })
      .filter((group) => Array.isArray(group.items) && group.items.length > 0),
  [categoryFilter, sortFilter, statusFilter],
);
useEffect(() => {
  setSeriesByRightsholder(applyFilters(rawSeriesByRightsholder));
}, [applyFilters, rawSeriesByRightsholder]);
const allSeriesFlat = useMemo(
  () => rawSeriesByRightsholder.flatMap((g) => g.items || []),
  [rawSeriesByRightsholder],
);
const statusOptions = useMemo(
  () =>
    [
      "all",
      ...Array.from(new Set(allSeriesFlat.map((s) => String((s as any)?.status ?? "")).filter(Boolean))),
    ],
  [allSeriesFlat],
);
const categoryOptions = useMemo(
  () =>
    dedupeOptions(
      [
        "all",
        ...Array.from(new Set(allSeriesFlat.map((s) => String((s as any)?.category ?? "")).filter(Boolean))),
      ].filter(Boolean) as string[],
    ),
  [allSeriesFlat],
);

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
            <FilterBtn
              title="Filtrer par statut"
              selected={statusFilter}
              options={statusOptions.map((s) => ({ label: s === "all" ? "Tous les statuts" : String(s), value: String(s) }))}
              onSelect={(v) => setStatusFilter(v)}
            />
            <FilterBtn
              title="Catégorie de série"
              selected={categoryFilter}
              options={categoryOptions.map((c) => ({
                label: c === "all" ? "Toutes les catégories" : String(c),
                value: String(c),
              }))}
              onSelect={(v) => setCategoryFilter(v)}
            />
            <FilterBtn
              title="Tri"
              selected={sortFilter}
              options={[
                { label: "Par défaut", value: "none" },
                { label: "Meilleures ventes", value: "best" },
                { label: "Dernier ajout", value: "latest" },
              ]}
              onSelect={(v) => setSortFilter(v as typeof sortFilter)}
            />
          </div>
        </div>

        {loading && <div className="alert alert-info text-sm">Chargement des séries...</div>}
        {error && <div className="alert alert-error text-sm">{error}</div>}

        <div className="space-y-6">
          {seriesByRightsholder.map((group) => (
            <div key={group.rightsholderId} className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="badge badge-primary badge-outline">{group.rightsholderName}</div>
                  <span className="text-sm text-white/60">({group.items.length} série{group.items.length > 1 ? "s" : ""})</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="btn btn-ghost btn-xs text-white border-base-300 rounded-full"
                    onClick={() => toggleGroup(group.rightsholderId)}
                  >
                    {collapsedGroups.has(group.rightsholderId) ? "Déplier" : "Plier"}
                  </button>
                  <PDFDownloadLink
                    document={
                      <RightsHolderMoviesReport
                        mode={mode}
                        rightsholderName={group.rightsholderName}
                        periodStart={reportPeriod.start}
                        periodEnd={reportPeriod.end}
                        entries={buildReportEntries(group.items)}
                      />
                    }
                    fileName={`rapport-${group.rightsholderName || "ayant-droit"}-${mode}.pdf`}
                    className="btn btn-ghost btn-xs text-primary border-primary/50 rounded-full"
                  >
                    {({ loading }) => (
                      <span className="flex items-center gap-1">
                        {loading && <span className="loading loading-spinner loading-xs text-primary" />}
                        {loading ? "Préparation..." : "Télécharger le rapport"}
                      </span>
                    )}
                  </PDFDownloadLink>
                </div>
              </div>
              {!collapsedGroups.has(group.rightsholderId) ? (
                <div className="space-y-4">
                  {group.items.map((serie) => (
                    <VideoCard
                      key={serie.id}
                      film={serie as any}
                      mode={mode}
                      detailHref={`/dashboard/series/detail/${serie.id}`}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-xs text-white/60 italic">Liste repliée</div>
              )}
            </div>
          ))}
          {!loading && !error && seriesByRightsholder.length === 0 && (
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
