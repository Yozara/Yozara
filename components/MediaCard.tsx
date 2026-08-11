"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Heart, Bookmark, BookmarkCheck } from "lucide-react";

export interface MediaCardProps {
  id: number;
  title: string;
  englishTitle?: string;
  coverImage: string;
  bannerImage?: string;
  score: number;
  type: "ANIME" | "MANGA";
  format?: string;
  season?: string;
  year?: number;
  genres: string[];
}

export function MediaCard({
  id, title, coverImage, score, type, format, year, genres,
}: MediaCardProps) {
  const href = type === "ANIME" ? `/anime/${id}` : `/manga/${id}`;
  const safeCoverImage = coverImage || "/hero-image.jpg";
  const [liked, setLiked] = useState(false);
  const [inList, setInList] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;
      setUser(data.user);
      setAuthLoaded(true);

      const { data: likeData } = await supabase
        .from("likes").select("id")
        .eq("user_id", data.user.id).eq("media_id", id).eq("media_type", type).single();
      setLiked(!!likeData);

      const { data: watchData } = await supabase
        .from("watchlist").select("id")
        .eq("user_id", data.user.id).eq("media_id", id).eq("media_type", type).single();
      setInList(!!watchData);
    };
    init();
  }, [id]);

  const toggleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    if (!user) { window.location.href = "/signup"; return; }
    if (liked) {
      await supabase.from("likes").delete()
        .eq("user_id", user.id).eq("media_id", id).eq("media_type", type);
    } else {
      await supabase.from("likes").insert({ user_id: user.id, media_id: id, media_type: type });
    }
    setLiked(!liked);
  };

  const toggleList = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    if (!user) { window.location.href = "/signup"; return; }
    if (inList) {
      await supabase.from("watchlist").delete()
        .eq("user_id", user.id).eq("media_id", id).eq("media_type", type);
    } else {
      await supabase.from("watchlist").insert({
        user_id: user.id, media_id: id, media_type: type,
        title, cover_image: safeCoverImage,
      });
    }
    setInList(!inList);
  };

  return (
    <Link href={authLoaded && !user ? "/signup" : href}>
      <motion.div
        className="group relative h-full cursor-pointer"
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative h-96 overflow-hidden rounded-xl backdrop-blur-md bg-white/5 border border-white/10 shadow-xl transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-brand-pink/30">
          <div className="relative h-64 w-full overflow-hidden bg-gradient-to-b from-white/10 to-transparent">
            <Image
              src={safeCoverImage}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0B0F19]/80" />

            {score > 0 && (
              <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-brand-pink/90 backdrop-blur-sm border border-brand-pink/50 text-white text-xs font-bold">
                {score}%
              </div>
            )}
            {format && (
              <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-xs font-semibold">
                {format}
              </div>
            )}

            {/* Like & Watchlist buttons - show on hover */}
            {user && (
              <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={toggleLike}
                  className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
                    liked ? "bg-red-500/40 border-red-500/60" : "bg-black/50 border-white/20 hover:border-red-500/50"
                  }`}
                >
                  <Heart size={14} className={liked ? "fill-red-400 text-red-400" : "text-white"} />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={toggleList}
                  className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
                    inList ? "bg-brand-pink/40 border-brand-pink/60" : "bg-black/50 border-white/20 hover:border-brand-pink/50"
                  }`}
                >
                  {inList
                    ? <BookmarkCheck size={14} className="text-brand-pink" />
                    : <Bookmark size={14} className="text-white" />
                  }
                </motion.button>
              </div>
            )}
          </div>

          <div className="p-4 h-32 flex flex-col justify-between">
            <div className="flex-1 overflow-hidden">
              <h3 className="text-white font-bold text-sm leading-tight line-clamp-2 group-hover:text-brand-pink transition-colors">
                {title}
              </h3>
            </div>
            <div className="flex flex-wrap gap-1">
              {genres.slice(0, 2).map((genre) => (
                <span key={genre} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs">
                  {genre}
                </span>
              ))}
              {genres.length > 2 && (
                <span className="px-2 py-0.5 text-white/40 text-xs">+{genres.length - 2}</span>
              )}
            </div>
            {year && <p className="text-white/40 text-xs mt-1">{year}</p>}
          </div>

          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-b from-brand-pink/20 to-transparent" />
        </div>
      </motion.div>
    </Link>
  );
}
