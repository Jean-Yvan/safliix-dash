'use client';
import InputField from "@/ui/components/inputField";
import { BellDot, Download, Lightbulb, SettingsIcon } from "lucide-react";

export default function Home(){
    return (
			<div className="h-screen">
				<div className="flex items-center gap-40">
					<div className="flex items-center gap-3 flex-2">
						<h1 className="text-base">Dashboard</h1>
						<InputField value={""} onChange={function (e: React.ChangeEvent<HTMLInputElement>): void {
							throw new Error("Function not implemented.");
							} } name={""}
							placeholder="Rechercher..." type="text"
							className="bg-white py-1 rounded-2xl text-black w-[200px]"/>
					</div>
					<div className="flex-1 flex items-center gap-6">
						<div className="flex items-center gap-3">
							<button className="btn btn-primary rounded-full w-10 h-10 p-2">
								<SettingsIcon className="w-5 h-5"/>
							</button>
							<button className="btn btn-primary rounded-full w-10 h-10 p-2">
								<Lightbulb className="w-5 h-5"/>
							</button>
							<button className="btn btn-primary rounded-full w-10 h-10 p-2">
								<BellDot className="w-5 h-5"/>
							</button>	
						</div>
						<div className="w-[1px] h-8 bg-white"/>
						<div className="flex items-center gap-3">
							<img src="gildas.png" alt="Avatar" className="w-10 h-10 rounded-full"/>
							<span className="text-white">Admin</span>
						</div>	
					</div>
				</div>
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
						<button className="btn btn-primary">
							<Download className="w-5 h-5 text-base"/>
							<span className="ml-2">SaFliix Intro</span>
						</button>
						
						<button className="btn btn-outline">
							<Download className="w-5 h-5 text-base"/>
							<span className="ml-2">Filter by Date Range</span>
						</button>	
						<button className="btn btn-primary">
							<Download className="w-5 h-5 text-base"/>
							<span className="ml-2">Export Report</span>
						</button>
					</div>
				</div>
				<div className="stats shadow mt-7 gap-5">
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
					<div className="stat bg-neutral">
						<div className="stat-title flex items-center gap-3">
							<span>Revenu total du mois</span>
							<div className="rounded-full w-8 h-8 p-3 bg-primary flex items-center justify-center text-lg">f</div>
						</div>
						<div className="stat-value text-primary">1.250.000</div>
						<div className="stat-desc">comparé au mois passé</div>
					</div>		
					
				</div>				
			</div>
    );
}