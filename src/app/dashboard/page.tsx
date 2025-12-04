'use client';
import BackgroundImg from "@/ui/components/backgroundImg";
import MonthlyStatsChart from "@/ui/specific/stats/components/barChart";
import { Banknote, Clock, Download, Flag, Lightbulb, Package, Play, PlayCircle, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDashboardData } from "@/lib/hooks/useDashboardData";

export default function Home(){
		const router = useRouter();
		const { metrics, highlights, loading, error, refetch } = useDashboardData();

		const formatNumber = (value: number | undefined) => {
			if (value === undefined || value === null) return "-";
			return value.toLocaleString("fr-FR");
		};

		const formatTrend = (value: number | undefined) => {
			if (value === undefined || value === null) return "";
			const rounded = Number.isInteger(value) ? value : Number(value).toFixed(2);
			return `${value > 0 ? "+" : ""}${rounded}%`;
		};

		const trendTone = (value: number | undefined) => {
			if (value === undefined || value === null) return "muted" as const;
			return value >= 0 ? "success" : "error";
		};

		const fallbackStatCards = [
			{ title: "Revenu total du mois", value: "1.250.000", trend: "+18.08%", trendTone: "success", desc: "comparé au mois passé", badgeIcon: Banknote },
			{ title: "Nouveaux utilisateurs", value: "23", trend: "+18.98%", trendTone: "success", desc: "comparé au mois passé", badgeIcon: Users },
			{ title: "Nouveaux produits", value: "105", trend: "+4.98%", trendTone: "success", desc: "comparé au mois passé", badgeIcon: Package },
			{ title: "Visionnage en cours", value: "567K", trend: "-8.98%", trendTone: "error", desc: "comparé au mois passé", badgeIcon: Play },
			{ title: "Minutes totales", value: "25748", trend: "", trendTone: "muted", desc: "Minutes", badgeIcon: Clock }
		];

		const statCards = metrics ? [
			{
				title: "Revenu total du mois",
				value: formatNumber(metrics.revenueTotal),
				trend: formatTrend(metrics.trends?.revenueTotal),
				trendTone: trendTone(metrics.trends?.revenueTotal),
				desc: "comparé au mois passé",
				badgeIcon: Banknote,
			},
			{
				title: "Nouveaux utilisateurs",
				value: formatNumber(metrics.newUsers),
				trend: formatTrend(metrics.trends?.newUsers),
				trendTone: trendTone(metrics.trends?.newUsers),
				desc: "comparé au mois passé",
				badgeIcon: Users,
			},
			{
				title: "Nouveaux produits",
				value: formatNumber(metrics.newProducts),
				trend: formatTrend(metrics.trends?.newProducts),
				trendTone: trendTone(metrics.trends?.newProducts),
				desc: "comparé au mois passé",
				badgeIcon: Package,
			},
			{
				title: "Visionnage en cours",
				value: formatNumber(metrics.watching),
				trend: formatTrend(metrics.trends?.watching),
				trendTone: trendTone(metrics.trends?.watching),
				desc: "comparé au mois passé",
				badgeIcon: Play,
			},
			{
				title: "Minutes totales",
				value: formatNumber(metrics.minutes),
				trend: formatTrend(metrics.trends?.minutes),
				trendTone: trendTone(metrics.trends?.minutes),
				desc: "Minutes",
				badgeIcon: Clock,
			},
		] : fallbackStatCards;

		const countries = highlights?.topCountries ?? [
			{ name: "United States", value: 38 },
			{ name: "Australia", value: 25 },
			{ name: "United Kingdom", value: 65 },
			{ name: "Africa", value: 15 },
		];

		const contents = highlights?.recentContents?.map((content) => {
			const qty = (content as { qty?: number }).qty ?? 1;
			return {
				product: content.title,
				category: content.type,
				qty,
				publisher: content.publisher,
				status: content.status,
				price: formatNumber(content.price),
				date: content.date,
				color: "text-white",
			};
		}) ?? [
			{ product: "ASUKA", category: "Film", qty: 1, publisher: "John", status: "Actif", price: "2.000", date: "2026-08-20", color: "text-white" },
			{ product: "ALEGBAKARA", category: "Film", qty: 1, publisher: "Sarah", status: "Delivered", price: "3.000", date: "2026-08-21", color: "text-white" },
			{ product: "Ni lui, ni moi", category: "Série", qty: 1, publisher: "Michael", status: "Processing", price: "1.800", date: "2026-08-22", color: "text-white" },
			{ product: "Tumeur", category: "Film", qty: 1, publisher: "Emily", status: "Hors ligne", price: "2.200", date: "2026-08-23", color: "text-white" },
			{ product: "Le ciel", category: "Série", qty: 1, publisher: "Martinez", status: "Actif", price: "2.100", date: "2026-08-24", color: "text-white" },
		];

		const doughnutSegments = highlights?.donuts?.length
			? highlights.donuts.map((d, idx) => ({
				label: d.label,
				value: d.value,
				color: d.color || ["#00b26f", "#ff725e", "#0da36d"][idx % 3],
			}))
			: [
				{ label: "Tumeur", value: 45, color: "#00b26f" },
				{ label: "Ni lui", value: 25, color: "#ff725e" },
				{ label: "Asuka", value: 30, color: "#0da36d" },
			];
		const doughnutTotal = doughnutSegments.reduce((sum, seg) => sum + seg.value, 0);
		const conicGradient = doughnutTotal
			? doughnutSegments.reduce((acc, seg, idx) => {
				const start = doughnutSegments.slice(0, idx).reduce((s, current) => s + (current.value / doughnutTotal) * 100, 0);
				const end = start + (seg.value / doughnutTotal) * 100;
				return `${acc}${idx ? ", " : ""}${seg.color} ${start}% ${end}%`;
			}, "")
			: "";
    return (
			<div className="space-y-6 pb-10">
				{loading && (
					<div className="alert alert-info text-sm">
						Chargement des données en cours...
					</div>
				)}
				{error && (
					<div className="alert alert-warning text-sm flex items-center justify-between gap-4">
						<span>{error}</span>
						<button className="btn btn-outline btn-xs" onClick={() => refetch()}>
							Recharger
						</button>
					</div>
				)}
				<div className="flex items-center justify-between gap-4">
					<div className="flex items-center gap-1 bg-neutral border border-base-300 rounded-xl px-3 py-2 shadow-sm">
						<button className="btn btn-ghost btn-sm gap-2 text-white border-none">
							<Lightbulb className="w-4 h-4"/>
							Overview
						</button>
						<div className="w-[1px] h-5 bg-base-300"/>
						<button className="btn btn-ghost btn-sm gap-2 text-white border-none">
							<Lightbulb className="w-4 h-4"/>
							Order
						</button>
						<div className="w-[1px] h-5 bg-base-300"/>
						<button className="btn btn-ghost btn-sm gap-2 text-white border-none">
							<Lightbulb className="w-4 h-4"/>
							Sales
						</button>
					</div>
					<div className="flex items-center gap-3">
						<button className="btn btn-primary rounded-lg" onClick={() => router.push("/dashboard/intro")}>
							<Download className="w-5 h-5"/>
							<span>SaFLIX INTRO</span>
						</button>
						<button className="btn btn-neutral rounded-lg border border-primary/40 text-primary bg-primary/10">
							<Download className="w-5 h-5 text-primary"/>
							<span>Filter by Date Range</span>
						</button>
						<button className="btn btn-primary rounded-lg" onClick={() => router.push("/dashboard/report")}>
							<Download className="w-5 h-5"/>
							<span>Export Report</span>
						</button>
					</div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-1">
					{statCards.map((card, idx) => (
						<div
							key={card.title}
							className={`stat bg-[#444444] rounded-xl border border-base-300 col-span-1 ${idx === 0 ? "xl:col-span-2" : ""} py-3 px-4`}
						>
							<div className="stat-title flex flex-wrap items-center gap-2 text-sm text-white/80">
								{card.badgeIcon && (
									<div className="rounded-full w-8 h-8 bg-primary/20 border border-primary flex items-center justify-center">
										<card.badgeIcon className="w-4 h-4 text-primary" />
									</div>
								)}
								<span className="leading-tight">{card.title}</span>
							</div>
							<div className="stat-value text-primary text-3xl">{card.value}</div>
							<div className="stat-desc flex flex-col items-start gap-2 text-white/70">
								{card.trend && (
									<span className={`inline-flex rounded-full px-2 py-1 text-xs ${card.trendTone === "success" ? "bg-primary/10 text-primary" : card.trendTone === "error" ? "bg-red-500/10 text-red-400" : "bg-base-300 text-white"}`}>
										{card.trend}
									</span>
								)}
								<p>{card.desc}</p>
							</div>
						</div>
					))}
				</div>

				<div className="flex gap-4 justify-stretch">
					<div className="flex-1 bg-neutral rounded-2xl p-4 border border-base-300 space-y-4">
						<div className="flex items-center justify-between">
							<div>
								<h2 className="text-xl font-semibold text-white">Location VS Abonnement</h2>
								<p className="text-sm text-white/60">of the week on website and compared with e-commerce</p>
							</div>
							<button className="btn btn-ghost btn-sm text-primary">Voir détail</button>
						</div>
						<div className="relative">
							<MonthlyStatsChart/>
							<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-black px-4 py-2 rounded-lg shadow">
								<div className="text-xs uppercase">Total Revenue</div>
								<div className="text-lg font-semibold">$647.56</div>
							</div>
							<div className="absolute right-6 top-16 flex items-center gap-4 text-sm">
								<span className="flex items-center gap-2 text-white/80"><span className="w-3 h-3 rounded-sm bg-[#792525]"/>Location</span>
								<span className="flex items-center gap-2 text-white/80"><span className="w-3 h-3 rounded-sm bg-[#A5C0E4]"/>Abonnement</span>
							</div>
						</div>
					</div>

					<div className="flex-1 bg-neutral rounded-2xl p-4 border border-base-300 space-y-4">
						<div className="flex items-center justify-between gap-4">
							<div>
								<h2 className="text-xl font-semibold text-white">Contenu le plus suivi</h2>
								<p className="text-sm text-white/60">de la semaine based on country</p>
							</div>
							<select className="select select-sm bg-base-200 border-base-300 text-white">
								<option>Country</option>
							</select>
						</div>
						<div className="flex gap-4">
							<BackgroundImg className="relative flex-[1.4] h-[290px] rounded-xl overflow-hidden" src="elegbara.png">
								<div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/70"/>
								<button className="absolute left-6 bottom-6 btn btn-primary btn-sm rounded-full gap-2">
									<PlayCircle className="w-4 h-4"/>
									Read More
								</button>
								<div className="absolute right-6 top-6 bg-primary text-black rounded-xl px-3 py-2 flex items-center gap-3 shadow">
									<div className="rounded-full h-10 w-10 bg-primary/40 flex items-center justify-center">
										<Users className="w-5 h-5"/>
									</div>
									<div>
										<h3 className="text-lg font-semibold">21.345</h3>
										<p className="text-xs">Customer</p>
									</div>
								</div>
							</BackgroundImg>
							<div className="flex-1 space-y-3">
								{countries.map((country) => (
									<div key={country.name} className="flex items-center gap-3">
										<div className="flex items-center gap-2 min-w-[140px]">
											<Flag className="w-4 h-4 text-primary"/>
											<span className="text-sm text-white/80">{country.name}</span>
										</div>
										<div className="flex-1 h-2 rounded-full bg-base-200">
											<div className="h-full rounded-full bg-primary" style={{ width: `${country.value}%` }}/>
										</div>
										<span className="text-sm text-white/70 w-10 text-right">{country.value}%</span>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-3 gap-4">
					<div className="col-span-2 bg-neutral rounded-2xl border border-base-300 p-4 space-y-3">
						<div className="flex items-center justify-between">
							<h2 className="text-lg font-semibold text-white">Nos contenus</h2>
							<div className="flex items-center gap-2">
								<input className="input input-sm bg-base-200 border-base-300 text-white" placeholder="Search here" />
								<button className="btn btn-ghost btn-sm text-white">Sort By</button>
							</div>
						</div>
						<div className="overflow-x-auto">
							<table className="table table-sm text-sm">
								<thead className="text-white/70">
									<tr>
										<th><input type="checkbox" className="checkbox checkbox-sm"/></th>
										<th>Product</th>
										<th>Category</th>
										<th>Quantity</th>
										<th>Publié par</th>
										<th>Status</th>
										<th>Prix</th>
										<th>Date</th>
									</tr>
								</thead>
								<tbody>
									{contents.map((item) => (
										<tr key={item.product} className="hover:bg-base-200/30">
											<td><input type="checkbox" className="checkbox checkbox-sm"/></td>
											<td className={item.color}>{item.product}</td>
											<td className="text-white/60">{item.category}</td>
											<td className="text-white/60">{item.qty}</td>
											<td className="text-white/80 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary"/> {item.publisher}</td>
											<td>
												<span className={`badge badge-sm ${item.status === "Actif" ? "badge-success" : item.status === "Delivered" ? "badge-info" : item.status === "Processing" ? "badge-warning" : "badge-error"}`}>
													{item.status}
												</span>
											</td>
											<td className="text-white/80">{item.price}</td>
											<td className="text-white/60">{item.date}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<div className="flex items-center justify-between text-xs text-white/60">
							<span>Showing 5 entries</span>
							<div className="flex items-center gap-2">
								<button className="btn btn-ghost btn-xs">Prev</button>
								<button className="btn btn-primary btn-xs">1</button>
								<button className="btn btn-ghost btn-xs">2</button>
								<button className="btn btn-ghost btn-xs">Next</button>
							</div>
						</div>
					</div>

					<div className="bg-neutral rounded-2xl border border-base-300 p-4 space-y-6">
						<div className="flex items-center justify-between">
							<div>
								<h2 className="text-lg font-semibold text-white">Meilleurs produits</h2>
								<p className="text-sm text-white/60">Track your product sales</p>
							</div>
							<button className="btn btn-ghost btn-xs text-white">Today</button>
						</div>
						<div className="flex flex-col items-center gap-4">
							<div className="relative w-56 h-56">
								<div className="absolute inset-0 rounded-full" style={{ background: `conic-gradient(${conicGradient || "#0da36d 0 100%"})` }} />
								<div className="absolute inset-4 rounded-full bg-base-100 flex items-center justify-center">
									<div className="w-20 h-20 rounded-full border-4 border-primary/40"/>
								</div>
							</div>
							<div className="grid grid-cols-1 gap-2 w-full">
								{doughnutSegments.map((seg) => (
									<div key={seg.label} className="flex items-center justify-between text-sm">
										<span className="flex items-center gap-2 text-white/80">
											<span className="w-3 h-3 rounded-sm" style={{ backgroundColor: seg.color }}/>
											{seg.label}
										</span>
										<span className="text-white/60">{seg.value}%</span>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
    );
}
