import { PageParamProps } from "@/types/utils";
import Header from "@/ui/components/header";
import Link from "next/link";
import SeasonAddClient from "./client";

export default async function Page({ params }: PageParamProps) {
  const { id } = await params;

  return (
    <div className="space-y-4">
      <Header title="Ajouter une saison">
        <div className="flex gap-2">
          <Link href={`/dashboard/series/detail/${id}`} className="btn btn-ghost btn-sm">
            Retour
          </Link>
          <button type="submit" form="season-form" className="btn btn-primary btn-sm">
            Publier saison
          </button>
        </div>
      </Header>

      <SeasonAddClient id={id} />
    </div>
  );
}
