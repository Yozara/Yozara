"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { X, BookOpen, Tv, Heart, Bookmark, ChevronRight } from "lucide-react";
import Link from "next/link";

type WatchlistItem = {
  id: string;
  media_id: number;
  media_type: string;
  title: string;
  cover_image: string;
};

type LikeItem = {
  id: string;
  media_id: number;
  media_type: string;
};

export default function WatchlistPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<"watchlist" | "likes">("watchlist");
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [likes, setLikes] = useState<LikeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!open) return;
    const fetch = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const [{ data: wl }, { data: lk }] = await Promise.all([
        supabase.from("watchlist").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("likes").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);
      setWatchlist(wl || []);
      setLikes(lk || []);
      setLoading(false);
    };
    fetch();
  }, [open]);

  const removeWatchlist = async (id: string) => {
    await supabase.from("watchlist").delete().eq("id", id);
    setWatchlist((prev) => prev.filter((i) => i.id !== id));
  };

  const removeLike = async (id: string) => {
    await supabase.from("likes").delete().eq("id", id);
    setLikes((prev) => prev.filter((i) => i.id !== id));
  };

  const animeWatchlist = watchlist.filter((i) => i.media_type === "ANIME");
  const mangaWatchlist = watchlist.filter((i) => i.media_type === "MANGA");

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0F1428] border-l border-white/10 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div>
                <h2 className="text-xl font-extrabold text-white">My Shelf 📚</h2>
                <p className="text-white/40 text-xs mt-0.5">your personal anime & manga collection</p>
              </div>
              <button onClick={onClose} className="text-white/40 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/5">
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 px-6 py-3 border-b border-white/10">
              <button
                onClick={() => setTab("watchlist")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${tab === "watchlist" ? "bg-brand-pink text-white" : "bg-white/5 text-white/50 hover:bg-white/10"}`}
              >
                <Bookmark size={14} /> Saved ({watchlist.length})
              </button>
              <button
                onClick={() => setTab("likes")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${tab === "likes" ? "bg-red-500/80 text-white" : "bg-white/5 text-white/50 hover:bg-white/10"}`}
              >
                <Heart size={14} /> Liked ({likes.length})
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="w-8 h-8 border-2 border-brand-pink border-t-transparent rounded-full animate-spin" />
                </div>
              ) : tab === "watchlist" ? (
                <>
                  {watchlist.length === 0 ? (
                    <div className="text-center py-16">
                      <p className="text-4xl mb-3">📭</p>
                      <p className="text-white/40 text-sm">Your shelf is empty!</p>
                      <p className="text-white/25 text-xs mt-1">Start adding anime & manga to build your collection</p>
                    </div>
                  ) : (
                    <>
                      {/* Anime shelf */}
                      {animeWatchlist.length > 0 && (
                        <div className="mb-8">
                          <div className="flex items-center gap-2 mb-3">
                            <Tv size={14} className="text-brand-pink" />
                            <h3 className="text-white/60 text-xs font-bold uppercase tracking-widest">Anime</h3>
                            <span className="text-white/30 text-xs">({animeWatchlist.length})</span>
                          </div>
                          {/* Shelf */}
                          <div className="relative">
                            {/* Shelf board */}
                            <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-b from-[#2a1f0e] to-[#1a1208] rounded-sm shadow-lg" />
                            <div className="flex gap-2 pb-3 overflow-x-auto no-scrollbar">
                              {animeWatchlist.map((item) => (
                                <div key={item.id} className="relative shrink-0 group">
                                  <Link href={`/anime/${item.media_id}`} onClick={onClose}>
                                    <motion.div
                                      whileHover={{ y: -8, rotate: [-1, 1][Math.floor(Math.random() * 2)] }}
                                      className="relative w-16 h-24 rounded-sm overflow-hidden border border-white/10 cursor-pointer shadow-md"
                                      style={{ boxShadow: "2px 4px 8px rgba(0,0,0,0.5)" }}
                                    >
                                      <img src={item.cover_image} alt={item.title} className="w-full h-full object-cover" />
                                      {/* Spine effect */}
                                      <div className="absolute inset-y-0 left-0 w-1.5 bg-black/30" />
                                    </motion.div>
                                  </Link>
                                  {/* Remove button */}
                                  <button
                                    onClick={() => removeWatchlist(item.id)}
                                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hidden group-hover:flex z-10"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Manga shelf */}
                      {mangaWatchlist.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-3">
                            <BookOpen size={14} className="text-purple-400" />
                            <h3 className="text-white/60 text-xs font-bold uppercase tracking-widest">Manga</h3>
                            <span className="text-white/30 text-xs">({mangaWatchlist.length})</span>
                          </div>
                          <div className="relative">
                            <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-b from-[#1a0e2a] to-[#110820] rounded-sm shadow-lg" />
                            <div className="flex gap-2 pb-3 overflow-x-auto no-scrollbar">
                              {mangaWatchlist.map((item) => (
                                <div key={item.id} className="relative shrink-0 group">
                                  <Link href={`/manga/${item.media_id}`} onClick={onClose}>
                                    <motion.div
                                      whileHover={{ y: -8 }}
                                      className="relative w-16 h-24 rounded-sm overflow-hidden border border-white/10 cursor-pointer shadow-md"
                                      style={{ boxShadow: "2px 4px 8px rgba(0,0,0,0.5)" }}
                                    >
                                      <img src={item.cover_image} alt={item.title} className="w-full h-full object-cover" />
                                      <div className="absolute inset-y-0 left-0 w-1.5 bg-black/30" />
                                    </motion.div>
                                  </Link>
                                  <button
                                    onClick={() => removeWatchlist(item.id)}
                                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hidden group-hover:flex z-10"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              ) : (
                /* Likes tab */
                <>
                  {likes.length === 0 ? (
                    <div className="text-center py-16">
                      <p className="text-4xl mb-3">💔</p>
                      <p className="text-white/40 text-sm">No likes yet!</p>
                      <p className="text-white/25 text-xs mt-1">Heart anime & manga you love to see them here</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-3">
                      {likes.map((item) => (
                        <div key={item.id} className="relative group">
                          <Link href={`/${item.media_type.toLowerCase()}/${item.media_id}`} onClick={onClose}>
                            <motion.div
                              whileHover={{ scale: 1.05, y: -4 }}
                              className="relative h-28 rounded-xl overflow-hidden border border-white/10 hover:border-red-400/50 cursor-pointer"
                            >
                              <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                <Heart size={20} className="text-red-400/50" />
                              </div>
                              <div className="absolute top-2 right-2">
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${item.media_type === "ANIME" ? "bg-brand-pink text-white" : "bg-purple-600 text-white"}`}>
                                  {item.media_type}
                                </span>
                              </div>
                            </motion.div>
                          </Link>
                          <button
                            onClick={() => removeLike(item.id)}
                            className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hidden group-hover:flex z-10"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/10">
              <Link href="/anime" onClick={onClose} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-sm font-bold transition-all">
                Browse more <ChevronRight size={16} />
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
