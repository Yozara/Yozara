"use client";

import { useState, useEffect } from "react";
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
  const [phase, setPhase] = useState<"idle" | "shuffling" | "loading" | "ready" | "flipping" | "revealed">("idle");
  const [result, setResult] = useState<MediaItem | null>(null);
  const [resultType, setResultType] = useState<"ANIME" | "MANGA">("ANIME");
  const [flipped, setFlipped] = useState(false);
  const [shuffleStep, setShuffleStep] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);

  const img = result?.coverImage?.extraLarge || result?.coverImage?.large || "/hero-image.jpg";
  const title = result?.title?.english || result?.title?.romaji || "???";

  const pickCard = async () => {
    if (phase !== "idle") return;

    // Start shuffling animation
    setPhase("shuffling");
    setFlipped(false);
    setResult(null);
    setImgLoaded(false);

    // Animate shuffle steps
    let step = 0;
    const shuffleInterval = setInterval(() => {
      step++;
      setShuffleStep(step);
      if (step >= 6) {
        clearInterval(shuffleInterval);
        setPhase("loading");
      }
    }, 200);

    // Fetch in parallel while shuffling
    try {
      const page = Math.floor(Math.random() * 5) + 1;
      const type: "ANIME" | "MANGA" = Math.random() > 0.5 ? "ANIME" : "MANGA";
      setResultType(type);
      const data = await searchMedia(type, { sort: "POPULARITY_DESC", page });
      const items: MediaItem[] = data?.Page?.media || [];
      const pick = items[Math.floor(Math.random() * items.length)];
      setResult(pick || null);
    } catch {
      setPhase("idle");
    }
  };

  // Once image is loaded and we're in loading phase → go ready
useEffect(() => {
    if (imgLoaded && (phase === "loading" || phase === "shuffling")) {
      const timer = setTimeout(() => {
        setPhase("flipping");
        setTimeout(() => {
          setFlipped(true);
          setPhase("revealed");
        }, 600);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [imgLoaded, phase]);
  // If result set but phase still loading/shuffling, preload image
  useEffect(() => {
    if (!result) return;
    const src = result.coverImage?.extraLarge || result.coverImage?.large;
    if (!src) {
      setImgLoaded(true);
      return;
    }
    const image = new window.Image();
    image.src = src;
    image.onload = () => setImgLoaded(true);
    image.onerror = () => setImgLoaded(true);
  }, [result]);

  const flipCard = () => {
    if (phase !== "ready") return;
    setPhase("flipping");
    setTimeout(() => {
      setFlipped(true);
      setPhase("revealed");
    }, 600);
  };

  const reset = () => {
    setPhase("idle");
    setFlipped(false);
    setResult(null);
    setImgLoaded(false);
    setShuffleStep(0);
  };

  const getShuffleTransform = (cardIndex: number) => {
    const offsets = [
      { x: -60, rotate: -15 },
      { x: 60, rotate: 15 },
      { x: -30, rotate: -8 },
      { x: 30, rotate: 8 },
      { x: -15, rotate: -4 },
      { x: 0, rotate: 0 },
    ];
    const step = (shuffleStep + cardIndex) % offsets.length;
    return offsets[step];
  };

  return (
    <section className="mb-14 px-4 sm:px-6 relative overflow-hidden">
      {/* Background stars */}
      <div className="absolute inset-0 pointer-events-none">
        {STARS.map((s) => (
          <motion.div
            key={s.id}
            className="absolute rounded-full bg-yellow-200"
            style={{
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
            }}
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
              opacity: 0.3,
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
        {/* Card area */}
        <div className="relative flex items-center justify-center w-full h-[320px]">

          {/* Deck stack */}
          {(phase === "idle" || phase === "shuffling") && (
            <>
              {[3, 2, 1].map((i) => {
                const shuffle = phase === "shuffling" ? getShuffleTransform(i) : { x: 0, rotate: (i - 2) * 4 };
                return (
                  <motion.div
                    key={i}
                    className="absolute rounded-2xl border border-yellow-500/30 shadow-lg"
                    style={{
                      width: 180,
                      height: 260,
                      background: "linear-gradient(135deg, #7c5a00 0%, #f5c518 40%, #c8960c 60%, #7c5a00 100%)",
                      zIndex: i,
                    }}
                    animate={{
                      x: shuffle.x,
                      rotate: shuffle.rotate,
                      y: i * 3,
                    }}
                    transition={{ duration: 0.15, ease: "easeInOut" }}
                  />
                );
              })}
            </>
          )}

          {/* Main card */}
          <motion.div
            className="relative"
            style={{
              width: 180,
              height: 260,
              zIndex: 10,
              cursor: phase === "idle" ? "pointer" : "default",
            }}
            animate={
              phase === "shuffling"
                ? { x: [0, 40, -40, 20, -20, 0], rotate: [0, 10, -10, 5, -5, 0] }
                : phase === "flipping"
                ? { rotateY: 90 }
                : {}
            }
            transition={
              phase === "shuffling"
                ? { duration: 1.2, ease: "easeInOut" }
                : phase === "flipping"
                ? { duration: 0.3 }
                : {}
            }
            onClick={phase === "idle" ? pickCard : undefined}
          >
            <AnimatePresence mode="wait">
              {!flipped ? (
                <motion.div
                  key="back"
                  className="absolute inset-0 rounded-2xl overflow-hidden border-2 border-yellow-400/60 shadow-2xl flex flex-col items-center justify-center gap-3"
                  style={{
  background: "linear-gradient(135deg, #7c5a00 0%, #f5c518 40%, #c8960c 60%, #7c5a00 100%)",
  boxShadow: (phase === "loading" || phase === "ready" || phase === "flipping" || phase === "revealed") ? "0 0 30px 10px rgba(245, 197, 24, 0.5), 0 0 60px 20px rgba(245, 197, 24, 0.2)" : "0 8px 32px rgba(0,0,0,0.4)",
}}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  animate={(phase === "loading" || phase === "ready" || phase === "flipping") ? { boxShadow: ["0 0 20px 5px rgba(245,197,24,0.3)", "0 0 50px 20px rgba(245,197,24,0.7)", "0 0 20px 5px rgba(245,197,24,0.3)"] } : {}}
transition={(phase === "loading" || phase === "ready" || phase === "flipping") ? { repeat: Infinity, duration: 1.5 } : {}}
                >
                  <div className="absolute inset-2 rounded-xl border border-yellow-200/60" />
                  <div className="absolute inset-3 rounded-lg border border-yellow-100/30" />

                  {/* Star pattern */}
                  <div className="absolute inset-0">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute text-yellow-900/30 text-xs"
                        style={{ top: `${10 + i * 12}%`, left: `${8 + (i % 3) * 35}%` }}
                      >
                        ✦
                      </div>
                    ))}
                  </div>

                  {phase !== "shuffling" && phase !== "loading" && (
                    <>
                      <span className="text-5xl">🃏</span>
                      <p className="text-black text-xs font-extrabold tracking-widest uppercase">Yozara</p>
                      <p className="text-yellow-900/70 text-[10px] tracking-widest">ようこそ</p>
                    </>
                  )}

                  {phase === "idle" && (
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute bottom-6 text-yellow-900/70 text-[10px] font-bold tracking-wider"
                    >
                      TAP TO SHUFFLE
                    </motion.div>
                  )}

                  {phase === "shuffling" && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
                      className="absolute bottom-6"
                    >
                      <Sparkles size={16} className="text-yellow-900" />
                    </motion.div>
                  )}

                
                  {phase === "ready" && (
                    <motion.div
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="absolute bottom-6 text-yellow-900 text-[10px] font-extrabold tracking-wider"
                    >
                      ✨ TAP TO REVEAL
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="front"
                  className="absolute inset-0 rounded-2xl overflow-hidden border-2 border-yellow-400/80 shadow-2xl"
                  style={{
                    boxShadow: "0 0 40px 15px rgba(245, 197, 24, 0.4), 0 0 80px 30px rgba(245, 197, 24, 0.15)",
                  }}
                  initial={{ opacity: 0, rotateY: -90 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {result ? (
                    <>
                      <Image src={img} alt={title} fill className="object-cover" sizes="180px" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      <div className={`absolute top-3 right-3 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${resultType === "ANIME" ? "bg-brand-pink text-white" : "bg-purple-600 text-white"}`}>
                        {resultType}
                      </div>
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

        {/* Status text */}
        {phase === "ready" && !flipped && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-yellow-400 text-sm font-bold text-center"
          >
            ✨ Your destiny is ready — tap the card to reveal!
          </motion.p>
        )}

        {/* Action buttons */}
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
