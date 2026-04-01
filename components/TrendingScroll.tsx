"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const PLACEHOLDER_CARDS = Array.from({ length: 10 }).map((_, i) => i);

export default function TrendingScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  return (
    <section className="container mx-auto px-4 relative">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white tracking-tight">Trending Now</h2>
      </div>

      <div className="relative group">
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4"
        >
          {PLACEHOLDER_CARDS.map((id) => (
            <motion.div
              key={id}
              whileHover={{ scale: 1.02, y: -5 }}
              className="min-w-[220px] md:min-w-[260px] aspect-[2/3] rounded-2xl shrink-0 snap-start bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 relative overflow-hidden cursor-pointer"
            >
              {/* Fallback gradient styling for manga cover placeholder */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="h-4 w-3/4 bg-white/20 rounded mb-2" />
                <div className="h-3 w-1/2 bg-white/10 rounded" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Floating Scroll Button */}
        <Button
          size="icon"
          variant="secondary"
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 rounded-full w-14 h-14 shadow-2xl bg-white text-zinc-950 hover:bg-zinc-200 opacity-0 group-hover:opacity-100 transition-opacity z-10 hidden md:flex"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>
    </section>
  );
}