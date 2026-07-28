"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { searchMedia } from "@/utils/anilist/client";

const GENRES = [
  { name: "Action", emoji: "⚔️" },
  { name: "Romance", emoji: "💕" },
  { name: "Comedy", emoji: "😂" },
  { name: "Horror", emoji: "👻" },
  { name: "Fantasy", emoji: "🧙" },
  { name: "Sci-Fi", emoji: "🚀" },
  { name: "Slice of Life", emoji: "🌸" },
  { name: "Mystery", emoji: "🔍" },
  { name: "Sports", emoji: "⚽" },
  { name: "Psychological", emoji: "🧠" },
];

type GenreImage = {
  banner: string | null;
  cover: string | null;
};

export default function GenreExplorer() {
  const router = useRouter();
  const [images, setImages] = useState<Record<string, GenreImage>>({});

  useEffect(() => {
    const fetchAll = async () => {
      const results = await Promise.allSettled(
        GENRES.map(async (g) => {
          const data = await searchMedia("ANIME", {
            genre: [g.name],
            sort: "POPULARITY_DESC",
            page: 1,
          });
          const items = data?.Page?.media || [];
          // Pick a random one from top 5 for variety
          const pick = items[Math.floor(Math.random() * Math.min(items.length, 5))];
          return {
            name: g.name,
            banner: pick?.bannerImage || null,
            cover: pick?.coverImage?.extraLarge || pick?.coverImage?.large || null,
          };
        })
      );

      const map: Record<string, GenreImage> = {};
      results.forEach((r) => {
        if (r.status === "fulfilled" && r.value) {
          map[r.value.name] = { banner: r.value.banner, cover: r.value.cover };
        }
      });
      setImages(map);
    };

    fetchAll();
  }, []);

  return (
    <section className="mb-14 px-4 sm:px-6">
      <h2 className="text-2xl font-extrabold text-white flex items-center gap-2 mb-5">
        🎨 Browse by Genre
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {GENRES.map((g) => {
          const img = images[g.name];
          const bgSrc = img?.banner || img?.cover || null;

          return (
            <motion.button
              key={g.name}
              whileHover={{ scale: 1.06, y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push(`/anime?genre=${encodeURIComponent(g.name)}`)}
              className="relative rounded-2xl h-24 overflow-hidden cursor-pointer group border border-white/10 hover:border-brand-pink/60 transition-colors"
            >
              {/* Background image */}
              {bgSrc ? (
                <Image
                  src={bgSrc}
                  alt={g.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="200px"
                />
              ) : (
                <div className="absolute inset-0 bg-white/5 animate-pulse" />
              )}

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors" />

              {/* Pink glow on hover */}
              <div className="absolute inset-0 bg-brand-pink/0 group-hover:bg-brand-pink/20 transition-colors" />

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full gap-1">
                <span className="text-2xl drop-shadow-lg">{g.emoji}</span>
                <span className="text-white text-xs font-extrabold drop-shadow-lg tracking-wide">
                  {g.name}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
