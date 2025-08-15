'use client';
import BackgroundImg from "@/ui/components/backgroundImg";
import MonthlyStatsChart from "@/ui/specific/stats/components/barChart";
//import InputField from "@/ui/components/inputField";
import { Download, Lightbulb,} from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home(){
		const router = useRouter();
    return (
			<div className="h-screen">
				
				<div className="mt-10 flex items-center justify-between">
					<div className="border-1 rounded-md px-5 py-2 flex items-center gap-3">
						<div className="flex items-center gap-3">
							<Lightbulb className="w-5 h-5"/>
							<span>Overview</span>
						</div>
						<div className="w-[1px] h-[20px] bg-base-content"/>
						<div className="flex items-center gap-3">
							<Lightbulb className="w-5 h-5"/>
							<span>Order</span>
						</div>
						<div className="w-[1px] h-[20px] bg-base-content"/>	
						<div className="flex items-center gap-3">
							<Lightbulb className="w-5 h-5"/>
							<span>Sales</span>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<button className="btn btn-primary" onClick={() => router.push("/dashboard/intro")}>
							<Download className="w-5 h-5 text-base"/>
							<span className="ml-2">SaFliix Intro</span>
						</button>
						
						<button className="btn btn-outline">
							<Download className="w-5 h-5 text-base"/>
							<span className="ml-2">Filter by Date Range</span>
						</button>	
						<button className="btn btn-primary" onClick={() => router.push("/dashboard/report")}>
							<Download className="w-5 h-5 text-base"/>
							<span className="ml-2">Export Report</span>
						</button>
					</div>
				</div>
				<div className="stats shadow mt-7 gap-5 flex ">
					<div className="stat bg-neutral py-2">
						<div className="stat-title flex items-center gap-3">
							<span>Revenu total du mois</span>
							<div className="rounded-full w-8 h-8 p-3 bg-primary flex items-center justify-center text-lg">f</div>
						</div>
						<div className="stat-value text-primary">1.250.000</div>
						<div className="stat-desc">comparé au mois passé</div>
					</div>
					<div className="stat bg-neutral">
						<div className="stat-title flex items-center gap-3">
							<span>Revenu total du mois</span>
							<div className="rounded-full w-8 h-8 p-3 bg-primary flex items-center justify-center text-lg">f</div>
						</div>
						<div className="stat-value text-primary">1.250.000</div>
						<div className="stat-desc">comparé au mois passé</div>
					</div>
					<div className="stat bg-neutral">
						<div className="stat-title flex items-center gap-3">
							<span>Revenu total du mois</span>
							<div className="rounded-full w-8 h-8 p-3 bg-primary flex items-center justify-center text-lg">f</div>
						</div>
						<div className="stat-value text-primary">1.250.000</div>
						<div className="stat-desc">comparé au mois passé</div>
					</div>
					<div className="stat bg-neutral">
						<div className="stat-title flex items-center gap-3">
							<span>Revenu total du mois</span>
							<div className="rounded-full w-8 h-8 p-3 bg-primary flex items-center justify-center text-lg">f</div>
						</div>
						<div className="stat-value text-primary">1.250.000</div>
						<div className="stat-desc">comparé au mois passé</div>
					</div>		
					
				</div>
				<div className="flex gap-4 justify-stretch mt-2 ">
					<div className="flex-1 bg-neutral rounded-xl p-2">
						<h1>Location VS Abonnement</h1>
						<MonthlyStatsChart/>
					</div>
					<div className="flex-1 bg-neutral p-2 rounded-xl">
						<div className="flex items-center justify-between">
							<div className="flex-4">
								<h1 className="text-xl">Contenu le plus suivi</h1>
								<h4>de la semaine classée par pays</h4>
							</div>
							<select className="select flex-1">
								<option>Pays</option>
							</select>
						</div>
						<div className="flex gap-2 items-stretch">
							<BackgroundImg className="relative flex-2 h-[290px]" src="elegbara.png">
								<div className="absolute right-10 top-10 bg-primary rounded-lg p-2 flex items-center gap-2">
									<div className="rounded-full h-10 w-10"/>
									<div>
										<h2>20000</h2>
										<h3>Clients</h3>
									</div>
								</div>
							</BackgroundImg>
							<div className="flex-1">

							</div>
						</div>
					</div>
				</div>				
			</div>
    );
}