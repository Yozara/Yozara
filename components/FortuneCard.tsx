"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { searchMedia } from "@/utils/anilist/client";
import { Sparkles, RefreshCw } from "lucide-react";

type MediaItem = {
  id: number;
  type?: string;
  title?: { romaji?: string; english?: string };
  coverImage?: { large?: string; extraLarge?: string };
  genres?: string[];
  averageScore?: number;
  episodes?: number;
  chapters?: number;
};

const CARD_BACK_SYMBOLS = ["⛩️", "🌸", "⚡", "🗡️", "🐉", "🌙", "👁️", "🔮"];

export default function FortuneCard() {
  const [phase, setPhase] = useState<"idle" | "picking" | "flipping" | "revealed">("idle");
  const [result, setResult] = useState<MediaItem | null>(null);
  const [resultType, setResultType] = useState<"ANIME" | "MANGA">("ANIME");
  const [selectedSymbol] = useState(() => CARD_BACK_SYMBOLS[Math.floor(Math.random() * CARD_BACK_SYMBOLS.length)]);
  const [flipped, setFlipped] = useState(false);

  const pickCard = async () => {
    if (phase !== "idle") return;
    setPhase("picking");
    setFlipped(false);
    setResult(null);

    try {
      const page = Math.floor(Math.random() * 5) + 1;
      const type = Math.random() > 0.5 ? "ANIME" : "MANGA";
      setResultType(type as "ANIME" | "MANGA");
      const data = await searchMedia(type, { sort: "POPULARITY_DESC", page });
      const items: MediaItem[] = data?.Page?.media || [];
      const pick = items[Math.floor(Math.random() * items.length)];
      setResult(pick || null);

      setTimeout(() => {
        setPhase("flipping");
        setTimeout(() => {
          setFlipped(true);
          setPhase("revealed");
        }, 800);
      }, 1000);
    } catch {
      setPhase("idle");
    }
  };

  const reset = () => {
    setPhase("idle");
    setFlipped(false);
    setResult(null);
  };

  const img = result?.coverImage?.extraLarge || result?.coverImage?.large || "/hero-image.jpg";
  const title = result?.title?.english || result?.title?.romaji || "???";

  return (
    <section className="mb-14 px-4 sm:px-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-7 bg-brand-pink rounded-full" />
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
          🃏 Fortune Card
        </h2>
        <span className="text-white/40 text-sm">Draw your fate</span>
      </div>

      <div className="flex flex-col items-center gap-6">

        {/* Card Deck + Draw area */}
        <div className="relative flex items-center justify-center w-full h-[320px]">

          {/* Stacked deck behind (decorative) */}
          {phase === "idle" && (
            <>
              {[3, 2, 1].map((i) => (
                <div
                  key={i}
                  className="absolute rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a1040] to-[#0d0820]"
                  style={{
                    width: 180,
                    height: 260,
                    transform: `rotate(${(i - 2) * 4}deg) translateY(${i * 3}px)`,
                    zIndex: i,
                  }}
                />
              ))}
            </>
          )}

          {/* Main card */}
          <motion.div
            className="relative cursor-pointer"
            style={{ width: 180, height: 260, zIndex: 10, perspective: 1000 }}
            animate={
              phase === "picking"
                ? { y: [-10, -40, -10], rotate: [0, -5, 5, 0] }
                : phase === "flipping"
                ? { rotateY: 90 }
                : {}
            }
            transition={
              phase === "picking"
                ? { duration: 0.8, repeat: 1 }
                : phase === "flipping"
                ? { duration: 0.4 }
                : {}
            }
            onClick={phase === "idle" ? pickCard : undefined}
          >
            <AnimatePresence mode="wait">
              {!flipped ? (
                /* Card Back */
                <motion.div
                  key="back"
                  className="absolute inset-0 rounded-2xl overflow-hidden border border-white/20 shadow-2xl shadow-purple-900/50 flex flex-col items-center justify-center gap-3"
                  style={{
                    background: "linear-gradient(135deg, #1a0a2e 0%, #0d0820 50%, #1a0a2e 100%)",
                  }}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Decorative border */}
                  <div className="absolute inset-2 rounded-xl border border-brand-pink/30" />
                  <div className="absolute inset-3 rounded-lg border border-purple-500/20" />

                  {/* Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute text-brand-pink text-xs"
                        style={{
                          top: `${15 + i * 15}%`,
                          left: `${10 + (i % 3) * 30}%`,
                          opacity: 0.5,
                        }}
                      >
                        ✦
                      </div>
                    ))}
                  </div>

                  <span className="text-5xl">{selectedSymbol}</span>
                  <p className="text-brand-pink text-xs font-bold tracking-widest uppercase">Yozara</p>
                  <p className="text-white/30 text-[10px] tracking-widest">ようこそ</p>

                  {phase === "idle" && (
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute bottom-6 text-white/40 text-[10px] font-medium tracking-wider"
                    >
                      TAP TO DRAW
                    </motion.div>
                  )}

                  {phase === "picking" && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }}
                      className="absolute bottom-6"
                    >
                      <Sparkles size={16} className="text-brand-pink" />
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                /* Card Front — Revealed */
                <motion.div
                  key="front"
                  className="absolute inset-0 rounded-2xl overflow-hidden border border-brand-pink/40 shadow-2xl shadow-brand-pink/20"
                  initial={{ opacity: 0, rotateY: -90 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {result ? (
                    <>
                      <Image src={img} alt={title} fill className="object-cover" sizes="180px" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      {/* Type badge */}
                      <div className={`absolute top-3 right-3 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${resultType === "ANIME" ? "bg-brand-pink text-white" : "bg-purple-600 text-white"}`}>
                        {resultType}
                      </div>
                      {/* Score */}
                      {result.averageScore && (
                        <div className="absolute top-3 left-3 bg-black/60 text-yellow-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          ⭐ {(result.averageScore / 10).toFixed(1)}
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-white text-xs font-extrabold line-clamp-2 mb-1">{title}</p>
                        {result.genres && (
                          <p className="text-white/50 text-[9px]">{result.genres.slice(0, 2).join(" • ")}</p>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full bg-[#1a0a2e]">
                      <p className="text-white/40 text-xs">No result</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Action buttons after reveal */}
        <AnimatePresence>
          {phase === "revealed" && result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex gap-3 flex-wrap justify-center"
            >
              <Link
                href={`/${resultType.toLowerCase()}/${result.id}`}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-pink text-white font-bold text-sm hover:bg-brand-pink/80 transition-all shadow-lg shadow-brand-pink/30"
              >
                <Sparkles size={15} /> View {resultType === "ANIME" ? "Anime" : "Manga"}
              </Link>
              <button
                onClick={reset}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 border border-white/20 text-white font-bold text-sm hover:bg-white/20 transition-all"
              >
                <RefreshCw size={15} /> Draw Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
