import { PageParamProps } from "@/types/utils";
import Header from "@/ui/components/header";
import Link from "next/link";
import SeriesDetailClient from "./client";

const seasons = ["01"];

export default async function Page({ params }: PageParamProps) {
  const { id } = await params;

  return (
    <div className="space-y-4">
      <Header title="Liste des épisodes">
        <Link href={`/dashboard/series/addSeason`} className="btn btn-primary">
          Ajouter une saison
        </Link>
      </Header>

      <SeriesDetailClient id={id} seasons={seasons} />
    </div>
  );
}
