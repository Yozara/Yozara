const { useState, useEffect, useRef } = React;
const { motion, useScroll, useTransform } = FramerMotion;
// Lucide icons will be available via Lucide.IconName// --- Custom Animated Particle Background ---
const ParticleBackground = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const particleArray = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(particleArray);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-cyan-400/30 blur-[1px]"
          style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }}
          animate={{
            y: ["0%", "-100%"],
            x: ["0%", `${Math.random() * 20 - 10}%`],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

// --- Main Landing Page Component ---
export default function YozaraLandingPage() {
  const cursorRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  // High-performance custom cursor glow tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Animation Variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const featureCards = [
    {
      title: "AI-Powered Intelligence",
      description: "Our neural engines analyze your reading and watch history to predict your next obsession with uncanny accuracy.",
      icon: <Brain className="w-8 h-8 text-cyan-400" />,
      delay: 0.1,
    },
    {
      title: "Cross-Platform Discovery",
      description: "Seamlessly jump between anime, manga, and manhwa. One unified universe for all your otaku cravings.",
      icon: <Compass className="w-8 h-8 text-pink-500" />,
      delay: 0.3,
    },
    {
      title: "Hyper-Personalized",
      description: "No generic lists. Every recommendation is tailored to your unique psychological profile and aesthetic preferences.",
      icon: <UserCircle className="w-8 h-8 text-indigo-400" />,
      delay: 0.5,
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#0f0c29] text-white selection:bg-pink-500 selection:text-white font-sans overflow-x-hidden">
      {/* Interactive Cursor Glow */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2 z-50 hidden md:block"
      />

      {/* Dynamic Background */}
      <motion.div
        className="absolute inset-0 z-0 bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#050414] opacity-80"
        style={{ y: backgroundY }}
      />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay z-0 pointer-events-none" />
      <ParticleBackground />

      {/* Navbar Overlay (Subtle) */}
      <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-40">
        <div className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">
          YZR.
        </div>
        <div className="flex gap-4">
          <button className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Log In</button>
        </div>
      </nav>

      <main className="relative z-10 flex flex-col items-center justify-center">
        
        {/* --- HERO SECTION --- */}
        <section className="min-h-screen flex flex-col items-center justify-center w-full px-4 text-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="max-w-5xl flex flex-col items-center"
          >
            <motion.div variants={fadeUp} className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <Zap className="w-4 h-4 text-pink-500" />
              <span className="text-sm font-medium tracking-wide text-gray-200">System Initialization Sequence Initiated</span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-7xl md:text-9xl font-black mb-6 tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 via-indigo-400 to-pink-600 drop-shadow-[0_0_25px_rgba(236,72,153,0.3)]"
            >
              YOZARA
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-xl md:text-3xl font-light text-gray-300 mb-12 max-w-3xl leading-relaxed"
            >
              Your AI-powered anime, manga, and manhwa recommendation universe.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-6 items-center">
              <button className="group relative px-8 py-4 bg-transparent text-white rounded-full font-bold text-lg transition-all duration-300 overflow-hidden border border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_30px_rgba(236,72,153,0.4)] hover:border-pink-500">
                <span className="relative z-10 flex items-center gap-3">
                  Coming Soon <Sparkles className="w-5 h-5 group-hover:text-pink-300 transition-colors" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
              </button>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-10 animate-bounce text-gray-400"
          >
            <div className="w-[1px] h-12 bg-gradient-to-b from-cyan-500 to-transparent mx-auto mb-2" />
            <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
          </motion.div>
        </section>

        {/* --- FEATURES SECTION --- */}
        <section className="min-h-screen w-full py-24 px-6 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm border-y border-white/5 relative overflow-hidden">
          {/* Decorative Cyberpunk Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-600/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px]" />

          <div className="max-w-7xl w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                Jack Into The Network
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Yozara utilizes advanced algorithms to synchronize with your taste matrix, delivering pure, unfiltered discovery.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {featureCards.map((card, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: card.delay, duration: 0.6 }}
                  whileHover={{ y: -10 }}
                  className="group p-8 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/50 hover:bg-white/[0.05] transition-all duration-300 backdrop-blur-xl relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="mb-6 inline-block p-4 rounded-xl bg-black/40 border border-white/5 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                    {card.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-cyan-300 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                    {card.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* --- COMING SOON / WAITLIST SECTION --- */}
        <section className="w-full py-32 px-6 flex flex-col items-center text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl w-full p-10 md:p-16 rounded-3xl bg-gradient-to-b from-indigo-900/40 to-[#050414] border border-indigo-500/30 shadow-[0_0_40px_rgba(48,43,99,0.5)] backdrop-blur-xl relative overflow-hidden"
          >
            {/* Glowing orb inside card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(236,72,153,0.1)_0%,transparent_70%)] z-0" />
            
            <div className="relative z-10 flex flex-col items-center">
              <h2 className="text-4xl md:text-6xl font-black mb-6 text-white">
                Secure Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400">Access</span>
              </h2>
              <p className="text-gray-300 mb-10 text-lg md:text-xl font-light">
                The gateway is opening soon. Join the waitlist to get early access to the Yozara beta.
              </p>
              
              <div className="w-full max-w-md flex flex-col sm:flex-row gap-4 relative">
                <div className="relative w-full">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="email" 
                    placeholder="Enter your email address" 
                    className="w-full pl-12 pr-4 py-4 rounded-full bg-black/50 border border-indigo-500/40 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-gray-500 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]"
                  />
                </div>
                <button className="px-8 py-4 rounded-full bg-cyan-500 hover:bg-cyan-400 text-[#050414] font-bold transition-all shadow-[0_0_15px_rgba(34,211,238,0.5)] hover:shadow-[0_0_25px_rgba(34,211,238,0.7)] flex items-center justify-center gap-2 whitespace-nowrap group">
                  Join Queue
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        </section>

      </main>

      {/* --- FOOTER --- */}
      <footer className="relative z-20 w-full py-8 border-t border-white/10 bg-[#050414] flex flex-col items-center justify-center text-center px-4">
        <p className="text-gray-400 text-sm mb-2 font-medium tracking-wide">
          Crafted with passion by <span className="text-cyan-400 font-bold">Shlok and Team</span>
        </p>
        <p className="text-gray-600 text-xs">
          &copy; {new Date().getFullYear()} Yozara Universe. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
