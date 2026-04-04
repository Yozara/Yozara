"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Flame, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTrendingMedia } from "@/utils/anilist/client";

type TrendingItem = {
  id: number;
  type?: "ANIME" | "MANGA";
  title?: {
    romaji?: string;
    english?: string;
  };
  coverImage?: {
    large?: string;
    extraLarge?: string;
  };
  averageScore?: number;
  seasonYear?: number;
};

export default function TrendingScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<TrendingItem[]>([]);
  const [loading, setLoading] = useState(true);

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const loadTrending = async () => {
      try {
        setLoading(true);
        const [animePage, mangaPage] = await Promise.all([
          getTrendingMedia("ANIME", 1),
          getTrendingMedia("MANGA", 1),
        ]);

        const animeItems = (animePage?.media || []).slice(0, 8);
        const mangaItems = (mangaPage?.media || []).slice(0, 8);
        setItems([...animeItems, ...mangaItems]);
      } catch (error) {
        console.error("Failed to load trending media:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadTrending();
  }, []);

  return (
    <section className="container mx-auto px-4 relative">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
          <Flame className="h-7 w-7 text-brand-pink" />
          Trending Now
        </h2>
      </div>

      <div className="relative group">
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4"
        >
          {loading ? (
            <div className="w-full py-16 flex items-center justify-center text-white/70">
              <Loader2 className="mr-2 h-5 w-5 animate-spin text-brand-pink" />
              Loading trends...
            </div>
          ) : (
            items.map((item) => {
              const title = item.title?.english || item.title?.romaji || "Untitled";
              const image = item.coverImage?.extraLarge || item.coverImage?.large || "/hero-image.jpg";

              return (
                <Link
                  key={item.id}
                  href={`/${item.type === "MANGA" ? "manga" : "anime"}/${item.id}`}
                  className="shrink-0 snap-start"
                >
                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="min-w-[220px] md:min-w-[260px] aspect-[2/3] rounded-2xl border border-white/10 relative overflow-hidden cursor-pointer bg-[#14182b]"
                  >
                    <Image
                      src={image}
                      alt={title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 220px, 260px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-sm text-white font-semibold line-clamp-2">{title}</p>
                      <p className="text-xs text-white/60 mt-1">
                        {item.seasonYear || "Trending"}
                        {item.averageScore ? ` • ${item.averageScore}%` : ""}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              );
            })
          )}
        </div>

        {/* Floating Scroll Button */}
        <Button
          size="icon"
          variant="secondary"
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 rounded-full w-14 h-14 shadow-2xl bg-white text-zinc-950 hover:bg-zinc-200 opacity-0 group-hover:opacity-100 transition-opacity z-10 hidden md:flex"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>
    </section>
  );
}