'use client'

import InputField from "@/ui/components/inputField";
import Sidebar from "@/ui/layout/sidebar";
import { BellDot, Lightbulb, SettingsIcon } from "lucide-react";

export default function Layout({children}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen relative">
          {/* Sidebar */}
          <aside className="fixed top-0 left-0 bottom-0 w-56 bg-[#2F2F2F] p-4">
            <Sidebar />
          </aside>

          {/* Main content */}
          <main className="flex-1 p-6 bg-base-100 ml-64">
            <div className="flex items-center gap-40 mb-4">
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
							<img src="/gildas.png" alt="Avatar" className="w-10 h-10 rounded-full"/>
							<span className="text-white">Admin</span>
						</div>	
					</div>
				</div>
            {children}
          </main>
        </div>
  );

}