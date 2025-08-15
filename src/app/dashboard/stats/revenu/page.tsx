import MonthlyStatsChart from "@/ui/specific/stats/components/barChart";
import { ArrowDown, ArrowUp } from "lucide-react";
import Link from "next/link";


const StatData = [
  {
    title : "Abonné",
    value : 176000,
    stat:45.00
  },
  {
    title : "Location",
    value : 3100000,
    stat:-12
  },
  {
    title : "Total",
    value : 342000,
    stat:14.98
  }
]

const StatDataH = [
  {
    title : "123k",
    desc : "total abonnement",
    stat:45.00
  },
  {
    title : "52k",
    desc : "total location",
    stat:-12
  },
  {
    title : "200k",
    desc : "total du mois",
    stat:14.98
  }
]

const viewData = [
  {
    iconPath : "/diamond.png",
    bgColor: "#00BA9D"
  },
  {
    iconPath : "/tax.png",
    bgColor: "#FF5470"
  },
  {
    iconPath : "/barcode.png",
    bgColor: "#FF5470"
  }
]

export default function Page() {
  return (
    <div className="flex gap-4 ">
      <div className="flex-2 ">
        <div className="flex items-center gap-4 h-58  p-10 mb-4 shadow-md shadow-base-200 rounded-lg bg-neutral">
          <div className="flex-1">
            <img src = "/shape.png"/>
            <h4 className="font-bold">Total Revenu</h4>
          </div>
          <div className="flex-4 p-10">
            <h4 className="mb-4">Analyse</h4>
            <p className="mb-4">Taux Moyen 2023</p>
            <div className="flex items-center gap-8">
              {StatDataH.map((item,index) => <Card {...item} {...viewData[index]} key={index}/>)}
            </div>
          </div>
        </div>
        <div className="p-4 shadow-md shadow-base-200 rounded-lg bg-neutral">
          <MonthlyStatsChart />
        </div>
      </div>
      <div className="flex-1">
        <div className="relative h-58  p-4 mb-4 shadow-md shadow-base-200 rounded-lg" style={{backgroundImage: 'url("/bg_stat_card.png")',backgroundRepeat:'no-repeat',backgroundPosition: 'center',backgroundSize:"cover"} }>
          <div className="absolute top-20 right-4">
            <h1 className="text-2xl font-bold text-gray-200 ml-2">$476,3k</h1>
            <p className="text-sm text-gray-200 font-bold">revenu total SaFliix</p>
          </div>
        </div>
        <div className="p-4 shadow-md shadow-base-200 rounded-lg bg-neutral">
          <h2 className="text-xl font-bold mb-4">Total Report</h2>
          <p className="mb-4">Toutes les périodes de  01/01/2022 - 08/282025</p>
          <div className="w-full">
            {StatData.map((item,index) => <StatCard {...item} key={index}/>)}
          </div>
          <Link href="/stats/revenu/detail" className="btn btn-primary rounded-full w-full py-2">Plus de détail</Link>
        </div>
      </div>
    </div>
  );
}


const StatCard = ({title,value,stat} : {title:string; value:number;stat:number})  => 
   (
    <div className="flex items-center justify-between w-full mb-5">
      <div className="flex items-center gap-2">
        <div className="bg-white h-10 w-10 rounded-md"/>
        <h4 className="font-bold text-lg">{title}</h4>
      </div>
      
      <h4>{`${value} CFA`}</h4>

      <div className="flex items-center gap-2">
        {
          stat > 0 ? <>
            <ArrowUp className="h-4 w-4 text-primary"/>
            <span className="text-primary text-sm font-bold">{stat}</span>
          </> : <>
            <ArrowDown className="h-4 w-4 text-error"/>
            <span className="text-error text-sm font-bold">{stat}</span>
          </>
        }
      </div>
    </div>
  );

const Card = ({title,desc,stat,iconPath,bgColor} : {title:string; desc:string;stat:number; iconPath:string;bgColor:string}) => (
  <div className="flex gap-4 items-start">
    <div className={`flex items-center justify-center h-10 w-10 p-2 rounded-md`} style={{background:`${bgColor}`}}>
      <img src={iconPath} alt="icon" className="h-4 w-5"/>
    </div>
    <div className="">
      <h3 className="font-bold text-xl">{title}</h3>
      <p className="text-[8px] text-gray font-bold">{desc}</p>
      <div className="mt-5 flex items-center gap-2">
        {
          stat > 0 ? <>
            <ArrowUp className="h-4 w-4 text-primary"/>
            <span className="text-sm text-primary">{`${stat}%`}</span>
          </> : <>
            <ArrowUp className="h-4 w-4 text-error"/>
            <span className="text-sm text-error">{`${stat}%`}</span>
          </>
        }
      </div>
    </div>
  </div>
)
