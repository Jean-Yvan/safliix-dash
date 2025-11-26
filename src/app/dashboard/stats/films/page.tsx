'use client';

import { ResponsiveBar } from '@nivo/bar';
import Header from "@/ui/components/header";
import { Download, CircleDollarSign, Video, PlayCircle } from "lucide-react";

const overviewCards = [
  { label: "totale abonnement", value: "123k f", icon: CircleDollarSign, trend: "+45.00%", trendColor: "text-green-400" },
  { label: "totale locations", value: "52k f", icon: PlayCircle, trend: "-12%", trendColor: "text-red-400" },
  { label: "Total du mois", value: "5234", icon: Video, trend: "+14.56%", trendColor: "text-green-400" },
];

const totalReport = [
  { label: "Abonne", value: "$176,120", trend: "+45.00%", trendColor: "text-green-400" },
  { label: "Location", value: "$310,452", trend: "-12%", trendColor: "text-red-400" },
  { label: "Total", value: "$342,558", trend: "+14.56%", trendColor: "text-green-400" },
];

const barData = [
  { month: 'Jan', revenue: 30, expense: 5 },
  { month: 'Feb', revenue: 90, expense: 30 },
  { month: 'Mar', revenue: 70, expense: 40 },
  { month: 'Apr', revenue: 50, expense: 25 },
  { month: 'May', revenue: 80, expense: 15 },
  { month: 'Jun', revenue: 60, expense: 5 },
  { month: 'Jul', revenue: 100, expense: 30 },
  { month: 'Aug', revenue: 70, expense: 20 },
  { month: 'Sep', revenue: 95, expense: 50 },
  { month: 'Oct', revenue: 75, expense: 35 },
  { month: 'Nov', revenue: 60, expense: 20 },
  { month: 'Dec', revenue: 45, expense: 15 },
];

export default function Page() {
  return (
    <div className="space-y-4">
      <Header title="Détails revenus" className="rounded-2xl border border-base-300 shadow-sm px-5">
        <div className="flex items-center gap-3">
          <button className="btn btn-primary btn-sm rounded-lg">
            <Download className="w-4 h-4"/>
            <span className="ml-1">Exporter les rapports</span>
          </button>
          <div className="bg-base-200 px-3 py-2 rounded-lg border border-base-300 text-sm text-white/80">
            September 28, 2023 12:35 PM
          </div>
        </div>
      </Header>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-neutral border border-base-300 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">Analyse</h2>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <span className="w-2 h-2 rounded-full bg-primary inline-block"/>
              <span>Average Rate 2023</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-base-200/40 rounded-xl p-4 border border-base-300 flex flex-col justify-center items-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-cyan-500 flex items-center justify-center text-lg font-semibold">
                Revenu
              </div>
              <p className="mt-2 text-white/80 text-sm">rapport</p>
            </div>
            {overviewCards.map((card) => (
              <div key={card.label} className="bg-base-200/40 rounded-xl p-4 border border-base-300 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-white/80 text-sm capitalize">
                  <card.icon className="w-5 h-5 text-primary"/>
                  {card.label}
                </div>
                <div className="text-2xl font-bold text-white">{card.value}</div>
                <div className={`text-xs ${card.trendColor}`}>{card.trend}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-neutral border border-base-300 rounded-2xl p-6 flex items-center justify-center">
          <div className="w-full h-64 rounded-2xl bg-gradient-to-br from-green-400/60 via-cyan-400/40 to-blue-500/40 flex items-center justify-center text-white">
            <div className="text-center">
              <div className="text-3xl font-bold">$476,3k</div>
              <p className="text-sm text-white/70">revenu total SFLIX</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-neutral border border-base-300 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Sales Statistic 2022</h3>
              <p className="text-xs text-white/60">Revenue vs Expense</p>
            </div>
            <div className="flex items-center gap-4 text-sm text-white/70">
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-[#b7d4fb]"/><span>Revenue</span></span>
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-[#7c1c1c]"/><span>Expense</span></span>
            </div>
          </div>
          <div className="h-72 mt-4">
            <ResponsiveBar
              data={barData}
              keys={['revenue', 'expense']}
              indexBy="month"
              margin={{ top: 20, right: 20, bottom: 30, left: 40 }}
              padding={0.2}
              colors={({ id }) => id === 'revenue' ? '#b7d4fb' : '#7c1c1c'}
              enableLabel={false}
              axisBottom={{
                tickSize: 0,
                tickPadding: 10,
                legend: '',
              }}
              axisLeft={{
                tickSize: 0,
                tickPadding: 5,
                legend: '',
              }}
              theme={{
                textColor: '#fff',
                grid: { line: { stroke: '#2f2f2f' } }
              }}
              borderRadius={4}
            />
          </div>
        </div>

        <div className="bg-neutral border border-base-300 rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">Total Report</h3>
          <p className="text-xs text-white/60">Toutes les périodes de 01/01/2022 - 08/28/2025</p>
          <div className="space-y-3">
            {totalReport.map((item) => (
              <div key={item.label} className="flex items-center justify-between bg-base-200/30 p-3 rounded-lg border border-base-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-base-200 border border-base-300"/>
                  <div>
                    <div className="text-sm text-white font-semibold">{item.label}</div>
                    <div className="text-xs text-white/60">{item.value}</div>
                  </div>
                </div>
                <div className={`text-xs font-semibold ${item.trendColor}`}>{item.trend}</div>
              </div>
            ))}
          </div>
          <button className="btn btn-primary w-full rounded-full mt-4">Plus de détail</button>
        </div>
      </div>
    </div>
  );
}
