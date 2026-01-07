
'use client'
import FilterBtn from "@/ui/components/filterBtn";
import Header from "@/ui/components/header";
import VideoCard from "@/ui/specific/films/components/videoCard";
import { Download } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAccessToken } from "@/lib/auth/useAccessToken";
import { formatApiError } from "@/lib/api/errors";
import { useToast } from "@/ui/components/toast/ToastProvider";
import { imageRightsApi, normalizeRightsHolderGroups, type NormalizedRightsHolderGroup } from "@/lib/api/imageRights";
import { filmsApi } from "@/lib/api/films";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { RightsHolderMoviesReport, type MovieReportEntry } from "@/ui/pdf/RightsHolderMoviesReport";

type FilmListItemWithRightsholder = {
	id: string;
	title: string;
	status: string;
	director?: string;
	dp?: string;
	number?: string | number;
	category?: string;
	poster?: string;
	hero?: string;
	type?: string;
	stats?: Record<string, unknown>;
	geo?: { label?: string; name?: string; value?: number; max?: number; color?: string }[];
	stars?: number;
	donut?: { label?: string; value: number; color?: string };
	rightHolderId?: string;
	rightHolderName?: string;
	rightsholderName?: string;
	rightHolder?: string;
};

type RightsholderGroup<T> = NormalizedRightsHolderGroup<T>;

const dedupeOptions = (values: string[]) => {
	const seen = new Set<string>();
	return values.filter((val) => {
		const key = val.toLowerCase();
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
};
const getRawFilmType = (film: FilmListItemWithRightsholder) =>
	(film as any)?.type || (film as any)?.types || (film as any)?.secondType || "";
const normalizeTypeValue = (type?: string | null) => (type || "").toLowerCase();
const getFilmType = (film: FilmListItemWithRightsholder) => normalizeTypeValue(getRawFilmType(film));

export default function Page() {
	const [mode, setMode] = useState<"location" | "abonnement">("location");
	const [showEncoding, setShowEncoding] = useState(true);
	const [encodingJobs, setEncodingJobs] = useState([
		{
			id: "encode-1",
			title: "Encodage en cours",
			film: "Au fil du temps",
			progress: 42,
			status: "processing" as "processing" | "paused" | "failed" | "completed",
			updatedAt: "Il y a 2 min",
		},
	]);

	const [rawFilmsByRightsholder, setRawFilmsByRightsholder] = useState<RightsholderGroup<FilmListItemWithRightsholder>[]>([]);
	const [filmsByRightsholder, setFilmsByRightsholder] = useState<RightsholderGroup<FilmListItemWithRightsholder>[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [categoryFilter, setCategoryFilter] = useState<string>("all");
const [sortFilter, setSortFilter] = useState<"none" | "best" | "latest">("none");
const [typeFilter, setTypeFilter] = useState<string>("all");
const [metaTypes, setMetaTypes] = useState<string[]>([]);
const [metaCategories, setMetaCategories] = useState<{ id: string; label: string }[]>([]);
const [startDate, setStartDate] = useState<string>("");
const [endDate, setEndDate] = useState<string>("");
	const [reportPeriod] = useState(() => {
		const end = new Date();
		const start = new Date();
		start.setDate(start.getDate() - 30);
		const fmt = (d: Date) => d.toLocaleDateString("fr-FR");
		return { start: fmt(start), end: fmt(end) };
	});
	const accessToken = useAccessToken();
	const toast = useToast();

	useEffect(() => {
		setTypeFilter("all");
	}, [mode]);

	useEffect(() => {
		let cancelled = false;
		const controller = new AbortController();
		const load = async () => {
			setLoading(true);
			setError(null);
			try {
				const res = await imageRightsApi.contentsList("movie", {
					accessToken,
					signal: controller.signal,
					from: startDate || undefined,
					to: endDate || undefined,
				});
				console.log("[rights-holders/contents movies]", res);
				if (cancelled) return;
				const normalized = normalizeRightsHolderGroups<FilmListItemWithRightsholder>(res);

				const validGroups = normalized.filter((group) => Array.isArray(group.items) && group.items.length > 0);
				setRawFilmsByRightsholder(validGroups);
				setFilmsByRightsholder(validGroups);
			} catch (err) {
				if (cancelled || controller.signal.aborted) return;
				const friendly = formatApiError(err);
				setError(friendly.message);
				toast.error({ title: "Films", description: friendly.message });
			} finally {
				if (!cancelled) setLoading(false);
			}
		};
		load();
		return () => {
			cancelled = true;
			controller.abort();
		};
	}, [accessToken, toast, startDate, endDate]);

	useEffect(() => {
		let cancelled = false;
		const controller = new AbortController();
		const loadMeta = async () => {
			try {
				const res = await filmsApi.metaOptions(accessToken);
				if (cancelled) return;
				setMetaTypes(res.types || []);
				setMetaCategories((res.categories || []).map((c) => ({ id: c.category || c.id, label: c.category || c.id })));
			} catch (err) {
				if (cancelled || controller.signal.aborted) return;
				// soft-fail: keep defaults
				console.warn("Failed to load film meta options", err);
			}
		};
		loadMeta();
		return () => {
			cancelled = true;
			controller.abort();
		};
	}, [accessToken]);

	const updateJob = (id: string, updates: Partial<(typeof encodingJobs)[number]>) => {
		setEncodingJobs((prev) => prev.map((job) => (job.id === id ? { ...job, ...updates } : job)));
	};

const handlePause = (id: string) => updateJob(id, { status: "paused" });
const handleResume = (id: string) => updateJob(id, { status: "processing" });
const handleFail = (id: string) => updateJob(id, { status: "failed" });
const buildReportEntries = (items: FilmListItemWithRightsholder[]): MovieReportEntry[] =>
	items.map((film, idx) => ({
		order: `${idx + 1}`.padStart(3, "0"),
		title: film.title ?? "Sans titre",
		share: (film as any)?.sharePercentage ?? (film as any)?.share ?? "",
		views:
			(film as any)?.views ??
			(film as any)?.rentals ??
			(film as any)?.stats?.locations ??
			(film as any)?.stats?.vues ??
			(film as any)?.stats?.views ??
			0,
		revenue:
			(film as any)?.revenue ??
			(film as any)?.stats?.revenue ??
			(film as any)?.stats?.revenus ??
			(film as any)?.donut?.revenue ??
			0,
	}));
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
	const getRevenue = (film: FilmListItemWithRightsholder) =>
		Number(
			(film as any)?.revenue ??
				(film as any)?.stats?.revenue ??
				(film as any)?.stats?.revenus ??
				(film as any)?.donut?.revenue ??
				0,
		) || 0;
	const getDate = (film: FilmListItemWithRightsholder) =>
		(film as any)?.createdAt ? new Date((film as any).createdAt).getTime() : 0;

	const applyFilters = useMemo(
		() => (groups: RightsholderGroup<FilmListItemWithRightsholder>[]) =>
			groups
				.map((group) => {
					let items = group.items || [];
					items = items.filter((f) => getFilmType(f) === mode);
					if (typeFilter !== "all") {
						items = items.filter(
							(f) => getFilmType(f) === normalizeTypeValue(typeFilter),
						);
					}
					if (statusFilter !== "all") {
						items = items.filter(
							(f) => (f as any)?.status?.toLowerCase?.() === statusFilter.toLowerCase(),
						);
					}
					if (categoryFilter !== "all") {
						items = items.filter(
							(f) => (f as any)?.category?.toLowerCase?.() === categoryFilter.toLowerCase(),
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
		[categoryFilter, mode, statusFilter, sortFilter, typeFilter],
	);

	useEffect(() => {
		setFilmsByRightsholder(applyFilters(rawFilmsByRightsholder));
	}, [applyFilters, rawFilmsByRightsholder]);

	const allFilmsFlat = useMemo(
		() => rawFilmsByRightsholder.flatMap((g) => g.items || []),
		[rawFilmsByRightsholder],
	);
	const statusOptions = useMemo(
		() => ["all", ...Array.from(new Set(allFilmsFlat.map((f) => (f as any)?.status).filter(Boolean)))],
		[allFilmsFlat],
	);
	const categoryOptions = useMemo(
		() =>
			dedupeOptions(
				[
					"all",
					...Array.from(new Set(allFilmsFlat.map((f) => (f as any)?.category).filter(Boolean))),
					...metaCategories.map((c) => c.label),
				].filter(Boolean) as string[],
			),
		[allFilmsFlat, metaCategories],
	);
	const typeOptions = useMemo(
		() =>
			dedupeOptions(
				[
					"all",
					...Array.from(new Set(allFilmsFlat.map((f) => getRawFilmType(f)).filter(Boolean))),
					...metaTypes,
				].filter(Boolean) as string[],
			),
		[allFilmsFlat, metaTypes],
	);

    return (
			<div className="space-y-5">
				<Header title="Nos films" className="rounded-2xl border border-base-300 shadow-sm px-5">
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
							<Link className="btn btn-primary btn-sm rounded-lg" href={"/dashboard/films/add"}>
								Ajouter un film
							</Link>
						</div>
					</div>
				</Header>

				{encodingJobs.length > 0 && (
					<div className="bg-neutral rounded-2xl border border-base-300 p-4 shadow-sm">
						<div className="flex items-center justify-between gap-3">
							<div>
								<p className="text-xs uppercase text-white/50">Encodage</p>
								<div className="flex items-center gap-2">
									<h3 className="text-lg font-semibold text-white">Tâches</h3>
									<span className="badge badge-sm badge-outline border-primary/40 text-primary">
										{encodingJobs.length} en cours
									</span>
								</div>
							</div>
							<div className="flex items-center gap-3 text-xs text-white/60">
								<span>Source: socket.io (à connecter)</span>
								<label className="flex items-center gap-2 cursor-pointer text-white/70">
									<span>{showEncoding ? "Masquer" : "Afficher"}</span>
									<input
										type="checkbox"
										className="toggle toggle-primary toggle-sm"
										checked={showEncoding}
										onChange={() => setShowEncoding((prev) => !prev)}
									/>
								</label>
							</div>
						</div>

						{showEncoding && (
							<div className="mt-3 space-y-3">
								{encodingJobs.map((job) => (
									<div key={job.id} className="rounded-xl border border-base-300/60 bg-base-200/40 p-3 space-y-2">
										<div className="flex items-center justify-between">
											<div>
												<p className="text-sm text-white/70">{job.title}</p>
												<p className="text-sm font-semibold text-white">{job.film}</p>
											</div>
											<span className="text-xs text-white/50">{job.updatedAt}</span>
										</div>
										<div className="flex items-center gap-3">
											<div className="flex-1">
												<div className="flex items-center justify-between text-xs text-white/60 mb-1">
													<span>Progression</span>
													<span>{job.progress}%</span>
												</div>
												<progress className="progress progress-primary w-full" value={job.progress} max="100"></progress>
											</div>
											<div className="flex items-center gap-2">
												<button
													className="btn btn-xs btn-ghost text-white/80"
													onClick={() => handleFail(job.id)}
												>
													Marquer échoué
												</button>
												{job.status === "processing" ? (
													<button
														className="btn btn-xs btn-error text-white"
														onClick={() => handlePause(job.id)}
													>
														Stopper
													</button>
												) : (
													<button
														className="btn btn-xs btn-primary"
														onClick={() => handleResume(job.id)}
													>
														Relancer
													</button>
												)}
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				)}

				<div className="flex flex-col gap-3">
					<div className="tabs tabs-boxed bg-base-200/40 border border-base-300 rounded-xl w-fit">
						<button
							className={`tab px-4 text-sm ${mode === "location" ? "tab-active text-primary font-semibold" : "text-white/60"}`}
							onClick={() => setMode("location")}
						>
							Location
						</button>
						<button
							className={`tab px-4 text-sm ${mode === "abonnement" ? "tab-active text-primary font-semibold" : "text-white/60"}`}
							onClick={() => setMode("abonnement")}
						>
							Abonnement
						</button>
					</div>
				<div className="flex flex-wrap items-center gap-2">
					<FilterBtn
						title="Type"
						selected={typeFilter}
						options={typeOptions.map((t) => ({ label: t === "all" ? "Tous les types" : t, value: t }))}
						onSelect={(v) => setTypeFilter(v)}
					/>
					<FilterBtn
						title="Filtrer par statut"
						selected={statusFilter}
						options={statusOptions.map((s) => ({ label: s === "all" ? "Tous les statuts" : s, value: s }))}
						onSelect={(v) => setStatusFilter(v)}
					/>
					<FilterBtn
						title="Catégorie de film"
						selected={categoryFilter}
						options={categoryOptions.map((c) => ({ label: c === "all" ? "Toutes les catégories" : c, value: c }))}
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
					<div className="flex items-center gap-2">
						<label className="text-xs text-white/70">Du</label>
						<input
							type="date"
							className="input input-sm input-bordered bg-neutral text-white"
							value={startDate}
							onChange={(e) => setStartDate(e.target.value)}
						/>
						<label className="text-xs text-white/70">au</label>
						<input
							type="date"
							className="input input-sm input-bordered bg-neutral text-white"
							value={endDate}
							onChange={(e) => setEndDate(e.target.value)}
						/>
						<button
							className="btn btn-ghost btn-xs text-primary border-primary/40 rounded-full"
							onClick={() => {
								setStartDate("");
								setEndDate("");
							}}
						>
							Réinitialiser
						</button>
					</div>
				</div>
				</div>

				{loading && <div className="alert alert-info text-sm">Chargement des films...</div>}
				{error && <div className="alert alert-error text-sm">{error}</div>}

				<div className="space-y-6">
					{filmsByRightsholder.map((group) => (
						<div key={group.rightsholderId} className="space-y-3">
							<div className="flex items-center justify-between gap-2">
								<div className="flex items-center gap-2">
									<div className="badge badge-primary badge-outline">{group.rightsholderName}</div>
									<span className="text-sm text-white/60">({group.items.length} film{group.items.length > 1 ? "s" : ""})</span>
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
									{group.items.map((film) => (
										<VideoCard
											key={film.id}
											film={film as any}
											mode={mode}
											detailHref={`/dashboard/films/detail/${film.id}`}
										/>
									))}
								</div>
							) : (
								<div className="text-xs text-white/60 italic">Liste repliée</div>
							)}
						</div>
					))}
					{!loading && !error && filmsByRightsholder.length === 0 && (
						<div className="text-sm text-white/70">Aucun film à afficher.</div>
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
