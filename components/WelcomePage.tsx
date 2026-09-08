"use client";
import { useEffect, useState } from "react";
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
  { label: "Happy & Hyped ⚡", emoji: "😄", pikoImage: "/piko-happy.png", reaction: "Oh you're feeling hyped today?! Let's find something that'll get your blood pumping! 🔥", genres: ["Action", "Sports"], color: "#ef4444", bg: "from-red-500/20 to-orange-500/10" },
  { label: "Chill & Relaxed 🍵", emoji: "😌", pikoImage: "/piko-relaxed.png", reaction: "Ahh a chill day I see~ Let me find you something cozy to vibe with 🌸", genres: ["Slice of Life", "Comedy"], color: "#10b981", bg: "from-emerald-500/20 to-teal-500/10" },
  { label: "Emotional 😭", emoji: "😢", pikoImage: "/piko-sad.png", reaction: "Feeling emotional huh? I got you... prepare the tissues though 💕", genres: ["Romance", "Drama"], color: "#3b82f6", bg: "from-blue-500/20 to-cyan-500/10" },
  { label: "Dark & Edgy 🌑", emoji: "😈", pikoImage: "/piko-nervous.png", reaction: "Ooh dark mode activated! Let's go somewhere deep and twisted 👁️", genres: ["Psychological", "Horror"], color: "#7c3aed", bg: "from-purple-700/20 to-gray-900/10" },
  { label: "Curious 🤔", emoji: "🧐", pikoImage: "/piko-thinking.png", reaction: "Big brain mode? Let's find something that'll blow your mind 🧠", genres: ["Mystery", "Sci-Fi"], color: "#06b6d4", bg: "from-cyan-500/20 to-blue-500/10" },
  { label: "Romantic 💕", emoji: "🥰", pikoImage: "/piko-love.png", reaction: "Ahhh someone's feeling lovey dovey~ lemme find you something heartwarming 💖", genres: ["Romance", "Slice of Life"], color: "#ec4899", bg: "from-pink-500/20 to-rose-500/10" },
];

const EXTRA_QUESTIONS = [
  {
    id: "cry",
    chapter: "Chapter 1",
    pikoText: "okay okay real talk... have you ever cried over an anime or manga? 👀",
    options: [
      { label: "Yes, multiple times 😭", value: "emotional", color: "#3b82f6", emoji: "😭" },
      { label: "Once or twice 🥲", value: "mild", color: "#8b5cf6", emoji: "🥲" },
      { label: "Never (yet) 😐", value: "none", color: "#6b7280", emoji: "😐" },
      { label: "I don't cry 😤", value: "tough", color: "#ef4444", emoji: "😤" },
    ],
  },
  {
    id: "world",
    chapter: "Chapter 2",
    pikoText: "if you could jump into any world, which one would you pick? 🌍✨",
    options: [
      { label: "Magic & sorcery 🧙", value: "fantasy", color: "#7c3aed", emoji: "🧙" },
      { label: "Future tech city 🤖", value: "scifi", color: "#06b6d4", emoji: "🤖" },
      { label: "Cozy small town 🏡", value: "slice", color: "#10b981", emoji: "🏡" },
      { label: "Demon realm 👹", value: "dark", color: "#dc2626", emoji: "👹" },
    ],
  },
  {
    id: "style",
    chapter: "Chapter 3",
    pikoText: "how do you usually watch anime? be honest with piko 🐾",
    options: [
      { label: "Binge all night 🌙", value: "binge", color: "#1d4ed8", emoji: "🌙" },
      { label: "One episode a day 📅", value: "slow", color: "#059669", emoji: "📅" },
      { label: "Weekend warrior 🎮", value: "weekend", color: "#d97706", emoji: "🎮" },
      { label: "Whenever I can ⏰", value: "casual", color: "#7c3aed", emoji: "⏰" },
    ],
  },
  {
    id: "protagonist",
    chapter: "Chapter 4",
    pikoText: "last one! what kind of main character do you vibe with most? 😏",
    options: [
      { label: "Lone wolf 🐺", value: "solo", color: "#374151", emoji: "🐺" },
      { label: "Power of friendship 🤝", value: "group", color: "#f59e0b", emoji: "🤝" },
      { label: "Anti-hero 😈", value: "antihero", color: "#7c3aed", emoji: "😈" },
      { label: "Doesn't matter!", value: "any", color: "#ec4899", emoji: "✨" },
    ],
  },
];

const LENGTHS = [
  { label: "Short & Sweet", sublabel: "1–12 eps", emoji: "⚡", color: "#f59e0b" },
  { label: "Just Right", sublabel: "13–50 eps", emoji: "✨", color: "#10b981" },
  { label: "Long Haul", sublabel: "50+ eps", emoji: "🔥", color: "#ef4444" },
  { label: "Ongoing", sublabel: "Airing now", emoji: "📡", color: "#06b6d4" },
];

// Direction variants for shooting in from different sides
const DIRECTIONS = [
  { initial: { x: -120, opacity: 0 }, animate: { x: 0, opacity: 1 } },
  { initial: { x: 120, opacity: 0 }, animate: { x: 0, opacity: 1 } },
  { initial: { y: 80, opacity: 0 }, animate: { y: 0, opacity: 1 } },
  { initial: { y: -80, opacity: 0 }, animate: { y: 0, opacity: 1 } },
];

// POW burst component
function PowBurst({ active, color }: { active: boolean; color: string }) {
  if (!active) return null;
  return (
    <motion.div
      initial={{ scale: 0, opacity: 1 }}
      animate={{ scale: [0, 1.5, 2], opacity: [1, 1, 0] }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 flex items-center justify-center pointer-events-none z-[200]"
    >
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: [0, 1.2, 1], rotate: [-20, 10, 0] }}
        transition={{ duration: 0.35, ease: "backOut" }}
        className="text-[120px] font-extrabold select-none"
        style={{
          color,
          textShadow: `3px 3px 0 #000, -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000`,
          fontFamily: "Impact, sans-serif",
          WebkitTextStroke: "3px black",
        }}
      >
        {["POW!", "YES!", "NICE!", "LET'S GO!", "OOH!"][Math.floor(Math.random() * 5)]}
      </motion.div>
    </motion.div>
  );
}

// Thought bubble
function ThoughtBubble({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <div className="relative mb-5">
      <motion.div
        className="relative rounded-2xl px-6 py-4 shadow-2xl border-4"
        style={{
          background: color
            ? `linear-gradient(135deg, ${color}30, #1a0a2e)`
            : "linear-gradient(135deg, #1e1040, #0d0820)",
          borderColor: color ? color : "#FF85BB",
          boxShadow: color
            ? `4px 4px 0px ${color}, 0 0 20px ${color}40`
            : `4px 4px 0px #FF85BB, 0 0 20px rgba(255,133,187,0.3)`,
        }}
      >
        {/* Comic halftone dots */}
        <div className="absolute inset-0 rounded-2xl opacity-10 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "12px 12px",
          }}
        />
        <div className="relative z-10">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

type Phase = "intro" | "mood" | "piko-react" | "extra-questions" | "length" | "loading" | "result";

export default function WelcomePage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("intro");
  const [selectedMood, setSelectedMood] = useState<typeof MOODS[0] | null>(null);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const [result, setResult] = useState<MediaItem | null>(null);
  const [resultType, setResultType] = useState<"ANIME" | "MANGA">("ANIME");
  const [recentItems, setRecentItems] = useState<{ id: number; type: string; title: string; image: string }[]>([]);
  const [displayedText, setDisplayedText] = useState("");
  const [extraQIndex, setExtraQIndex] = useState(0);
  const [extraAnswers, setExtraAnswers] = useState<Record<string, string>>({});
  const [powActive, setPowActive] = useState(false);
  const [powColor, setPowColor] = useState("#FF85BB");
  const [bgColor, setBgColor] = useState("transparent");

  const pikoImage = phase === "piko-react" && selectedMood ? selectedMood.pikoImage : "/piko-face.png";

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("yozara_recent") || "[]");
      setRecentItems(stored.slice(0, 4));
    } catch {}
  }, []);

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
        setTimeout(() => { setExtraQIndex(0); setPhase("extra-questions"); }, 1000);
      }
    }, 28);
    return () => clearInterval(interval);
  }, [phase, selectedMood]);

  const triggerPow = (color: string) => {
    setPowColor(color);
    setPowActive(true);
    setTimeout(() => setPowActive(false), 500);
  };

  const chooseMood = (mood: typeof MOODS[0]) => {
    triggerPow(mood.color);
    setTimeout(() => {
      setSelectedMood(mood);
      setPhase("piko-react");
    }, 300);
  };

  const answerExtra = (value: string, color: string) => {
    triggerPow(color);
    const q = EXTRA_QUESTIONS[extraQIndex];
    setExtraAnswers((prev) => ({ ...prev, [q.id]: value }));
    setTimeout(() => {
      if (extraQIndex < EXTRA_QUESTIONS.length - 1) {
        setExtraQIndex(extraQIndex + 1);
      } else {
        setPhase("length");
      }
    }, 300);
  };

  const chooseLength = async (length: typeof LENGTHS[0]) => {
    triggerPow(length.color);
    setTimeout(async () => {
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
          status: length.sublabel === "Airing now" ? "RELEASING" : undefined,
        });
        const items: MediaItem[] = data?.Page?.media || [];
        const pick = items[Math.floor(Math.random() * Math.min(items.length, 10))];
        setResult(pick || null);
      } catch {}
      setPhase("result");
    }, 300);
  };

  const goToResult = () => { if (result) router.push(`/${resultType.toLowerCase()}/${result.id}`); };
  const skip = () => router.push("/");

  const img = result?.coverImage?.extraLarge || result?.coverImage?.large || "/hero-image.jpg";
  const title = result?.title?.english || result?.title?.romaji || "???";

  const pikoAnimate = phase === "loading"
    ? { y: [0, -20, 0] }
    : phase === "piko-react"
    ? { rotate: [0, -8, 8, -8, 0] }
    : phase === "result"
    ? { scale: [1, 1.08, 1] }
    : { y: [0, -10, 0] };

  const pikoTransition = phase === "loading"
    ? { repeat: Infinity, duration: 0.5 }
    : phase === "piko-react"
    ? { repeat: Infinity, duration: 0.6 }
    : phase === "result"
    ? { repeat: Infinity, duration: 1.5 }
    : { repeat: Infinity, duration: 2, ease: "easeInOut" as const };

  // Background color wash based on hovered option
  const washColor = hoveredOption ? hoveredOption : "transparent";

  return (
    <div className="min-h-screen flex relative overflow-hidden transition-colors duration-500">
      {/* POW burst */}
      <PowBurst active={powActive} color={powColor} />

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img src="/bg-home12.png" alt="bg" className="w-full h-full object-cover" style={{ filter: "blur(3px)", transform: "scale(1.05)" }} />
        <div className="absolute inset-0 bg-black/65" />
        {/* Color wash overlay */}
        <motion.div
          className="absolute inset-0"
          animate={{ backgroundColor: washColor !== "transparent" ? `${washColor}15` : "transparent" }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Skip */}
      <button onClick={skip} className="absolute top-6 right-6 z-50 text-white/60 hover:text-white text-sm bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full transition-all">
        Skip →
      </button>

      {/* ── LEFT: Piko ── */}
      <div className="relative z-10 flex items-center justify-center w-1/3 min-h-screen pl-8">
        <div className="relative">
          <motion.img
            key={pikoImage}
            src={pikoImage}
            alt="Piko"
            animate={pikoAnimate}
            transition={pikoTransition}
            style={{ imageRendering: "pixelated", width: "min(280px, 90%)", height: "auto" }}
          />
          {/* Sparkles around piko when result */}
          {phase === "result" && (
            <>
              {["✨", "⭐", "🌟", "💫"].map((s, i) => (
                <motion.div
                  key={i}
                  className="absolute text-xl pointer-events-none"
                  style={{ top: `${20 + i * 20}%`, left: i % 2 === 0 ? "-20%" : "100%" }}
                  animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5], rotate: [0, 20, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.3 }}
                >
                  {s}
                </motion.div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* ── RIGHT: Content ── */}
      <div className="relative z-10 flex items-center w-2/3 min-h-screen pr-8 pl-4">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">

            {/* ── INTRO ── */}
            {phase === "intro" && (
              <motion.div key="intro" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}>
                <ThoughtBubble>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
                    Hey there! I'm <span className="text-brand-pink">Piko</span> 🐾
                  </h1>
                  <p className="text-white/60 text-sm">Your personal anime & manga guide. Let me help you find something amazing!</p>
                </ThoughtBubble>
                <div className="flex flex-col gap-3">
                  <motion.button whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(255,133,187,0.4)" }} whileTap={{ scale: 0.97 }}
                    onClick={() => setPhase("mood")}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-pink to-purple-500 text-white font-extrabold text-lg shadow-2xl">
                    ✨ I want something new!
                  </motion.button>
                  {recentItems.length > 0 ? (
                    <>
                      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={skip}
                        className="w-full py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-lg hover:bg-white/20 transition-all">
                        📖 Continue with the previous lore
                      </motion.button>
                      <div className="flex gap-2 mt-1">
                        {recentItems.map((item) => (
                          <div key={item.id} onClick={() => router.push(`/${item.type}/${item.id}`)}
                            className="relative w-12 h-16 rounded-lg overflow-hidden border border-white/10 hover:border-brand-pink/50 transition-colors cursor-pointer">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <button onClick={skip} className="text-white/30 text-sm mt-1 hover:text-white/50 transition-colors">Skip for now →</button>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── MOOD ── */}
            {phase === "mood" && (
              <motion.div key="mood" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}>
                <ThoughtBubble>
                  <h2 className="text-2xl font-extrabold text-white mb-1">How's your mood today? 🎭</h2>
                  <p className="text-white/50 text-sm">be honest, piko can tell 👀</p>
                </ThoughtBubble>
                <div className="grid grid-cols-2 gap-3">
                  {MOODS.map((mood, i) => (
                    <motion.button
                      key={mood.label}
                      initial={DIRECTIONS[i % 4].initial}
                      animate={DIRECTIONS[i % 4].animate}
                      transition={{ delay: i * 0.07, type: "spring", stiffness: 200, damping: 20 }}
                      whileHover={{ scale: 1.06, y: -4 }}
                      whileTap={{ scale: 0.94 }}
                      onHoverStart={() => setHoveredOption(mood.color)}
                      onHoverEnd={() => setHoveredOption(null)}
                      onClick={() => chooseMood(mood)}
                      className="relative backdrop-blur-md border-2 text-white rounded-2xl p-4 text-left transition-all overflow-hidden"
                      style={{ borderColor: `${mood.color}60`, background: `linear-gradient(135deg, ${mood.color}15, transparent)` }}
                    >
                      <span className="text-3xl block mb-2">{mood.emoji}</span>
                      <p className="font-bold text-sm">{mood.label}</p>
                      {/* Glow on hover */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl pointer-events-none"
                        whileHover={{ boxShadow: `inset 0 0 20px ${mood.color}30` }}
                      />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── PIKO REACT ── */}
            {phase === "piko-react" && selectedMood && (
              <motion.div key="piko-react" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                <ThoughtBubble color={selectedMood.color}>
                  <p className="text-white font-bold text-lg leading-relaxed">
                    {displayedText}<span className="animate-pulse text-brand-pink">|</span>
                  </p>
                </ThoughtBubble>
              </motion.div>
            )}

            {/* ── EXTRA QUESTIONS ── */}
            {phase === "extra-questions" && (
              <motion.div key={`extra-${extraQIndex}`} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}>
                {/* Manga chapter divider */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  className="flex items-center gap-3 mb-4"
                >
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-brand-pink/50" />
                  <span className="text-brand-pink text-xs font-extrabold tracking-widest uppercase px-3 py-1 border border-brand-pink/30 rounded-full bg-brand-pink/10">
                    {EXTRA_QUESTIONS[extraQIndex].chapter}
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-brand-pink/50" />
                </motion.div>

                {/* Progress */}
                <div className="flex gap-1.5 mb-4">
                  {EXTRA_QUESTIONS.map((_, i) => (
                    <motion.div
                      key={i}
                      className="h-1.5 rounded-full transition-all duration-500"
                      animate={{ width: i <= extraQIndex ? "2rem" : "1rem", backgroundColor: i <= extraQIndex ? "#FF85BB" : "rgba(255,255,255,0.2)" }}
                    />
                  ))}
                </div>

                <ThoughtBubble>
                  <p className="text-white font-bold text-base leading-relaxed">{EXTRA_QUESTIONS[extraQIndex].pikoText}</p>
                </ThoughtBubble>

                <div className="grid grid-cols-2 gap-3">
                  {EXTRA_QUESTIONS[extraQIndex].options.map((opt, i) => (
                    <motion.button
                      key={opt.value}
                      initial={DIRECTIONS[i].initial}
                      animate={DIRECTIONS[i].animate}
                      transition={{ delay: i * 0.08, type: "spring", stiffness: 200, damping: 20 }}
                      whileHover={{ scale: 1.06, y: -4 }}
                      whileTap={{ scale: 0.94 }}
                      onHoverStart={() => setHoveredOption(opt.color)}
                      onHoverEnd={() => setHoveredOption(null)}
                      onClick={() => answerExtra(opt.value, opt.color)}
                      className="relative backdrop-blur-md border-2 text-white rounded-2xl p-4 text-left transition-all"
                      style={{ borderColor: `${opt.color}50`, background: `linear-gradient(135deg, ${opt.color}15, transparent)` }}
                    >
                      <span className="text-3xl block mb-2">{opt.emoji}</span>
                      <p className="font-bold text-sm">{opt.label}</p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── LENGTH ── */}
            {phase === "length" && (
              <motion.div key="length" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}>
                <motion.div className="flex items-center gap-3 mb-4" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-yellow-500/50" />
                  <span className="text-yellow-400 text-xs font-extrabold tracking-widest uppercase px-3 py-1 border border-yellow-500/30 rounded-full bg-yellow-500/10">
                    Final Chapter
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-yellow-500/50" />
                </motion.div>

                <ThoughtBubble>
                  <h2 className="text-xl font-extrabold text-white mb-1">almost there! ⏱️</h2>
                  <p className="text-white/50 text-sm">how long would you want it to be?</p>
                </ThoughtBubble>

                <div className="grid grid-cols-2 gap-3">
                  {LENGTHS.map((length, i) => (
                    <motion.button
                      key={length.label}
                      initial={DIRECTIONS[i].initial}
                      animate={DIRECTIONS[i].animate}
                      transition={{ delay: i * 0.08, type: "spring", stiffness: 200, damping: 20 }}
                      whileHover={{ scale: 1.06, y: -4 }}
                      whileTap={{ scale: 0.94 }}
                      onHoverStart={() => setHoveredOption(length.color)}
                      onHoverEnd={() => setHoveredOption(null)}
                      onClick={() => chooseLength(length)}
                      className="relative backdrop-blur-md border-2 text-white rounded-2xl p-4 text-left transition-all"
                      style={{ borderColor: `${length.color}50`, background: `linear-gradient(135deg, ${length.color}15, transparent)` }}
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
              <motion.div key="loading" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <ThoughtBubble>
                  <p className="text-white font-bold text-lg mb-3">sniffing out the perfect pick for you...</p>
                  <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                      <motion.span key={i} className="w-3 h-3 rounded-full bg-brand-pink inline-block"
                        animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }} />
                    ))}
                  </div>
                </ThoughtBubble>
              </motion.div>
            )}

            {/* ── RESULT ── */}
            {phase === "result" && result && (
              <motion.div key="result" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <ThoughtBubble color="#FF85BB">
                  <p className="text-brand-pink font-extrabold text-lg mb-1">✨ piko found your destiny~</p>
                  <p className="text-white/50 text-sm">i have a feeling you'll love this one!</p>
                </ThoughtBubble>

                <div className="flex gap-4 items-start">
                  <motion.div
                    animate={{ boxShadow: ["0 0 20px 5px rgba(255,133,187,0.2)", "0 0 50px 20px rgba(255,133,187,0.6)", "0 0 20px 5px rgba(255,133,187,0.2)"] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="relative w-36 h-52 rounded-2xl overflow-hidden border-2 border-brand-pink/70 shrink-0 cursor-pointer"
                    onClick={goToResult}
                  >
                    <img src={img} alt={title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
                    <div className={`absolute top-2 right-2 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${resultType === "ANIME" ? "bg-brand-pink text-white" : "bg-purple-600 text-white"}`}>
                      {resultType}
                    </div>
                    {result.averageScore && (
                      <div className="absolute top-2 left-2 bg-black/60 text-yellow-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        ⭐ {(result.averageScore / 10).toFixed(1)}
                      </div>
                    )}
                    <p className="absolute bottom-2 left-2 right-2 text-white text-xs font-extrabold line-clamp-2">{title}</p>
                  </motion.div>

                  <div className="flex flex-col gap-3 flex-1">
                    <p className="text-white font-bold text-base">{title}</p>
                    {result.genres && <p className="text-white/50 text-xs">{result.genres.slice(0, 3).join(" • ")}</p>}
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255,133,187,0.5)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={goToResult}
                      className="px-6 py-3 rounded-full bg-brand-pink text-white font-extrabold text-sm shadow-xl shadow-brand-pink/30"
                    >
                      🐾 Let's go!
                    </motion.button>
                    <button onClick={() => { setPhase("mood"); setSelectedMood(null); setResult(null); setExtraQIndex(0); setExtraAnswers({}); }}
                      className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white font-bold text-sm hover:bg-white/20 transition-all">
                      Try again
                    </button>
                    <button onClick={skip} className="text-white/30 text-xs hover:text-white/50 transition-colors">Go to homepage →</button>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
