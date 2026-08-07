"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getTrendingMedia } from "@/utils/anilist/client";
import { Sparkles, RefreshCw } from "lucide-react";

type MediaItem = {
  id: number;
  title?: { romaji?: string; english?: string };
  coverImage?: { large?: string; extraLarge?: string };
  genres?: string[];
  averageScore?: number;
};

const STARS = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  size: Math.random() * 3 + 1,
  delay: Math.random() * 3,
  duration: Math.random() * 2 + 2,
}));

const MOONS = ["🌙", "🌟", "⭐", "✨", "🌙", "⭐", "🌟", "✨"];

export default function FortuneCard() {
  const [phase, setPhase] = useState<"idle" | "shuffling" | "revealed">("idle");
  const [result, setResult] = useState<MediaItem | null>(null);
  const [resultType, setResultType] = useState<"ANIME" | "MANGA">("ANIME");
  const [shuffleStep, setShuffleStep] = useState(0);

  const pickCard = async () => {
    if (phase !== "idle") return;
    setPhase("shuffling");
    setResult(null);
    setShuffleStep(0);

    // Run shuffle animation for 1.5s
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setShuffleStep(step % 6);
      if (step >= 8) clearInterval(interval);
    }, 180);

    // Fetch data
    try {
      const type: "ANIME" | "MANGA" = Math.random() > 0.5 ? "ANIME" : "MANGA";
      const page = Math.floor(Math.random() * 5) + 1;
      setResultType(type);
      const data = await getTrendingMedia(type, page);
      const items: MediaItem[] = data?.media || [];
      const pick = items[Math.floor(Math.random() * items.length)] || null;

      // Wait for shuffle to finish (at least 1.5s total)
      setTimeout(() => {
        clearInterval(interval);
        setResult(pick);
        setTimeout(() => {
          setPhase("revealed");
        }, 800);
      }, 1500);
    } catch {
      clearInterval(interval);
      setPhase("idle");
    }
  };

  const reset = () => {
    setPhase("idle");
    setResult(null);
    setShuffleStep(0);
  };

  const getShuffleTransform = (i: number) => {
    const offsets = [
      { x: -50, rotate: -12 },
      { x: 50, rotate: 12 },
      { x: -25, rotate: -6 },
      { x: 25, rotate: 6 },
      { x: -10, rotate: -3 },
      { x: 0, rotate: 0 },
    ];
    return offsets[(shuffleStep + i) % offsets.length];
  };

  const img = result?.coverImage?.extraLarge || result?.coverImage?.large || "/hero-image.jpg";
  const title = result?.title?.english || result?.title?.romaji || "???";
  const isGlowing = phase === "revealed";

  return (
    <section className="mb-14 px-4 sm:px-6 relative overflow-hidden">
      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none">
        {STARS.map((s) => (
          <motion.div
            key={s.id}
            className="absolute rounded-full bg-yellow-200"
            style={{ top: s.top, left: s.left, width: s.size, height: s.size }}
            animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }}
            transition={{ repeat: Infinity, duration: s.duration, delay: s.delay }}
          />
        ))}
        {MOONS.map((m, i) => (
          <motion.div
            key={i}
            className="absolute text-lg select-none"
            style={{
              top: `${10 + i * 11}%`,
              left: i % 2 === 0 ? `${2 + i * 2}%` : `${85 + (i % 3) * 4}%`,
            }}
            animate={{ y: [-4, 4, -4], opacity: [0.2, 0.5, 0.2] }}
            transition={{ repeat: Infinity, duration: 3 + i * 0.4, delay: i * 0.3 }}
          >
            {m}
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-1 h-7 bg-yellow-400 rounded-full" />
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
          🃏 Fortune Card
        </h2>
        <span className="text-white/40 text-sm">Draw your fate</span>
      </div>

      <div className="flex flex-col items-center gap-6 relative z-10">
        <div className="relative flex items-center justify-center w-full h-[320px]">

          {/* Deck stack cards */}
          {phase !== "revealed" && (
            <>
              {[3, 2, 1].map((i) => {
                const t = phase === "shuffling" ? getShuffleTransform(i) : { x: (i - 2) * 6, rotate: (i - 2) * 4 };
                return (
                  <motion.div
                    key={i}
                    className="absolute rounded-2xl border border-yellow-500/40"
                    style={{
                      width: 180,
                      height: 260,
                      background: "linear-gradient(135deg, #7c5a00 0%, #f5c518 40%, #c8960c 60%, #7c5a00 100%)",
                      zIndex: i,
                    }}
                    animate={{ x: t.x, rotate: t.rotate, y: i * 3 }}
                    transition={{ duration: 0.15 }}
                  />
                );
              })}
            </>
          )}

          {/* Main card */}
          <motion.div
            style={{ width: 180, height: 260, zIndex: 10, cursor: phase === "idle" ? "pointer" : "default" }}
            animate={phase === "shuffling" ? { x: [0, 35, -35, 18, -18, 0], rotate: [0, 8, -8, 4, -4, 0] } : {}}
            transition={phase === "shuffling" ? { duration: 1.1, repeat: Infinity, ease: "easeInOut" } : {}}
            onClick={phase === "idle" ? pickCard : undefined}
          >
            <AnimatePresence mode="wait">
              {phase !== "revealed" || !result ? (
                <motion.div
                  key="back"
                  className="absolute inset-0 rounded-2xl overflow-hidden border-2 border-yellow-400/60 flex flex-col items-center justify-center gap-3"
                  style={{
                    background: "linear-gradient(135deg, #7c5a00 0%, #f5c518 40%, #c8960c 60%, #7c5a00 100%)",
                    boxShadow: isGlowing ? "0 0 40px 15px rgba(245,197,24,0.5)" : "0 8px 32px rgba(0,0,0,0.4)",
                  }}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, rotateY: 90 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="absolute inset-2 rounded-xl border border-yellow-200/60" />
                  <div className="absolute inset-3 rounded-lg border border-yellow-100/30" />
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="absolute text-yellow-900/30 text-xs"
                      style={{ top: `${10 + i * 12}%`, left: `${8 + (i % 3) * 35}%` }}>✦</div>
                  ))}

                  {phase === "idle" && (
                    <>
                      <span className="text-5xl">🃏</span>
                      <p className="text-black text-xs font-extrabold tracking-widest uppercase">Yozara</p>
                      <p className="text-yellow-900/70 text-[10px] tracking-widest">ようこそ</p>
                      <motion.p
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute bottom-6 text-yellow-900/70 text-[10px] font-bold tracking-wider"
                      >
                        TAP TO SHUFFLE
                      </motion.p>
                    </>
                  )}

                  {phase === "shuffling" && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
                    >
                      <Sparkles size={20} className="text-yellow-900" />
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="front"
                  className="absolute inset-0 rounded-2xl overflow-hidden border-2 border-yellow-400/80"
                  style={{ boxShadow: "0 0 40px 15px rgba(245,197,24,0.4), 0 0 80px 30px rgba(245,197,24,0.15)" }}
                  initial={{ opacity: 0, rotateY: -90 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Image src={img} alt={title} fill className="object-cover" sizes="180px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className={`absolute top-3 right-3 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${resultType === "ANIME" ? "bg-brand-pink text-white" : "bg-purple-600 text-white"}`}>
                    {resultType}
                  </div>
                  {result?.averageScore && (
                    <div className="absolute top-3 left-3 bg-black/60 text-yellow-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      ⭐ {(result.averageScore / 10).toFixed(1)}
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white text-xs font-extrabold line-clamp-2 mb-1">{title}</p>
                    {result?.genres && (
                      <p className="text-white/50 text-[9px]">{result.genres.slice(0, 2).join(" • ")}</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Buttons */}
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
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-yellow-500 text-black font-extrabold text-sm hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/30"
              >
                <Sparkles size={15} /> View {resultType === "ANIME" ? "Anime" : "Manga"}
              </Link>
              <button
                onClick={reset}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 border border-yellow-500/30 text-white font-bold text-sm hover:bg-white/20 transition-all"
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
