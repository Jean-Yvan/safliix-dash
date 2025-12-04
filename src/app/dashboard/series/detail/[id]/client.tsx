"use client";

import EpisodeCard from "@/ui/components/episodeCard";
import Link from "next/link";
import { useState } from "react";

type Props = {
  id: string;
  seasons: string[];
};

export default function SeriesDetailClient({ id, seasons }: Props) {
  const [expandedSeasons, setExpandedSeasons] = useState<Set<string>>(
    () => new Set(seasons)
  );

  const toggleSeason = (season: string) => {
    setExpandedSeasons((prev) => {
      const next = new Set(prev);
      next.has(season) ? next.delete(season) : next.add(season);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {seasons.map((season) => (
        <div key={season} className="space-y-3">
          <div className="shadow-lg bg-neutral rounded-md p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-7 h-7 bg-blue-500 rounded-md" />
              <div className="space-y-1">
                <h1 className="text-white font-bold">SAISON {season}</h1>
                <button
                  type="button"
                  className="btn btn-ghost btn-xs text-white/70"
                  onClick={() => toggleSeason(season)}
                >
                  {expandedSeasons.has(season) ? "Réduire" : "Déplier"}
                </button>
              </div>
            </div>
            <Link
              href={`/dashboard/series/detail/${id}/episodes/add?season=${season}`}
              className="btn btn-sm btn-outline btn-primary"
            >
              Ajouter un épisode
            </Link>
          </div>

          {expandedSeasons.has(season) && (
            <div className="grid grid-cols-6 gap-2">
              {Array.from({ length: 10 }).map((_, index) => (
                <EpisodeCard key={`${season}-${index}`} id={id} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
