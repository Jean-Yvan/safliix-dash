import React from "react";
import { Ligature, Star } from "lucide-react";
import Link from "next/link";

export default function VideoCard({id} : {id?: string}) {
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
        <h2 className="text-xl font-bold">Au fil du temps</h2>
        <p className="text-green-400">Actif</p>
        <p className="text-sm">Réalisé par SFLIX</p>
        <p className="text-sm">DP : Gildas</p>
        <p className="text-sm">N° 20582</p>
        <p className="text-sm">Catégorie : Documentaire</p>
      </div>

      {/* Statistiques */}
      <div className="flex items-start">
        <img
          src="/elegbara.png"
          alt="scene"
          className="w-56 h-48 object-cover rounded-md"
        />
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
          <div className="flex items-center gap-2">
            <div className="rounded-md p-2 text-center bg-green-200">
              <Ligature className="w-5 h-5"/>  
            </div>
            <div>
                <h4 className="text-red-400 font-bold">1015</h4>
                <p className="text-xs text-neutral-400">min</p>

            </div>
          </div>
          <p className="text-sm">Notes / Avis</p>
           <div className="flex justify-center">
                {[...Array(4)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 w-5 h-5 fill-yellow-400" />
                ))}
                <Star className="text-yellow-400 w-5 h-5" />
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
