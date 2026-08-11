"use client";

import WheelOfFate from "@/components/WheelOfFate";
import FortuneCard from "@/components/FortuneCard";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame, Star, Tv, BookOpen, ChevronRight,
  ChevronLeft, Clock, Sparkles, X, Zap, Compass
} from "lucide-react";
import { getTrendingMedia, searchMedia } from "@/utils/anilist/client";
import TopAnimeThisWeek from "@/components/TopAnimeThisWeek";
import TopMangaThisWeek from "@/components/TopMangaThisWeek";
import { Zen_Tokyo_Zoo } from "next/font/google";

const rampart = Zen_Tokyo_Zoo({ subsets: ["latin"], weight: "400" });

type MediaItem = {
  id: number;
  type?: "ANIME" | "MANGA";
  title?: { romaji?: string; english?: string };
  coverImage?: { large?: string; extraLarge?: string };
  bannerImage?: string;
  averageScore?: number;
  seasonYear?: number;
  season?: string;
  status?: string;
  genres?: string[];
  episodes?: number;
  chapters?: number;
};

function MediaRow({
  title, icon, items, type, loading,
}: {
  title: string;
  icon: React.ReactNode;
  items: MediaItem[];
  type: "ANIME" | "MANGA";
  loading: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "right" ? 340 : -340, behavior: "smooth" });
  };

  return (
    <section className="mb-14">
      <div className="flex items-center justify-between mb-5 px-4 sm:px-6">
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
          {icon} {title}
        </h2>
        <Link href={`/${type.toLowerCase()}`} className="text-brand-pink text-sm font-semibold flex items-center gap-1 hover:underline">
          See all <ChevronRight size={15} />
        </Link>
      </div>
      <div className="relative group">
        <button onClick={() => scroll("left")} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-brand-pink text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all -translate-x-1/2">
          <ChevronLeft size={20} />
        </button>
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory px-4 sm:px-6 pb-2">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="shrink-0 w-[160px] h-[240px] rounded-2xl bg-white/5 animate-pulse snap-start" />
              ))
            : items.map((item) => {
                const title = item.title?.english || item.title?.romaji || "Untitled";
                const img = item.coverImage?.extraLarge || item.coverImage?.large || "/hero-image.jpg";
                return (
                  <Link key={item.id} href={`/${type.toLowerCase()}/${item.id}`} className="shrink-0 snap-start">
                    <motion.div
                      whileHover={{ scale: 1.05, y: -6 }}
                      className="relative w-[160px] h-[240px] rounded-2xl overflow-hidden border border-white/10 hover:border-brand-pink/60 transition-colors cursor-pointer"
                    >
                      <Image src={img} alt={title} fill className="object-cover" sizes="160px" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      {item.averageScore && (
                        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full">
                          <Star size={10} className="text-yellow-400 fill-yellow-400" />
                          <span className="text-white text-[10px] font-bold">{(item.averageScore / 10).toFixed(1)}</span>
                        </div>
                      )}
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-white text-xs font-semibold line-clamp-2 leading-tight">{title}</p>
                        {item.seasonYear && <p className="text-white/50 text-[10px] mt-1">{item.seasonYear}</p>}
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
        </div>
        <button onClick={() => scroll("right")} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-brand-pink text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all translate-x-1/2">
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}

function RecentlyViewed() {
  const [items, setItems] = useState<{ id: number; type: string; title: string; image: string }[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("yozara_recent") || "[]");
      setItems(stored.slice(0, 10));
    } catch {}
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="mb-14">
      <div className="flex items-center gap-2 mb-5 px-4 sm:px-6">
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Clock size={22} className="text-brand-pink" /> Recently Viewed
        </h2>
      </div>
      <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 sm:px-6 pb-2">
        {items.map((item) => (
          <Link key={item.id} href={`/${item.type}/${item.id}`} className="shrink-0">
            <motion.div
              whileHover={{ scale: 1.05, y: -4 }}
              className="relative w-[130px] h-[195px] rounded-xl overflow-hidden border border-white/10 hover:border-brand-pink/60 transition-colors"
            >
              <Image src={item.image} alt={item.title} fill className="object-cover" sizes="130px" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <p className="absolute bottom-2 left-2 right-2 text-white text-[10px] font-semibold line-clamp-2">{item.title}</p>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function WhatShouldIWatch() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-brand-pink to-purple-500 text-white font-bold shadow-2xl shadow-brand-pink/40 text-sm"
      >
        <Sparkles size={18} /> What should I watch?
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 40 }}
              exit={{ scale: 0.85, opacity: 0, y: 40 }}
              className="relative max-w-3xl mx-auto my-10 bg-[#0F1428] border border-white/10 rounded-3xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-white/40 hover:text-white z-10">
                <X size={20} />
              </button>
              <WheelOfFate />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function HeroSection({ user }: { user: User | null }) {
  const [currentText, setCurrentText] = useState(0);
  const texts = ["Anime Universe", "Manga World", "Your animanga niche"];

  useEffect(() => {
    const interval = setInterval(() => setCurrentText((t) => (t + 1) % texts.length), 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <img src="/bg-home.png" alt="hero" className="w-full h-full object-cover" style={{ filter: "blur(2px)", transform: "scale(1.05)" }} />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0B0F19]" />
      </div>

      <div className="absolute top-20 left-10 w-64 h-64 bg-brand-pink/20 rounded-full blur-3xl pointer-events-none z-10" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none z-10" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-brand-pink/70 text-sm font-medium tracking-widest mb-4 uppercase"
        >
          ようこそ • Welcome to Yozara
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`${rampart.className} text-5xl md:text-7xl font-extrabold text-white mb-4 leading-tight [text-shadow:_2px_2px_0px_#000,_-2px_-2px_0px_#000,_2px_-2px_0px_#000,_-2px_2px_0px_#000]`}
        >
          Discover
          <br />
          <AnimatePresence mode="wait">
            <motion.span
              key={currentText}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-white"
              style={{ textShadow: "2px 2px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000" }}
            >
              {texts[currentText]}
            </motion.span>
          </AnimatePresence>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white/70 text-lg md:text-xl mb-8 max-w-xl mx-auto"
        >
          Your one-stop destination for all things anime & manga. Explore, discover, and get lost in the world of Japanese media.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          {user ? (
            <>
              <Link href="/anime" className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-brand-pink text-white font-bold hover:bg-brand-pink/80 transition-all shadow-lg shadow-brand-pink/30">
                <Tv size={18} /> Browse Anime
              </Link>
              <Link href="/manga" className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition-all backdrop-blur-sm">
                <BookOpen size={18} /> Browse Manga
              </Link>
            </>
          ) : (
            <>
              <Link href="/signup" className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-brand-pink text-white font-bold hover:bg-brand-pink/80 transition-all shadow-lg shadow-brand-pink/30">
                <Zap size={18} /> Get Started Free
              </Link>
              <Link href="/anime" className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition-all backdrop-blur-sm">
                <Compass size={18} /> Explore Now
              </Link>
            </>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center gap-8 mt-10"
        >
          {[
            { label: "Anime Titles", value: "15,000+" },
            { label: "Manga Series", value: "40,000+" },
            { label: "Genres", value: "30+" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-white font-extrabold text-xl">{s.value}</p>
              <p className="text-white/40 text-xs">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0B0F19] to-transparent pointer-events-none z-20" />
    </section>
  );
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [trendingAnime, setTrendingAnime] = useState<MediaItem[]>([]);
  const [trendingManga, setTrendingManga] = useState<MediaItem[]>([]);
  const [topRated, setTopRated] = useState<MediaItem[]>([]);
  const [airing, setAiring] = useState<MediaItem[]>([]);
  const [loadingAnime, setLoadingAnime] = useState(true);
  const [loadingManga, setLoadingManga] = useState(true);
  const [loadingTop, setLoadingTop] = useState(true);
  const [loadingAiring, setLoadingAiring] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    getTrendingMedia("ANIME", 1).then((p) => {
      setTrendingAnime((p?.media || []).slice(0, 16));
      setLoadingAnime(false);
    }).catch(() => setLoadingAnime(false));

    getTrendingMedia("MANGA", 1).then((p) => {
      setTrendingManga((p?.media || []).slice(0, 16));
      setLoadingManga(false);
    }).catch(() => setLoadingManga(false));

    searchMedia("ANIME", { sort: "SCORE_DESC", page: 1 }).then((d) => {
      setTopRated((d?.Page?.media || []).slice(0, 16));
      setLoadingTop(false);
    }).catch(() => setLoadingTop(false));

    searchMedia("ANIME", { status: "RELEASING", sort: "POPULARITY_DESC", page: 1 }).then((d) => {
      setAiring((d?.Page?.media || []).slice(0, 16));
      setLoadingAiring(false);
    }).catch(() => setLoadingAiring(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0F19]">
      <HeroSection user={user} />

      <div className="max-w-screen-xl mx-auto pt-10">
        <RecentlyViewed />
        <FortuneCard />

        <MediaRow
          title="Trending Anime "
          icon={<Flame size={22} className="text-orange-400" />}
          items={trendingAnime}
          type="ANIME"
          loading={loadingAnime}
        />

        <MediaRow
          title="Trending Manga "
          icon={<BookOpen size={22} className="text-purple-400" />}
          items={trendingManga}
          type="MANGA"
          loading={loadingManga}
        />

        <TopAnimeThisWeek />
        <TopMangaThisWeek />

        <MediaRow
          title="Currently Airing "
          icon={<Tv size={22} className="text-green-400" />}
          items={airing}
          type="ANIME"
          loading={loadingAiring}
        />

        <MediaRow
          title="Top Rated All Time "
          icon={<Star size={22} className="text-yellow-400" />}
          items={topRated}
          type="ANIME"
          loading={loadingTop}
        />
      </div>

      <WhatShouldIWatch />
    </div>
  );
}
