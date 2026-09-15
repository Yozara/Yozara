"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { Send, X, RotateCcw } from "lucide-react";
import { searchMedia } from "@/utils/anilist/client";

// ── Onboarding flow ────────────────────────────────────────────────────────
const MOODS = [
  { label: "Happy & Hyped ⚡", emoji: "😄", pikoImage: "/piko-happy.png", genres: ["Action", "Sports"], color: "#ef4444", reply: "Oh you're hyped today?! *wags tail* Let's find something that'll get your blood pumping! 🔥" },
  { label: "Chill & Relaxed 🍵", emoji: "😌", pikoImage: "/piko-relaxed.png", genres: ["Slice of Life", "Comedy"], color: "#10b981", reply: "Ahh a chill day~ *curls up* Let me find you something cozy to vibe with 🌸" },
  { label: "Emotional 😭", emoji: "😢", pikoImage: "/piko-sad.png", genres: ["Romance", "Drama"], color: "#3b82f6", reply: "Feeling emotional huh? I got you... prepare the tissues though 💕" },
  { label: "Dark & Edgy 🌑", emoji: "😈", pikoImage: "/piko-nervous.png", genres: ["Psychological", "Horror"], color: "#7c3aed", reply: "Ooh dark mode activated! *perks ears* Let's go somewhere deep and twisted 👁️" },
  { label: "Curious 🤔", emoji: "🧐", pikoImage: "/piko-thinking.png", genres: ["Mystery", "Sci-Fi"], color: "#06b6d4", reply: "Big brain mode? Let's find something that'll blow your mind 🧠" },
  { label: "Romantic 💕", emoji: "🥰", pikoImage: "/piko-love.png", genres: ["Romance", "Slice of Life"], color: "#ec4899", reply: "Ahhh someone's feeling lovey dovey~ *happy bark* 💖" },
];

const LENGTHS = [
  { label: "Short & Sweet ⚡", sublabel: "1–12 eps", color: "#f59e0b" },
  { label: "Just Right ✨", sublabel: "13–50 eps", color: "#10b981" },
  { label: "Long Haul 🔥", sublabel: "50+ eps", color: "#ef4444" },
  { label: "Ongoing 📡", sublabel: "Airing now", color: "#06b6d4" },
];

type OnboardStep = "welcome" | "mood" | "length" | "result" | "done";

type Message = {
  id: string;
  role: "piko" | "user";
  content: string;
  options?: { label: string; value: string; color?: string }[];
  isTyping?: boolean;
};

function TypingDots() {
  return (
    <div className="flex gap-1 items-center px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.div key={i} className="w-2 h-2 rounded-full bg-brand-pink"
          animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }} />
      ))}
    </div>
  );
}

export default function PikoChat() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [pikoImage, setPikoImage] = useState("/piko-face.png");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [onboardStep, setOnboardStep] = useState<OnboardStep>("done");
  const [selectedMood, setSelectedMood] = useState<typeof MOODS[0] | null>(null);
  const [history, setHistory] = useState<{ role: string; content: string }[]>([]);
  const [pulse, setPulse] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) checkIfNew(data.user.id);
    });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Pulse Piko button on first load
  useEffect(() => {
    const seen = sessionStorage.getItem("piko_seen");
    if (!seen) {
      setPulse(true);
      setTimeout(() => setPulse(false), 5000);
      sessionStorage.setItem("piko_seen", "1");
    }
  }, []);

  const checkIfNew = async (userId: string) => {
    const { data } = await supabase.from("piko_memory").select("onboarded").eq("user_id", userId).single();
    if (!data || !data.onboarded) {
      setIsNew(true);
    }
  };

  const addMessage = (msg: Omit<Message, "id">) => {
    setMessages((prev) => [...prev, { ...msg, id: Math.random().toString(36) }]);
  };

  const addTyping = () => {
    const id = Math.random().toString(36);
    setMessages((prev) => [...prev, { id, role: "piko", content: "", isTyping: true }]);
    return id;
  };

  const removeTyping = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const startOnboarding = () => {
    setOnboardStep("welcome");
    setTimeout(() => {
      addMessage({
        role: "piko",
        content: "Woof!! 🐾 I'm Piko, your personal anime & manga guide! I'm SO excited to meet you! Let me find something perfect for you~ How's your mood today?",
        options: MOODS.map((m) => ({ label: m.label, value: m.label, color: m.color })),
      });
      setOnboardStep("mood");
    }, 500);
  };

  const handleMoodSelect = async (label: string) => {
    const mood = MOODS.find((m) => m.label === label);
    if (!mood) return;
    setSelectedMood(mood);
    setPikoImage(mood.pikoImage);

    addMessage({ role: "user", content: label });

    const typingId = addTyping();
    await new Promise((r) => setTimeout(r, 1000));
    removeTyping(typingId);

    addMessage({
      role: "piko",
      content: mood.reply + " But wait... how long would you want it to be?",
      options: LENGTHS.map((l) => ({ label: `${l.label} — ${l.sublabel}`, value: l.label, color: l.color })),
    });
    setOnboardStep("length");
  };

  const handleLengthSelect = async (label: string) => {
    addMessage({ role: "user", content: label });
    setOnboardStep("result");

    const typingId = addTyping();

    try {
      const genre = selectedMood?.genres[0] || "Action";
      const type: "ANIME" | "MANGA" = Math.random() > 0.4 ? "ANIME" : "MANGA";
      const data = await searchMedia(type, { genre: [genre], sort: "POPULARITY_DESC", page: 1 });
      const items = data?.Page?.media || [];
      const pick = items[Math.floor(Math.random() * Math.min(items.length, 10))];

      removeTyping(typingId);

      if (pick) {
        const title = pick.title?.english || pick.title?.romaji;
        addMessage({
          role: "piko",
          content: `*drum roll* 🥁 Piko recommends... **${title}**! ${pick.genres?.slice(0, 2).join(" & ")} vibes — I have a feeling you'll LOVE it! 🔥`,
          options: [
            { label: `✨ View ${type === "ANIME" ? "Anime" : "Manga"}`, value: `goto:/${type.toLowerCase()}/${pick.id}` },
            { label: "🔄 Try again", value: "restart" },
            { label: "💬 Just chat with Piko!", value: "chat" },
          ],
        });
      }

      // Save to piko_memory
      if (user) {
        await supabase.from("piko_memory").upsert({
          user_id: user.id,
          mood: selectedMood?.label,
          favorite_genres: selectedMood?.genres,
          length_preference: label,
          onboarded: true,
          last_seen: new Date().toISOString(),
        }, { onConflict: "user_id" });
      }
    } catch {
      removeTyping(typingId);
      addMessage({ role: "piko", content: "Woof! Something went wrong, but Piko won't give up! Try again? 🐾" });
    }
    setOnboardStep("done");
    setPikoImage("/piko-face.png");
  };

  const handleOptionClick = (value: string) => {
    if (value.startsWith("goto:")) {
      window.location.href = value.replace("goto:", "");
      return;
    }
    if (value === "restart") {
      setMessages([]);
      setSelectedMood(null);
      startOnboarding();
      return;
    }
    if (value === "chat") {
      addMessage({ role: "piko", content: "Yay! Let's chat~ Ask me anything about anime or manga, or just tell me what you're in the mood for! 🐾✨" });
      return;
    }
    // It's a mood or length option
    if (onboardStep === "mood") handleMoodSelect(value);
    else if (onboardStep === "length") handleLengthSelect(value);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setLoading(true);

    addMessage({ role: "user", content: userMsg });
    const newHistory = [...history, { role: "user", content: userMsg }];

    const typingId = addTyping();

    try {
      const res = await fetch("/api/piko", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, history }),
      });
      const data = await res.json();
      removeTyping(typingId);
      addMessage({ role: "piko", content: data.reply });
      setHistory([...newHistory, { role: "assistant", content: data.reply }]);
    } catch {
      removeTyping(typingId);
      addMessage({ role: "piko", content: "Woof! Something went wrong! Try again? 🐾" });
    }
    setLoading(false);
  };

  const openChat = () => {
    setOpen(true);
    if (messages.length === 0) {
      if (isNew && user) {
        startOnboarding();
      } else if (!user) {
        setTimeout(() => {
          addMessage({
            role: "piko",
            content: "Woof! 🐾 Hey there! I'm Piko~ I can help you find the perfect anime or manga! Log in to unlock personalized recommendations just for you! 🌸",
            options: [
              { label: "🔑 Log In", value: "goto:/login" },
              { label: "✨ Sign Up Free", value: "goto:/signup" },
              { label: "💬 Just browse", value: "chat" },
            ],
          });
        }, 400);
      } else {
        setTimeout(() => {
          addMessage({
            role: "piko",
            content: "Hey hey! 🐾 *wags tail* Welcome back! What are we watching today? Ask me anything or tell me your mood~",
            options: [
              { label: "🎭 Recommend by mood", value: "restart" },
              { label: "💬 Just chat", value: "chat" },
            ],
          });
        }, 400);
      }
    }
  };

  return (
    <>
      {/* Floating Piko button */}
      <motion.button
        onClick={openChat}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 left-6 z-50 rounded-full p-1 shadow-2xl"
        style={{ background: "linear-gradient(135deg, #FF85BB, #8b5cf6)" }}
        animate={pulse ? { scale: [1, 1.15, 1], boxShadow: ["0 0 0 0 rgba(255,133,187,0.4)", "0 0 0 20px rgba(255,133,187,0)", "0 0 0 0 rgba(255,133,187,0)"] } : {}}
        transition={pulse ? { repeat: 5, duration: 1 } : {}}
      >
        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/30">
          <img src={pikoImage} alt="Piko" className="w-full h-full object-cover" style={{ imageRendering: "pixelated" }} />
        </div>
        {/* Notification dot for new users */}
        {isNew && !open && (
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-white"
          />
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed bottom-24 left-6 z-50 w-80 sm:w-96 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            style={{ background: "linear-gradient(160deg, #1a0a2e, #0d0820)" }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10"
              style={{ background: "linear-gradient(135deg, rgba(255,133,187,0.15), rgba(139,92,246,0.1))" }}>
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-brand-pink/50 shrink-0">
                <img src={pikoImage} alt="Piko" className="w-full h-full object-cover" style={{ imageRendering: "pixelated" }} />
              </div>
              <div className="flex-1">
                <p className="text-white font-extrabold text-sm">Piko 🐾</p>
                <div className="flex items-center gap-1.5">
                  <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                    className="w-2 h-2 rounded-full bg-green-400" />
                  <p className="text-white/40 text-xs">always here for you~</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setMessages([]); setHistory([]); setOnboardStep("done"); }}
                  className="text-white/30 hover:text-white/60 transition-colors p-1">
                  <RotateCcw size={14} />
                </button>
                <button onClick={() => setOpen(false)} className="text-white/30 hover:text-white/60 transition-colors p-1">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto px-3 py-3 flex flex-col gap-3 no-scrollbar">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col gap-2 ${msg.role === "user" ? "items-end" : "items-start"}`}
                  >
                    {msg.isTyping ? (
                      <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none">
                        <TypingDots />
                      </div>
                    ) : (
                      <div
                        className={`max-w-[85%] px-3 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          msg.role === "user"
                            ? "bg-brand-pink text-white rounded-tr-none font-medium"
                            : "bg-white/5 border border-white/10 text-white/90 rounded-tl-none"
                        }`}
                        dangerouslySetInnerHTML={{
                          __html: msg.content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                        }}
                      />
                    )}

                    {/* Option buttons */}
                    {msg.options && msg.role === "piko" && !msg.isTyping && (
                      <div className="flex flex-col gap-1.5 w-full max-w-[90%]">
                        {msg.options.map((opt) => (
                          <motion.button
                            key={opt.value}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleOptionClick(opt.value)}
                            className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-white border transition-all"
                            style={{
                              borderColor: opt.color ? `${opt.color}60` : "rgba(255,255,255,0.15)",
                              background: opt.color ? `${opt.color}15` : "rgba(255,255,255,0.05)",
                            }}
                          >
                            {opt.label}
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-white/10 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask Piko anything~ 🐾"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-brand-pink/50 transition-colors placeholder-white/20"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-40 transition-all shrink-0"
                style={{ background: "linear-gradient(135deg, #FF85BB, #8b5cf6)" }}
              >
                <Send size={16} className="text-white" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
