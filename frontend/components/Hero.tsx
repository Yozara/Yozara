"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export default function Hero() {
  // Generate random values for sakura petals on client side to avoid hydration mismatch
  const [petals, setPetals] = useState<Array<{ id: number; left: number; duration: number; delay: number }>>([]);

  useEffect(() => {
    setPetals(
      Array.from({ length: 25 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        duration: Math.random() * 5 + 5,
        delay: Math.random() * 5,
      }))
    );
  }, []);

  return (
    <section className="relative w-full h-[90vh] min-h-[600px] overflow-hidden bg-zinc-950 flex items-center justify-center">
      {/* Background Layer: Diagonal Split */}
      <div className="absolute inset-0 z-0 flex">
        {/* Left Diagonal: Sakura Gradient */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-pink-900/30 via-purple-900/20 to-zinc-950"
          style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
        >
          {/* Framer Motion Sakura Petals */}
          {petals.map((petal) => (
            <motion.div
              key={petal.id}
              className="absolute top-[-5%] w-3 h-3 bg-pink-300/40 rounded-full blur-[1px]"
              initial={{ y: -50, x: `${petal.left}vw`, rotate: 0, opacity: 0 }}
              animate={{
                y: "100vh",
                x: `${petal.left - 20}vw`,
                rotate: 360,
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: petal.duration,
                delay: petal.delay,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ borderRadius: "50% 0 50% 50%" }} // Petal shape
            />
          ))}
        </div>

        {/* Right Diagonal: 3D Isometric Grid */}
        <div 
          className="absolute inset-0 bg-zinc-950"
          style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}
        >
          <div className="absolute right-[-10%] top-[20%] w-[80%] h-[150%] flex gap-4 opacity-20 pointer-events-none transform-[perspective(1000px)_rotateX(60deg)_rotateZ(-45deg)]">
            {[1, 2, 3].map((col) => (
              <div key={col} className="flex flex-col gap-4 animate-marquee" style={{ animationDuration: `${col * 15 + 20}s` }}>
                {[...Array(8)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-48 h-72 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/5 shadow-2xl"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-pink-400 text-sm font-medium mb-6 backdrop-blur-sm">
            <Sparkles className="w-4 h-4" /> V2.0 is now live
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 max-w-4xl drop-shadow-lg">
            Explore the Ultimate <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">
              Anime Universe.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
            Track what you watch, discover curated recommendations, and connect with millions of fans across the globe.
          </p>

          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto w-full" onSubmit={(e) => e.preventDefault()}>
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className="h-12 bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-500 backdrop-blur-md focus-visible:ring-pink-500"
            />
            <Button type="submit" size="lg" className="h-12 bg-white text-zinc-950 hover:bg-zinc-200 font-semibold px-8">
              Get Started
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}