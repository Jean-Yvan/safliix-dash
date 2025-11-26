import FilterBtn from "@/ui/components/filterBtn";
import Header from "@/ui/components/header";
import { Ligature, Star } from "lucide-react";
import Link from "next/link";

export default function Page(){
  const pubs = Array.from({ length: 6 }).map((_, idx) => ({
    id: `pub-${idx + 1}`,
    title: `Campagne ${idx + 1}`,
    status: idx % 2 === 0 ? "Actif" : "En pause",
    date: "08/23/2024",
    poster: "/elegbara.png",
    geo: [
      { label: "Côte d'Ivoire", value: 5000, max: 10000, color: "progress-accent" },
      { label: "Togo", value: 7000, max: 10000, color: "progress-error" },
      { label: "Bénin", value: 4000, max: 10000, color: "progress-primary" },
    ],
    stats: { conversions: "30%", views: "12k" },
  }));

  return (
    <div>
      <Header title="Liste et statistique de pubs"/>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2"> 
          <FilterBtn title="Filtrer par statut"/>
          <FilterBtn title="Meilleures résultats"/>
          <FilterBtn title="Dernier ajout"/>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-primary">Exporter les rapports</button>
          <button className="btn btn-primary">Ajouter </button>
        </div>


      </div>
      <div className="mt-7">
        {pubs.map((pub) => (
          <PubCard key={pub.id} pub={pub}/>
        ))}        
      </div>
    </div>
  )
}


type Pub = {
  id: string;
  title: string;
  status: string;
  date: string;
  poster: string;
  geo: { label: string; value: number; max: number; color: string }[];
  stats: { conversions: string; views: string };
};

function PubCard({ pub } : { pub: Pub}) {
  return (
    <div className="bg-[#1e1e1e] text-white p-4 rounded-xl shadow-lg flex flex-col md:flex-row gap-1 max-w-5xl mx-auto mb-4 relative">
      {/* Poster + Modifier */}
      <Link
        className="absolute top-2 right-2 btn btn-ghost btn-xs text-primary border-primary/50 rounded-full"
        href={`/dashboard/stats/pub/detail/${pub.id}`}
      >
        Voir les détails
      </Link>
      <div className="flex flex-col items-center">
        <img
          src={pub.poster}
          alt={pub.title}
          className="w-36 h-24 object-cover rounded-md"
        />
        <button className="btn btn-accent mt-2">Modifier</button>
      </div>

      {/* Info principale */}
      <div className="flex flex-col gap-2">
        <p className="text-green-400">{pub.status}</p>
        <p className="text-sm">{pub.date}</p>
        <p className="text-lg font-semibold">{pub.title}</p>
      </div>

      {/* Statistiques */}
      <div className="flex flex-1 items-start justify-center  ">
        
        <div className="p-3 rounded-lg">
          <p className="text-sm text-neutral-400 ml-2 font-bold">Statistique:</p>
          <div className="flex items-center gap-2">
            <div className="rounded-md p-2 text-center bg-green-200">
              <Ligature className="w-5 h-5"/>  
            </div>
            <div>
                <h4 className="text-red-400 font-bold">{pub.stats.conversions}</h4>
                <p className="text-xs text-neutral-400">des abon.</p>

            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-md p-2 text-center bg-green-200">
              <Ligature className="w-5 h-5"/>  
            </div>
            <div>
                <h4 className="text-red-400 font-bold">{pub.stats.views}</h4>
                <p className="text-xs text-neutral-400">de vues</p>

            </div>
          </div>
          
           
        
        </div>
       
      </div>

      {/* Revenu Géographique */}
      <div className="flex-1">
        <h3 className="font-semibold ">Revenu géographique</h3>
        <div className="">
          {pub.geo.map((g) => (
            <div key={g.label}>
              <div className="flex items-center justify-between">
                  <p className="text-sm">{g.label}</p>
                  <p className="text-sm">{g.value.toLocaleString()} f</p>    
              </div>
              <progress className={`progress w-full ${g.color}`} value={g.value} max={g.max}></progress>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
