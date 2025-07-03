import FilterBtn from "@/ui/components/filterBtn";
import Header from "@/ui/components/header";
import VideoCard from "@/ui/specific/films/components/videoCard";
import { Download } from "lucide-react";
import Link from "next/link";

export default function Page() {
    return (
			<div>
				<Header title="Films"/>
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

					<Link className="btn btn-primary " href={"/dashboard/films/add"}>
						Ajouter un film
					</Link>

				</div>
				<div className="mt-7">
					{Array.from({ length: 10 }).map((_, index) => (
						<VideoCard key={index}/>
					))}
					
				</div>

			</div>
    );
}


