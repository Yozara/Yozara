"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Hero() {
  return (
    <section className="relative w-full h-[95vh] min-h-[600px] bg-brand-blue flex items-center justify-center overflow-hidden">
      
      {/* --- Background Media Layer --- */}
      <div className="absolute inset-0 z-0">
        
        {/* Left Side: Video */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            WebkitMaskImage: "linear-gradient(105deg, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 48%)",
            maskImage: "linear-gradient(105deg, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 48%)"
          }}
        >
          {/* Increased opacity to 80% and added brightness-110 */}
          <video 
            src="/hero-video.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover opacity-80 brightness-110 mix-blend-screen"
          />
        </div>

        {/* Right Side: Image */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            WebkitMaskImage: "linear-gradient(105deg, rgba(0,0,0,0) 52%, rgba(0,0,0,1) 65%)",
            maskImage: "linear-gradient(105deg, rgba(0,0,0,0) 52%, rgba(0,0,0,1) 65%)"
          }}
        >
          {/* Added object-top to save the heads, increased opacity, added brightness */}
          <img 
            src="/hero-image.jpg" 
            alt="Anime Background" 
            className="w-full h-full object-cover object-top opacity-80 brightness-110 mix-blend-screen"
          />
        </div>

        {/* Central Dark Blue Overlay - Dropped to 20% to let more light through */}
        <div className="absolute inset-0 bg-brand-blue/20 backdrop-blur-[1px]" />
      </div>

      {/* --- Foreground Content Layer --- */}
      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-brand-white mb-6 max-w-5xl drop-shadow-2xl">
            Explore the Ultimate <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-brand-lightpink">
              Anime Universe.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-brand-white/90 max-w-2xl mx-auto mb-10 drop-shadow-md">
            Track what you watch, discover curated recommendations, and connect with millions of fans across the globe.
          </p>

          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto w-full" onSubmit={(e) => e.preventDefault()}>
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className="h-12 bg-brand-blue/80 border-white/20 text-brand-white placeholder:text-brand-white/50 backdrop-blur-md focus-visible:ring-brand-pink"
            />
            <Button type="submit" size="lg" className="h-12 bg-brand-white text-brand-blue hover:bg-brand-lightpink font-semibold px-8 shadow-[0_0_20px_rgba(255,133,187,0.3)] hover:shadow-[0_0_30px_rgba(255,133,187,0.5)] transition-all">
              Get Started
            </Button>
          </form>
        </motion.div>
      </div>

      {/* --- The Bottom Fade --- */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-brand-blue via-brand-blue/80 to-transparent z-20 pointer-events-none" />

      {/* --- The Convex Upward SVG Line --- */}
      <div className="absolute bottom-4 left-0 w-full overflow-hidden pointer-events-none z-30">
        <svg
          className="w-full h-[40px] md:h-[60px]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,120 Q600,0 1200,120"
            fill="none"
            stroke="var(--color-brand-pink)"
            strokeWidth="3"
          />
        </svg>
      </div>
      
    </section>
  );
}