import React, { useMemo } from "react";
import { Gauge, Play, Star, TrendingUp } from "lucide-react";
import {
  FilmListItem,
  SubscriptionFilmStats,
  RentalFilmStats,
} from "@/types/api/films";

/* ============================================================
 * Type guards
 * ============================================================ */

type SubscriptionStatsWrapper = {
  type: "abonnement";
  stats: SubscriptionFilmStats;
};

type RentalStatsWrapper = {
  type: "location";
  stats: RentalFilmStats;
};

const isSubscriptionStats = (
  stats: FilmListItem["stats"]
): stats is SubscriptionStatsWrapper =>
  stats?.type === "abonnement";

const isRentalStats = (
  stats: FilmListItem["stats"]
): stats is RentalStatsWrapper =>
  stats?.type === "location";

/* ============================================================
 * Helpers métier (lecture des stats)
 * ============================================================ */



const extractStats = (film: FilmListItem) => {
  const stats = film.stats;

  return {
    locationsCount:
      stats && isRentalStats(stats) ? stats.stats.totalRentals : 0,

    revenue:
      stats?.stats.revenue ?? 0,

    donutViewed:
      stats && isSubscriptionStats(stats)
        ? stats.stats.subscriberViewPercentage
        : 0,

    donutCatalog:
      stats && isSubscriptionStats(stats)
        ? stats.stats.catalogTotalMinutes
        : 0,

    donutRevenue:
      stats && isSubscriptionStats(stats)
        ? stats.stats.revenue
        : 0,

    geo:
      stats && isRentalStats(stats)
        ? stats.stats.topCountries
        : [],
  };
};




/* ============================================================
 * Component
 * ============================================================ */

export default function VideoCard({
  film,
  mode,
  detailHref,
}: {
  film: FilmListItem;
  mode: "location" | "abonnement";
  detailHref?: string;
}) {
  const poster = film.poster || "/image-icon.jpg";
  const hero = film.hero || poster;

  const {
    locationsCount,
    revenue,
    donutViewed,
    donutCatalog,
    donutRevenue,
    geo,
  } = extractStats(film);

  const conicGradient = useMemo(() => {
    const segments = [
      { color: "#16a34a", value: donutViewed },
      { color: "#fb7185", value: donutCatalog },
    ];
    const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
    let cursor = 0;

    return segments
      .map((seg) => {
        const start = (cursor / total) * 100;
        cursor += seg.value;
        const end = (cursor / total) * 100;
        return `${seg.color} ${start}% ${end}%`;
      })
      .join(", ");
  }, [donutCatalog, donutViewed]);

  return (
    <div className="bg-neutral text-white p-4 rounded-xl shadow-lg flex flex-col gap-4 border border-base-300">
      <div className="flex items-start gap-4">
        {/* === LEFT === */}
        <div className="flex flex-col items-center gap-2">
          <img
            src={poster}
            alt="Video Poster"
            className="w-40 h-28 object-cover rounded-md"
          />
          <button className="btn btn-success btn-sm w-full rounded-full">
            Modifier
          </button>

          {detailHref && (
            <a
              href={detailHref}
              className="btn btn-ghost btn-xs text-primary border-primary/50 rounded-full w-full text-center"
            >
              Voir les détails
            </a>
          )}

          
        </div>

        {/* === INFO === */}
        <div className="flex-1 flex flex-col gap-1">
          <h2 className="text-2xl font-bold">{film.title}</h2>
          <p className="text-green-400 text-sm">{film.status}</p>
          <p className="text-sm">Réalisé par {film.director}</p>
          <p className="text-sm">DP : {film.dp}</p>
          <p className="text-sm">Catégorie : {film.category}</p>
        </div>

        {/* === HERO === */}
        <div className="flex items-start gap-4 flex-[1.2]">
          <div className="relative">
            <img
              src={hero}
              alt="scene"
              className="w-60 h-48 object-cover rounded-md"
            />
            <button className="absolute inset-0 flex items-center justify-center">
              <span className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg">
                <Play className="w-6 h-6 text-black" />
              </span>
            </button>
          </div>

          {/* === STATS === */}
          <div className="p-3 rounded-lg flex flex-col gap-2 min-w-[160px]">
            <p className="text-sm text-white/70 font-semibold">Statistique:</p>

            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <div>
                <h4 className="text-primary font-bold">{locationsCount}</h4>
                <p className="text-xs text-white/60">
                  {mode === "location" ? "Location" : "Abonnements"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-primary" />
              <div>
                <h4 className="text-primary font-bold">{revenue}</h4>
                <p className="text-xs text-white/60">revenus</p>
              </div>
            </div>

            <p className="text-sm mt-2">Notes / Avis</p>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < (film.stars ?? 0)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-yellow-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* === GEO / DONUT === */}
        {mode === "location" ? (
          <div className="flex-1 space-y-2">
            <h3 className="font-semibold">Revenu géographique</h3>

            <div className="space-y-2">
              {geo.map((geoItem, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <p>{geoItem.name}</p>
                    <p>{geoItem.value.toLocaleString()} f</p>
                  </div>
                  <progress
                    className="progress w-full"
                    value={geoItem.value}
                    max={100}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center gap-4">
            <div className="relative w-44 h-44">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(${conicGradient})`,
                }}
              />
              <div className="absolute inset-3 rounded-full bg-base-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {donutViewed}%
                  </div>
                  <div className="text-xs text-white/60">min suivi</div>
                </div>
              </div>
            </div>

            <div className="text-sm space-y-2">
              <p>Temps total du catalogue</p>
              <p className="text-white/60">{donutCatalog} minutes</p>

              <p>Revenu généré</p>
              <p className="text-white/60">{donutRevenue}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}