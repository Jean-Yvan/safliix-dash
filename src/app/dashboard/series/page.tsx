import Header from "@/ui/components/header";
import VideoCard from "@/ui/specific/films/components/videoCard";
import { Download } from "lucide-react";
import Link from "next/link";

export default function Page() {
    return (
            <div>
                <Header title="Nos Séries"/>
                <div className="p-4 flex justify-end">
                    <button className="btn btn-primary">
                        <Download className="w-4 h-4" />
                        <span className="ml-2">Télécharger</span>	
                    </button>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <FilterBtn title="Genre" />
                        <FilterBtn title="Année" />
                        <FilterBtn title="Pays" />
                        <FilterBtn title="Langue" />
                        <FilterBtn title="Note" />
                        <FilterBtn title="Durée" />
                    </div>

                    <Link className="btn btn-primary " href={"/dashboard/series/add"}>
                        Ajouter un une série
                    </Link>

                </div>
                <div className="mt-7">
                    {Array.from({ length: 10 }).map((_, index) => (
                        <VideoCard key={index} id={"index"}/>
                    ))}
                    
                </div>

            </div>
    );
}


const FilterBtn = ({title} : {title:string}) => (
    <details className="dropdown bg-neutral">
        <summary className="btn m-1 bg-neutral">
            {title}
            <svg className="fill-current ml-1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
        </summary>
        <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
            <li><a>Item 1</a></li>
            <li><a>Item 2</a></li>
        </ul>
    </details>
);