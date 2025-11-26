
'use client'
import FilterBtn from "@/ui/components/filterBtn";
import Header from "@/ui/components/header";
import VideoCard from "@/ui/specific/films/components/videoCard";
import { Download } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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

	const filters =
		mode === "location"
			? ["Filtrer par statut", "Catégorie de film", "Meilleures ventes", "Dernier ajout"]
			: ["Filtrer par statut", "Catégorie de film", "Dernier ajout"];

	const films = [
		{
			id: "1",
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
			id: "2",
			title: "Be cauchemard",
			status: "Actif",
			director: "SFLIX",
			dp: "Gildas",
			number: "20582",
			category: "Documentaire",
			poster: "/elegbara.png",
			hero: "/elegbara.png",
			stats: { locations: 234, revenue: "23k f" },
			stars: 5,
			geo: [
				{ label: "France", value: 5000, max: 10000, color: "progress-success" },
				{ label: "Togo", value: 7000, max: 10000, color: "progress-error" },
				{ label: "Bénin", value: 10000, max: 10000, color: "progress-primary" },
				{ label: "Sénégal", value: 1000, max: 10000, color: "progress-warning" },
			],
			donut: { catalog: 2, viewed: 98, revenue: "150 $" },
		},
		{
			id: "3",
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

	const updateJob = (id: string, updates: Partial<(typeof encodingJobs)[number]>) => {
		setEncodingJobs((prev) => prev.map((job) => (job.id === id ? { ...job, ...updates } : job)));
	};

	const handlePause = (id: string) => updateJob(id, { status: "paused" });
	const handleResume = (id: string) => updateJob(id, { status: "processing" });
	const handleFail = (id: string) => updateJob(id, { status: "failed" });

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
						{filters.map((label) => (
							<FilterBtn key={label} title={label} />
						))}
					</div>
				</div>

				<div className="space-y-4">
					{films.map((film) => (
						<VideoCard
							key={film.id}
							film={film}
							mode={mode}
							detailHref={`/dashboard/films/detail/${film.id}`}
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
