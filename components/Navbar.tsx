"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { ChevronDown, LogOut, Settings, LayoutDashboard, Tv, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user ?? null);
      setLoading(false);
    };
    checkAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <>
      {/* ── Top Navbar ── */}
      <header className="absolute top-0 left-0 right-0 z-50 h-24 pointer-events-auto">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between mt-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24">
              <Image
                src="/logo.png"
                alt="Yozara Logo"
                fill
                className="object-contain transition-transform group-hover:scale-110"
                priority
              />
            </div>
          </Link>

          {/* Right: Auth */}
          <div className="flex items-center gap-4">
            {!loading && user ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white/10">
                    <Image src="/icon.png" alt="Profile" fill className="object-cover" />
                  </div>
                  <ChevronDown size={16} className="text-white/60" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-12 w-48 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-xl">
                    <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-all border-b border-white/5">
                      <LayoutDashboard size={16} /><span>Profile</span>
                    </Link>
                    <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-all border-b border-white/5">
                      <Settings size={16} /><span>Settings</span>
                    </Link>
                    <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 text-red-400/80 hover:text-red-400 hover:bg-red-400/10 transition-all">
                      <LogOut size={16} /><span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : !loading ? (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/5 hidden sm:flex">
                    Log in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-white text-[#0B0F19] hover:bg-brand-lightpink hover:text-[#0B0F19] transition-colors shadow-[0_0_15px_rgba(255,206,227,0.2)] hover:shadow-[0_0_25px_rgba(255,206,227,0.5)]">
                    Begin Journey
                  </Button>
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </header>

      {/* ── Side Nav Buttons ── */}
      <div className="fixed left-0 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {/* Anime */}
        <Link href="/anime">
          <motion.div
            initial={{ x: -56 }}
            whileHover={{ x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`flex items-center gap-3 pl-3 pr-5 py-3 rounded-r-2xl cursor-pointer shadow-xl ${
              pathname.startsWith("/anime")
                ? "bg-brand-pink"
                : "bg-[#1a1a2e] border border-white/10 hover:bg-brand-pink"
            }`}
          >
            <Tv size={20} className="text-white shrink-0" />
            <span className="text-white font-bold text-sm whitespace-nowrap">Anime</span>
          </motion.div>
        </Link>

        {/* Manga */}
        <Link href="/manga">
          <motion.div
            initial={{ x: -56 }}
            whileHover={{ x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`flex items-center gap-3 pl-3 pr-5 py-3 rounded-r-2xl cursor-pointer shadow-xl ${
              pathname.startsWith("/manga")
                ? "bg-purple-600"
                : "bg-[#1a1a2e] border border-white/10 hover:bg-purple-600"
            }`}
          >
            <BookOpen size={20} className="text-white shrink-0" />
            <span className="text-white font-bold text-sm whitespace-nowrap">Manga</span>
          </motion.div>
        </Link>
      </div>
    </>
  );
}
