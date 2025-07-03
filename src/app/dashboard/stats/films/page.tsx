'use client';

import BackgroundImg from "@/ui/components/backgroundImg";
import Header from "@/ui/components/header";
import ProgressBar from "@/ui/components/progressBar";
import Image from "next/image"; 

interface MovieStat { title: string; rate: number; views: number; revenu: number; }

// Helper to render stars based on rate (supports half-stars)
const renderStars = (rate: number) => {
  const stars = [];
  for (let i = 1; i < 6; i++) {
    if (rate >= i) {
      stars.push(<div key={i} className="mask mask-star bg-yellow-400" aria-label={`${i} star`}></div>);
    } else if (rate >= i - 0.5) {
      stars.push(<div key={i} className="mask mask-star mask-half-1 bg-yellow-400" aria-label={`${i} half star`}></div>);
    } else {
      stars.push(<div key={i} className="mask mask-star bg-gray-400" aria-label={`${i} star`}></div>);
    }
  }
  return stars;
};

const movieStats: MovieStat[] = [
  { title: "Film 1", rate: 4.5, views: 12000, revenu: 5000 },
  { title: "Film 2", rate: 4.2, views: 11000, revenu: 4800 },
  { title: "Film 3", rate: 4.8, views: 15000, revenu: 6000 },
  { title: "Film 4", rate: 4.0, views: 9000, revenu: 3500 },
  { title: "Film 5", rate: 3.9, views: 8000, revenu: 3200 },
  { title: "Film 6", rate: 4.7, views: 14000, revenu: 5700 },
  { title: "Film 7", rate: 4.1, views: 10000, revenu: 4100 },
  { title: "Film 8", rate: 4.3, views: 10500, revenu: 4300 },
  { title: "Film 9", rate: 4.6, views: 13000, revenu: 5200 },
  { title: "Film 10", rate: 4.4, views: 11500, revenu: 4600 },
];



export default function Page() {
  return (
    <div className="">
      <Header title="Top Produits" className="bg-neutral"/>
      <div className="mt-4">
        <h2 className="text-lg font-bold text-white">Filtrer</h2>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2 flex-2">
            <input type="date" className="input rounded-full text-white" />
            <select defaultValue="Pick a color" className="select">
              <option disabled={true}>Pick a color</option>
              <option>Crimson</option>
              <option>Amber</option>
              <option>Velvet</option>
            </select>
            
          </div>
          <button className="btn btn-primary">Exporter les rappoorts</button>
        </div>

      </div>

      <div className="mt-4 flex items-stretch gap-5">
        <div className="flex-1 bg-neutral p-3 rounded-md">
          <h1 className="font-bold text-white text-lg">Stat par Catégorie</h1>
          <div className="flex flex-col gap-2 items-start">
            <ProgressBar value={116000} maxValue={200000} title={"Horreur"} color={"#6C91BF"}/>
            <ProgressBar value={101000} maxValue={200000} title={"Science-fiction"} color={"#FF5470"}/>
            <ProgressBar value={61000} maxValue={200000} title={"DRAME"} color={"#D8D419"}/>
            <ProgressBar value={61000} maxValue={200000} title={"Documentaire"} color={"#F8D518"}/>
          </div>
        </div>
        <BackgroundImg src={"/elegbara.png"} className="flex-1 relative">
          <div className="absolute right-10 bottom-10  text-white">
            <div className="flex gap-2 items-center ml-2">
              <span className="font-bold text-lg">Vues</span>
              <h1 className="font-bold text-4xl">156k</h1>
            </div>
            <div className="flex gap-2 items-center">
              <span className="font-bold text-lg">Revenu</span>
              <h1 className="font-bold text-4xl">15k</h1>
            </div>

          </div>
        </BackgroundImg>

        <BackgroundImg src={"/elegbara.png"} className="flex-1 relative">
          <div className="absolute right-10 bottom-10  text-white">
            <div className="flex gap-2 items-center ml-2">
              <span className="font-bold text-lg">Vues</span>
              <h1 className="font-bold text-4xl">156k</h1>
            </div>
            <div className="flex gap-2 items-center">
              <span className="font-bold text-lg">Revenu</span>
              <h1 className="font-bold text-4xl">15k</h1>
            </div>

          </div>
        </BackgroundImg>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-6">
        <MovieRow categorie="Horreur" movies={movieStats.slice(0,3)} color="#6C91BF"/>
        <MovieRow categorie="Science Fiction" movies={movieStats.slice(3,6)} color="#FF5470"/>
        <MovieRow categorie="Documentaire" movies={movieStats.slice(6,9)} color="#D8D419"/>
      </div>
    </div>    
  );
}

const MovieRow = ({categorie,movies,color} : {categorie:string;movies:MovieStat[];color:string}) => (
  <div>
    <div className="flex items-center gap-2">
      <div className="rounded-md w-10 h-10" style={{backgroundColor:`${color}`}}/>
      <h2 className="font-bold text-white text-lg">{categorie}</h2>
    </div>
    <div className="mt-4 flex gap-3">
      {
        movies.map((item,index) => <MovieStatCard title={item.title} rate={item.rate} views={item.views} revenu={item.revenu} key={index}/>)
      }
    </div>
  </div>
)

const MovieStatCard = ({title,rate,views,revenu} : { title:string;rate:number;views:number;revenu:number}) => (
  <div className="bg-neutral p-2 rounded-md w-64 shadow ">
    <BackgroundImg src="/elegbara.png" className="w-36 h-24 border-1 border-white rounded-md"/>
    <h2 className="font-bold tzxt-white mt-1">{title}</h2>
    <div className="mt-4">
      <div className="rating rating-xs gap-3 ">
        <>{...renderStars(rate)}</>
      </div>
      <h2 className="text-primary text-sm font-bold mt-2">Visualisation:{views}</h2>
      <h2 className="text-blue text-sm font-bold">Revenu:{revenu}</h2>
    </div>
  </div>
)
