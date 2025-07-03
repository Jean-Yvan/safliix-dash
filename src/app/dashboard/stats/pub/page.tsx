import FilterBtn from "@/ui/components/filterBtn";
import Header from "@/ui/components/header";
import { Ligature, Star } from "lucide-react";
import Link from "next/link";

export default function Page(){
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
        {Array.from({ length: 10 }).map((_, index) => (
          <PubCard key={index}/>
        ))}        
      </div>
    </div>
  )
}


function PubCard({id} : {id?: string}) {
  return (
    <div className="bg-[#1e1e1e] text-white p-4 rounded-xl shadow-lg flex flex-col md:flex-row gap-1 max-w-5xl mx-auto mb-4 relative">
      {/* Poster + Modifier */}
      <Link className="absolute top-2 right-2 flex px-2 py-1 items-center gap-2 bg-primary rounded-md cursor-pointer" href={"/dashboard/series/detail/" + id}>
        
          <span className="text-sm">Voir</span>
        
      </Link>
      <div className="flex flex-col items-center">
        <img
          src="/elegbara.png"
          alt="Video Poster"
          className="w-36 h-24 object-cover rounded-md"
        />
        <button className="btn btn-accent mt-2">Modifier</button>
      </div>

      {/* Info principale */}
      <div className="flex flex-col gap-2">
        <p className="text-green-400">Actif</p>
        <p className="text-sm">08/23/2024</p>
        
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
                <h4 className="text-red-400 font-bold">30 %</h4>
                <p className="text-xs text-neutral-400">des abon.</p>

            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-md p-2 text-center bg-green-200">
              <Ligature className="w-5 h-5"/>  
            </div>
            <div>
                <h4 className="text-red-400 font-bold">12 k</h4>
                <p className="text-xs text-neutral-400">de vues</p>

            </div>
          </div>
          
           
        
        </div>
       
      </div>

      {/* Revenu Géographique */}
      <div className="flex-1">
        <h3 className="font-semibold ">Revenu géographique</h3>
        <div className="">
          <div>
            <div className="flex items-center justify-between">
                <p className="text-sm">Côte d'Ivoire</p>
                <p className="text-sm">5.000 f</p>    
            </div>
            <progress className="progress progress-accent w-full" value="5000" max="10000"></progress>
            
          </div>
          <div>
            <div className="flex items-center justify-between">
                <p className="text-sm">Togo</p>
                <p className="text-sm">7.000 f</p>
            </div>
            <progress className="progress progress-error w-full" value="7000" max="10000"></progress>
            
          </div>
          <div>
            <div className="flex items-center justify-between">
                <p className="text-sm">Togo</p>
                <p className="text-sm">7.000 f</p>
            </div>
            <progress className="progress progress-error w-full" value="7000" max="10000"></progress>
            
          </div>
          <div>
            <div className="flex items-center justify-between">
                <p className="text-sm">Togo</p>
                <p className="text-sm">7.000 f</p>
            </div>
            <progress className="progress progress-error w-full" value="7000" max="10000"></progress>
            
          </div>
          
        </div>
      </div>
    </div>
  );
}
