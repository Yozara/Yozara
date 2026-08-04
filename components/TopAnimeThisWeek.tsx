"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, TrendingUp } from "lucide-react";
import { getTrendingMedia } from "@/utils/anilist/client";
type MediaItem = {
  id: number;
  title?: { romaji?: string; english?: string };
  coverImage?: { large?: string; extraLarge?: string };
  bannerImage?: string;
  averageScore?: number;
  seasonYear?: number;
  episodes?: number;
  status?: string;
  genres?: string[];
  description?: string;
};

export default function TopAnimeThisWeek() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTrendingMedia("ANIME", 1).then((p) => {
      setItems((p?.media || []).slice(0, 10));
      setLoading(false);
    });
  }, []);

  const top3 = items.slice(0, 3);
  const rest = items.slice(3, 10);

  if (loading) {
    return (
      <section className="mb-14 px-4 sm:px-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-7 bg-brand-pink rounded-full" />
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <TrendingUp size={22} className="text-brand-pink" /> Top 10 Anime This Week
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {[1,2,3].map(i => <div key={i} className="h-[200px] rounded-2xl bg-white/5 animate-pulse" />)}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {[1,2,3,4,5,6,7].map(i => <div key={i} className="h-[160px] rounded-xl bg-white/5 animate-pulse" />)}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-14 px-4 sm:px-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-7 bg-brand-pink rounded-full" />
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <TrendingUp size={22} className="text-brand-pink" /> Top 10 Anime This Week
        </h2>
      </div>

      {/* Top 3 — Big cards like IMDb #1 #2 #3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {top3.map((item, index) => {
          const title = item.title?.english || item.title?.romaji || "Untitled";
          const img = item.coverImage?.extraLarge || item.coverImage?.large || "/hero-image.jpg";
          const banner = item.bannerImage || img;
          const desc = item.description
            ? item.description.replace(/<[^>]*>/g, "").slice(0, 120) + "..."
            : null;

          return (
            <Link href={`/anime/${item.id}`} key={item.id}>
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="relative rounded-2xl overflow-hidden bg-[#111827] border border-white/10 hover:border-brand-pink/50 transition-colors cursor-pointer h-[200px] group"
              >
                {/* Banner background */}
                <Image src={banner} alt={title} fill className="object-cover opacity-40 group-hover:opacity-55 transition-opacity" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />

                {/* Rank badge */}
                <div className={`absolute top-3 left-3 text-white text-xs font-extrabold px-2.5 py-1 rounded-lg ${
                  index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-orange-600"
                }`}>
                  #{index + 1}
                </div>

                {/* Cover + Info */}
                <div className="absolute inset-0 flex items-center gap-4 p-4">
                  <div className="relative w-24 h-36 rounded-xl overflow-hidden shrink-0 shadow-2xl border border-white/10">
                    <Image src={img} alt={title} fill className="object-cover" sizes="96px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-extrabold text-base line-clamp-2 mb-1">{title}</h3>
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      {item.averageScore && (
                        <div className="flex items-center gap-1">
                          <Star size={12} className="text-yellow-400 fill-yellow-400" />
                          <span className="text-yellow-400 text-xs font-bold">{(item.averageScore / 10).toFixed(1)}</span>
                        </div>
                      )}
                      {item.seasonYear && (
                        <span className="text-white/50 text-xs">{item.seasonYear}</span>
                      )}
                      {item.episodes && (
                        <span className="text-white/50 text-xs">{item.episodes} eps</span>
                      )}
                    </div>
                    {desc && <p className="text-white/50 text-xs line-clamp-3 leading-relaxed">{desc}</p>}
                    {item.genres && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.genres.slice(0, 2).map(g => (
                          <span key={g} className="text-[10px] px-2 py-0.5 rounded-full bg-brand-pink/20 text-brand-pink border border-brand-pink/30">{g}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* #4–10 — Smaller poster cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
        {rest.map((item, index) => {
          const title = item.title?.english || item.title?.romaji || "Untitled";
          const img = item.coverImage?.extraLarge || item.coverImage?.large || "/hero-image.jpg";
          return (
            <Link href={`/anime/${item.id}`} key={item.id}>
              <motion.div
                whileHover={{ y: -5, scale: 1.04 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="relative rounded-xl overflow-hidden border border-white/10 hover:border-brand-pink/50 transition-colors cursor-pointer group"
              >
                <div className="relative h-[160px]">
                  <Image src={img} alt={title} fill className="object-cover" sizes="120px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                  {/* Rank */}
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-md">
                    #{index + 4}
                  </div>

                  {/* Score */}
                  {item.averageScore && (
                    <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/60 px-1.5 py-0.5 rounded-md">
                      <Star size={9} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-white text-[9px] font-bold">{(item.averageScore / 10).toFixed(1)}</span>
                    </div>
                  )}

                  <p className="absolute bottom-2 left-2 right-2 text-white text-[10px] font-semibold line-clamp-2">{title}</p>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
