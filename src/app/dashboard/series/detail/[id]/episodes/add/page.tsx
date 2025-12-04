import { PageParamProps } from "@/types/utils";
import Header from "@/ui/components/header";
import Link from "next/link";
import SeriesEpisodeAddClient from "./client";

export default async function Page({ params }: PageParamProps) {
  const { id } = await params;

  return (
    <div className="space-y-4">
      <Header title="Ajouter un épisode">
        <div className="flex gap-2">
          <Link href={`/dashboard/series/detail/${id}`} className="btn btn-ghost btn-sm">
            Retour
          </Link>
          <button className="btn btn-primary btn-sm">Publier épisode</button>
        </div>
      </Header>

      <SeriesEpisodeAddClient id={id} />
    </div>
  );
}
