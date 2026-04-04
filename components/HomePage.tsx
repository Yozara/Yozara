"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { Sparkles, Compass, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Hero from "@/components/Hero";
import TrendingScroll from "@/components/TrendingScroll";
import Features from "@/components/Features";
import FAQ from "@/components/FAQ";

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user ?? null);
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-24 pb-24">
        <Hero />
        <TrendingScroll />
      </div>
    );
  }

  // Logged-in user homepage
  if (user) {
    return (
      <div className="flex flex-col gap-16 pb-24">
        {/* Welcome Hero */}
        <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.32em] text-brand-pink backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5" />
                Welcome back
              </div>
              <h1 className="text-5xl sm:text-6xl font-bold text-white">
                Your personalized anime universe awaits
              </h1>
              <p className="text-lg text-white/60 max-w-2xl">
                Continue exploring, discover new favorites, and connect with fellow enthusiasts in the Yozara guild.
              </p>
            </motion.div>

            {/* Quick Action Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12"
            >
              <Link href="/anime">
                <div className="group relative p-6 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 hover:border-brand-pink/50 hover:bg-brand-pink/10 transition-all cursor-pointer h-full">
                  <Compass className="h-8 w-8 text-brand-pink mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">Discover Anime</h3>
                  <p className="text-sm text-white/60 mb-4">
                    Browse thousands of anime with advanced filters
                  </p>
                  <div className="flex items-center gap-2 text-brand-pink text-sm font-medium group-hover:gap-3 transition-all">
                    Start exploring <ArrowRight size={16} />
                  </div>
                </div>
              </Link>

              <Link href="/manga">
                <div className="group relative p-6 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 hover:border-brand-pink/50 hover:bg-brand-pink/10 transition-all cursor-pointer h-full">
                  <Compass className="h-8 w-8 text-brand-pink mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">Explore Manga</h3>
                  <p className="text-sm text-white/60 mb-4">
                    Dive into the world of manga and light novels
                  </p>
                  <div className="flex items-center gap-2 text-brand-pink text-sm font-medium group-hover:gap-3 transition-all">
                    View manga <ArrowRight size={16} />
                  </div>
                </div>
              </Link>

              <Link href="/profile">
                <div className="group relative p-6 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 hover:border-brand-pink/50 hover:bg-brand-pink/10 transition-all cursor-pointer h-full">
                  <Users className="h-8 w-8 text-brand-pink mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">Your Profile</h3>
                  <p className="text-sm text-white/60 mb-4">
                    Check your AniPoints and guild card status
                  </p>
                  <div className="flex items-center gap-2 text-brand-pink text-sm font-medium group-hover:gap-3 transition-all">
                    View profile <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Trending Section */}
        <TrendingScroll />

        {/* Features for Logged-in Users */}
        <section className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-6xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-3"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white">Coming Soon</h2>
              <p className="text-white/60">More features to enhance your Yozara experience</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Vibe Check",
                  description: "AI-powered mood-based anime recommendations",
                  icon: "✨"
                },
                {
                  title: "Community Resonance",
                  description: "Find your taste twins and compare ratings",
                  icon: "🎯"
                },
                {
                  title: "Smart Watchlist",
                  description: "Personalized recommendations based on history",
                  icon: "📺"
                },
                {
                  title: "Social Guild",
                  description: "Connect with fellow anime enthusiasts",
                  icon: "👥"
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * i }}
                  className="p-6 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 hover:border-brand-pink/50 transition-all"
                >
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-white/60">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <FAQ />
      </div>
    );
  }

  // Non-logged-in user homepage (original)
  return (
    <div className="flex flex-col gap-24 pb-24">
      <Hero />
      <TrendingScroll />
      <Features />
      <FAQ />
    </div>
  );
}
