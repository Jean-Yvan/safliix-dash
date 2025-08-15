import { PageParamProps } from "@/types/utils";
import EpisodeCard from "@/ui/components/episodeCard";
import Header from "@/ui/components/header";
import Link from "next/link";

export default async function Page({params} : PageParamProps) {
    const { id } = await params;

    return (
			<div>
					<Header title="Liste des épisodes" >
						<Link href={`/dashboard/series/addSeason`} className="btn btn-primary">
							Ajouter une saison
						</Link>
					</Header>
					<div className="mt-4">
						<div className="shadow-lg bg-neutral 		rounded-md p-4 flex items-center gap-4">
							<div className="w-7 h-7 bg-blue-500 rounded-md"/>
							<h1 className="text-white font-bold">SAISON 01</h1>
						</div>
					</div>

					<div className="grid grid-cols-6 gap-2 mt-4">
						{Array.from({ length: 10 }).map((_, index) => (
							<EpisodeCard key={index} id={id} />
						))}
					</div>
			</div>
    );
}