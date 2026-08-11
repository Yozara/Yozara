"use client";

import { useState, useRef, useEffect } from "react";
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

const SEGMENTS = [
  { label: "Action", color: "#ef4444", emoji: "⚔️" },
  { label: "Romance", color: "#ec4899", emoji: "💕" },
  { label: "Comedy", color: "#f59e0b", emoji: "😂" },
  { label: "Horror", color: "#7c3aed", emoji: "👻" },
  { label: "Fantasy", color: "#8b5cf6", emoji: "🧙" },
  { label: "Sci-Fi", color: "#06b6d4", emoji: "🚀" },
  { label: "Mystery", color: "#3b82f6", emoji: "🔍" },
  { label: "Sports", color: "#10b981", emoji: "⚽" },
];

const TOTAL = SEGMENTS.length;
const ANGLE = 360 / TOTAL;

// Confetti particle
function Confetti({ active }: { active: boolean }) {
  const particles = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: ["#FF85BB", "#f5c518", "#a855f7", "#06b6d4", "#10b981", "#ef4444"][i % 6],
    delay: Math.random() * 0.5,
    duration: Math.random() * 1.5 + 1,
    size: Math.random() * 8 + 4,
  }));

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: `${p.x}%`,
            top: -20,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
          initial={{ y: -20, rotate: 0, opacity: 1 }}
          animate={{ y: "110vh", rotate: 720, opacity: 0 }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}

export default function WheelOfFate() {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<MediaItem | null>(null);
  const [resultType, setResultType] = useState<"ANIME" | "MANGA">("ANIME");
  const [landed, setLanded] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [phase, setPhase] = useState<"idle" | "spinning" | "revealed">("idle");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw wheel
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const size = canvas.width;
    const center = size / 2;
    const radius = center - 4;

    ctx.clearRect(0, 0, size, size);

    SEGMENTS.forEach((seg, i) => {
      const startAngle = (i * ANGLE - 90) * (Math.PI / 180);
      const endAngle = ((i + 1) * ANGLE - 90) * (Math.PI / 180);

      // Segment
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();
      ctx.strokeStyle = "#0B0F19";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate((i * ANGLE - 90 + ANGLE / 2) * (Math.PI / 180));
      ctx.textAlign = "right";
      ctx.fillStyle = "#fff";
      ctx.font = "bold 13px sans-serif";
      ctx.fillText(`${seg.emoji} ${seg.label}`, radius - 10, 5);
      ctx.restore();
    });

    // Center circle
    ctx.beginPath();
    ctx.arc(center, center, 18, 0, 2 * Math.PI);
    ctx.fillStyle = "#0B0F19";
    ctx.fill();
    ctx.strokeStyle = "#f5c518";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Center dot
    ctx.beginPath();
    ctx.arc(center, center, 6, 0, 2 * Math.PI);
    ctx.fillStyle = "#f5c518";
    ctx.fill();
  }, []);

  const spin = async () => {
    if (spinning || phase !== "idle") return;
    setSpinning(true);
    setPhase("spinning");
    setShowResult(false);
    setResult(null);
    setLanded(null);
    setConfetti(false);

    // Random spins + land on random segment
    const extraSpins = 5 + Math.floor(Math.random() * 5);
    const targetSegment = Math.floor(Math.random() * TOTAL);
    const targetAngle = extraSpins * 360 + (TOTAL - targetSegment) * ANGLE + ANGLE / 2;
    const newRotation = rotation + targetAngle;
    setRotation(newRotation);

    // Fetch while spinning
    const type: "ANIME" | "MANGA" = Math.random() > 0.5 ? "ANIME" : "MANGA";
    setResultType(type);
    const genre = SEGMENTS[targetSegment].label;

    try {
      const page = Math.floor(Math.random() * 3) + 1;
      const data = await getTrendingMedia(type, page);
      const items: MediaItem[] = (data?.media || []).filter((m: any) =>
        m.genres?.includes(genre)
      );
      const allItems: MediaItem[] = data?.media || [];
      const pick = (items.length > 0 ? items : allItems)[
        Math.floor(Math.random() * Math.min((items.length > 0 ? items : allItems).length, 10))
      ];
      setResult(pick || null);
    } catch {}

    // After spin completes (3s)
    setTimeout(() => {
      setLanded(SEGMENTS[targetSegment].label);
      setSpinning(false);
      setPhase("revealed");
      setConfetti(true);
      setTimeout(() => {
        setShowResult(true);
        setConfetti(false);
      }, 800);
    }, 3000);
  };

  const reset = () => {
    setPhase("idle");
    setShowResult(false);
    setResult(null);
    setLanded(null);
    setConfetti(false);
  };

  const img = result?.coverImage?.extraLarge || result?.coverImage?.large || "/hero-image.jpg";
  const title = result?.title?.english || result?.title?.romaji || "???";

  return (
    <section className="mb-14 px-4 sm:px-6 relative">
      <Confetti active={confetti} />

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1 h-7 bg-brand-pink rounded-full" />
        <h2 className="text-2xl font-extrabold text-white">🎡 Wheel of Fate</h2>
        <span className="text-white/40 text-sm">Spin your destiny</span>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
        {/* Wheel */}
        <div className="relative flex items-center justify-center">
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-20">
            <div
              className="w-0 h-0"
              style={{
                borderLeft: "12px solid transparent",
                borderRight: "12px solid transparent",
                borderTop: "24px solid #f5c518",
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
              }}
            />
          </div>

          {/* Wheel canvas */}
          <motion.div
            animate={{ rotate: rotation }}
            transition={spinning ? { duration: 3, ease: [0.17, 0.67, 0.21, 0.99] } : { duration: 0 }}
            style={{ willChange: "transform" }}
          >
            <canvas
              ref={canvasRef}
              width={320}
              height={320}
              className="rounded-full shadow-2xl"
              style={{
                boxShadow: showResult
                  ? "0 0 40px 15px rgba(245,197,24,0.5), 0 0 80px 30px rgba(245,197,24,0.2)"
                  : "0 8px 32px rgba(0,0,0,0.5)",
              }}
            />
          </motion.div>

          {/* Glow ring when revealed */}
          {showResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                boxShadow: "0 0 60px 20px rgba(245,197,24,0.4)",
                borderRadius: "50%",
              }}
            />
          )}
        </div>

        {/* Right side */}
        <div className="flex flex-col items-center gap-6 min-w-[200px]">
          {phase === "idle" && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={spin}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-pink to-purple-500 text-white font-extrabold text-lg shadow-2xl shadow-brand-pink/30 hover:shadow-brand-pink/50 transition-all"
            >
              🎡 Spin the Wheel!
            </motion.button>
          )}

          {phase === "spinning" && (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="text-white/60 text-sm font-medium"
            >
              ✨ The wheel decides your fate...
            </motion.div>
          )}

          {phase === "revealed" && landed && !showResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <p className="text-yellow-400 font-extrabold text-xl">🎯 {landed}!</p>
              <p className="text-white/40 text-sm mt-1">Finding your destiny...</p>
            </motion.div>
          )}

          {/* Result card */}
          <AnimatePresence>
            {showResult && result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="flex flex-col items-center gap-4"
              >
                <p className="text-yellow-400 font-extrabold text-sm">
                  ✨ Your {landed} destiny...
                </p>

                {/* Card with golden glow */}
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 20px 5px rgba(245,197,24,0.3)",
                      "0 0 50px 20px rgba(245,197,24,0.7)",
                      "0 0 20px 5px rgba(245,197,24,0.3)",
                    ],
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="relative w-44 h-64 rounded-2xl overflow-hidden border-2 border-yellow-400/80"
                >
                  <Image src={img} alt={title} fill className="object-cover" sizes="176px" />
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
                    <p className="text-white text-xs font-extrabold line-clamp-2">{title}</p>
                    {result.genres && (
                      <p className="text-white/50 text-[9px] mt-1">{result.genres.slice(0, 2).join(" • ")}</p>
                    )}
                  </div>
                </motion.div>

                <div className="flex gap-3">
                  <Link
                    href={`/${resultType.toLowerCase()}/${result.id}`}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-yellow-500 text-black font-extrabold text-sm hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/30"
                  >
                    <Sparkles size={14} /> View
                  </Link>
                  <button
                    onClick={reset}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 text-white font-bold text-sm hover:bg-white/20 transition-all"
                  >
                    <RefreshCw size={14} /> Spin Again
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
