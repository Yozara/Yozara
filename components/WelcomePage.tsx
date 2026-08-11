"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { searchMedia } from "@/utils/anilist/client";

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

const MOODS = [
  { label: "Happy & Hyped ⚡", emoji: "😄", pikoImage: "/piko-happy.png", reaction: "Oh you're feeling hyped today?! Let's find something that'll get your blood pumping! 🔥", genres: ["Action", "Sports"] },
  { label: "Chill & Relaxed 🍵", emoji: "😌", pikoImage: "/piko-relaxed.png", reaction: "Ahh a chill day I see~ Let me find you something cozy to vibe with 🌸", genres: ["Slice of Life", "Comedy"] },
  { label: "Emotional 😭", emoji: "😢", pikoImage: "/piko-sad.png", reaction: "Feeling emotional huh? I got you... prepare the tissues though 💕", genres: ["Romance", "Drama"] },
  { label: "Dark & Edgy 🌑", emoji: "😈", pikoImage: "/piko-nervous.png", reaction: "Ooh dark mode activated! Let's go somewhere deep and twisted 👁️", genres: ["Psychological", "Horror"] },
  { label: "Curious 🤔", emoji: "🧐", pikoImage: "/piko-thinking.png", reaction: "Big brain mode? Let's find something that'll blow your mind 🧠", genres: ["Mystery", "Sci-Fi"] },
  { label: "Romantic 💕", emoji: "🥰", pikoImage: "/piko-love.png", reaction: "Ahhh someone's feeling lovey dovey~ lemme find you something heartwarming 💖", genres: ["Romance", "Slice of Life"] },
];

const LENGTHS = [
  { label: "Short & Sweet", sublabel: "1–12 episodes", emoji: "⚡" },
  { label: "Just Right", sublabel: "13–50 episodes", emoji: "✨" },
  { label: "Long Haul", sublabel: "50+ episodes", emoji: "🔥" },
  { label: "Ongoing", sublabel: "Currently airing", emoji: "📡" },
];

type Phase = "intro" | "mood" | "piko-react" | "length" | "loading" | "result";

export default function WelcomePage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("intro");
  const [selectedMood, setSelectedMood] = useState<typeof MOODS[0] | null>(null);
  const [result, setResult] = useState<MediaItem | null>(null);
  const [resultType, setResultType] = useState<"ANIME" | "MANGA">("ANIME");
  const [recentItems, setRecentItems] = useState<{ id: number; type: string; title: string; image: string }[]>([]);
  const [pikoTextIndex, setPikoTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("yozara_recent") || "[]");
      setRecentItems(stored.slice(0, 4));
    } catch {}
  }, []);

  // Typewriter effect for piko reaction
  useEffect(() => {
    if (phase !== "piko-react" || !selectedMood) return;
    const text = selectedMood.reaction;
    setDisplayedText("");
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedText(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setTimeout(() => setPhase("length"), 1200);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [phase, selectedMood]);

  const chooseMood = (mood: typeof MOODS[0]) => {
    setSelectedMood(mood);
    setPhase("piko-react");
  };

  const chooseLength = async (length: typeof LENGTHS[0]) => {
    setPhase("loading");
    const type: "ANIME" | "MANGA" = Math.random() > 0.4 ? "ANIME" : "MANGA";
    setResultType(type);
    try {
      const genre = selectedMood?.genres[Math.floor(Math.random() * (selectedMood?.genres.length || 1))] || "Action";
      const page = Math.floor(Math.random() * 3) + 1;
      const data = await searchMedia(type, {
        genre: [genre],
        sort: "POPULARITY_DESC",
        page,
        status: length.sublabel === "Currently airing" ? "RELEASING" : undefined,
      });
      const items: MediaItem[] = data?.Page?.media || [];
      const pick = items[Math.floor(Math.random() * Math.min(items.length, 10))];
      setResult(pick || null);
    } catch {}
    setPhase("result");
  };

  const goToResult = () => {
    if (result) router.push(`/${resultType.toLowerCase()}/${result.id}`);
  };

  const skip = () => router.push("/");

  const img = result?.coverImage?.extraLarge || result?.coverImage?.large || "/hero-image.jpg";
  const title = result?.title?.english || result?.title?.romaji || "???";

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-brand-pink/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-pink/5 rounded-full blur-3xl pointer-events-none" />

      {/* Skip button */}
      <button onClick={skip} className="absolute top-6 right-6 text-white/30 hover:text-white/60 text-sm transition-colors z-10">
        Skip →
      </button>

      <div className="relative z-10 w-full max-w-lg px-4">
        <AnimatePresence mode="wait">

          {/* ── INTRO ── */}
          {phase === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="text-center"
            >
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="flex justify-center mb-6"
              >
                <Image src="/piko-face.png" alt="Piko" width={120} height={120} style={{ imageRendering: "pixelated" }} />
              </motion.div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
                Hey there! I'm <span className="text-brand-pink">Piko</span> 🐾
              </h1>
              <p className="text-white/50 text-sm mb-8">Your personal anime & manga guide. Let me help you find something amazing!</p>

              <div className="flex flex-col gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setPhase("mood")}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-pink to-purple-500 text-white font-extrabold text-lg shadow-2xl shadow-brand-pink/30"
                >
                  ✨ I want something new!
                </motion.button>

                {recentItems.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={skip}
                    className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all"
                  >
                    📖 Continue with the previous lore
                  </motion.button>
                )}

                {/* Recent thumbnails */}
                {recentItems.length > 0 && (
                  <div className="flex gap-2 justify-center mt-2">
                    {recentItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => router.push(`/${item.type}/${item.id}`)}
                        className="relative w-12 h-16 rounded-lg overflow-hidden border border-white/10 hover:border-brand-pink/50 transition-colors cursor-pointer"
                      >
                        <Image src={item.image} alt={item.title} fill className="object-cover" sizes="48px" />
                      </div>
                    ))}
                  </div>
                )}

                {recentItems.length === 0 && (
                  <button onClick={skip} className="text-white/30 text-sm mt-2 hover:text-white/50 transition-colors">
                    Skip for now →
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* ── MOOD ── */}
          {phase === "mood" && (
            <motion.div
              key="mood"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
            >
              <div className="flex justify-center mb-4">
                <motion.div
                  animate={{ rotate: [-5, 5, -5] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <Image src="/piko-face.png" alt="Piko" width={80} height={80} style={{ imageRendering: "pixelated" }} />
                </motion.div>
              </div>
              <h2 className="text-2xl font-extrabold text-white text-center mb-1">How's your mood today? 🎭</h2>
              <p className="text-white/40 text-xs text-center mb-6">Piko will find the perfect match for you!</p>

              <div className="grid grid-cols-2 gap-3">
                {MOODS.map((mood) => (
                  <motion.button
                    key={mood.label}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => chooseMood(mood)}
                    className="bg-white/5 hover:bg-brand-pink/20 border border-white/10 hover:border-brand-pink/40 text-white rounded-2xl p-4 text-left transition-all"
                  >
                    <span className="text-3xl block mb-2">{mood.emoji}</span>
                    <p className="font-bold text-sm">{mood.label}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── PIKO REACT ── */}
          {phase === "piko-react" && selectedMood && (
            <motion.div
              key="piko-react"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <motion.div
                animate={{ y: [0, -16, 0], rotate: [0, -8, 8, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="flex justify-center mb-6"
              >
                <Image src={selectedMood.pikoImage} alt="Piko" width={140} height={140} style={{ imageRendering: "pixelated" }} />
              </motion.div>

              {/* Speech bubble */}
              <div className="relative bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold text-base text-left">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#0F1428] border-t border-l border-white/10 rotate-45" />
                {displayedText}
                <span className="animate-pulse">|</span>
              </div>
            </motion.div>
          )}

          {/* ── LENGTH ── */}
          {phase === "length" && (
            <motion.div
              key="length"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
            >
              <div className="flex justify-center mb-4">
                <Image src="/piko-face.png" alt="Piko" width={80} height={80} style={{ imageRendering: "pixelated" }} />
              </div>
              <h2 className="text-2xl font-extrabold text-white text-center mb-1">But wait... ⏱️</h2>
              <p className="text-white/40 text-sm text-center mb-6">How long would you want your anime or manga to be?</p>

              <div className="grid grid-cols-2 gap-3">
                {LENGTHS.map((length) => (
                  <motion.button
                    key={length.label}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => chooseLength(length)}
                    className="bg-white/5 hover:bg-brand-pink/20 border border-white/10 hover:border-brand-pink/40 text-white rounded-2xl p-4 text-left transition-all"
                  >
                    <span className="text-3xl block mb-2">{length.emoji}</span>
                    <p className="font-bold text-sm">{length.label}</p>
                    <p className="text-white/40 text-xs">{length.sublabel}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── LOADING ── */}
          {phase === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-10"
            >
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ repeat: Infinity, duration: 0.6 }}
                className="flex justify-center mb-6"
              >
                <Image src="/piko-face.png" alt="Piko" width={140} height={140} style={{ imageRendering: "pixelated" }} />
              </motion.div>
              <p className="text-white font-bold mb-2">Piko is sniffing out the perfect pick...</p>
              <div className="flex justify-center gap-2 mt-3">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-2.5 h-2.5 rounded-full bg-brand-pink inline-block"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* ── RESULT ── */}
          {phase === "result" && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="flex justify-center mb-3">
                <Image src="/piko-face.png" alt="Piko" width={80} height={80} style={{ imageRendering: "pixelated" }} />
              </div>
              <p className="text-brand-pink font-extrabold text-sm mb-1">✨ {selectedMood?.reaction.split("!")[0]}!</p>
              <p className="text-white/40 text-xs mb-5">Here's your destiny for today~</p>

              {/* Result card with glow */}
              <motion.div
                animate={{ boxShadow: ["0 0 20px 5px rgba(255,133,187,0.2)", "0 0 50px 20px rgba(255,133,187,0.6)", "0 0 20px 5px rgba(255,133,187,0.2)"] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="relative w-44 h-64 mx-auto rounded-2xl overflow-hidden border-2 border-brand-pink/70 mb-6 cursor-pointer"
                onClick={goToResult}
              >
                <Image src={img} alt={title} fill className="object-cover" sizes="176px" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
                <div className={`absolute top-3 right-3 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${resultType === "ANIME" ? "bg-brand-pink text-white" : "bg-purple-600 text-white"}`}>
                  {resultType}
                </div>
                {result.averageScore && (
                  <div className="absolute top-3 left-3 bg-black/60 text-yellow-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    ⭐ {(result.averageScore / 10).toFixed(1)}
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-sm font-extrabold line-clamp-2">{title}</p>
                  {result.genres && <p className="text-white/50 text-[10px] mt-1">{result.genres.slice(0, 2).join(" • ")}</p>}
                </div>
              </motion.div>

              <div className="flex gap-3 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={goToResult}
                  className="px-8 py-3 rounded-full bg-brand-pink text-white font-extrabold text-base hover:bg-brand-pink/80 transition-all shadow-xl shadow-brand-pink/30"
                >
                  🐾 Let's go!
                </motion.button>
                <button
                  onClick={() => { setPhase("mood"); setSelectedMood(null); setResult(null); }}
                  className="px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white font-bold text-sm hover:bg-white/20 transition-all"
                >
                  Try again
                </button>
              </div>

              <button onClick={skip} className="mt-4 text-white/30 text-xs hover:text-white/50 transition-colors">
                Go to homepage instead →
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
