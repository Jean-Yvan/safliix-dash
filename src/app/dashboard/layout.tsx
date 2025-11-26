'use client'

import InputField from "@/ui/components/inputField";
import Sidebar from "@/ui/layout/sidebar";
import { BellDot, Lightbulb, SettingsIcon } from "lucide-react";

export default function Layout({children}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex items-stretch min-h-screen relative px-2">
          {/* Sidebar */}
			<aside className="fixed top-0 left-0 bottom-0 w-56 p-4 pr-0 flex justify-center">
				<Sidebar />
			</aside>

          {/* Main content */}
			<main className="flex-1 bg-base-100 ml-56 py-4 pl-4 pr-3">
        <div className="flex items-center justify-between bg-base-100/40 border border-base-300 rounded-2xl px-5 py-3 shadow-sm">
          <div className="flex items-center gap-4 flex-1">
            <h1 className="text-xl font-semibold text-white">Dashboard</h1>
            <InputField
              value={""}
              onChange={(e) => console.log(e.target.value)}
              name={"search"}
              placeholder="Search"
              type="text"
              className="bg-base-200 border-base-300 py-2 rounded-2xl text-white w-full max-w-lg"
            />
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3">
              <button className="btn btn-neutral rounded-full w-11 h-11 p-0 border border-base-300">
                <SettingsIcon className="w-5 h-5"/>
              </button>
              <button className="btn btn-neutral rounded-full w-11 h-11 p-0 border border-base-300">
                <Lightbulb className="w-5 h-5"/>
              </button>
              <button className="btn btn-neutral rounded-full w-11 h-11 p-0 border border-base-300">
                <BellDot className="w-5 h-5"/>
              </button>
            </div>
            <div className="w-[1px] h-10 bg-base-300"/>
            <div className="flex items-center gap-3">
              <img src="/gildas.png" alt="Avatar" className="w-12 h-12 rounded-full object-cover border border-base-300"/>
              <span className="text-white font-semibold">Gildas</span>
            </div>
          </div>
        </div>
				<div className="mt-4">
          {children}
        </div>
			</main>
		</div>
  );

}
