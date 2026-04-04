"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { ChevronDown, LogOut, Settings, LayoutDashboard } from "lucide-react";

export default function Navbar() {
    const router = useRouter();
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

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
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
    <header className="absolute top-0 left-0 right-0 z-50 h-24 bg-gradient-to-b from-brand-blue from-60% to-transparent pointer-events-auto">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between mt-2">
        
        {/* Left: Bigger Logo and Brand Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20"> 
            <Image 
              src="/logo.png" 
              alt="Yozara Logo" 
              fill
              className="object-contain transition-transform group-hover:scale-110"
              priority
            />
          </div>
        </Link>

        {/* Center: Links */}
        <nav className="hidden md:flex gap-8 text-sm font-medium">
          <Link href="/anime" className="relative text-brand-white/80 hover:text-brand-white transition-colors duration-300 py-1 after:absolute after:bottom-0 after:left-1/2 after:h-[2px] after:w-0 after:-translate-x-1/2 after:bg-brand-pink hover:after:w-full after:transition-all after:duration-300">
            Anime
          </Link>
          <Link href="/manga" className="relative text-brand-white/80 hover:text-brand-white transition-colors duration-300 py-1 after:absolute after:bottom-0 after:left-1/2 after:h-[2px] after:w-0 after:-translate-x-1/2 after:bg-brand-pink hover:after:w-full after:transition-all after:duration-300">
            Manga
          </Link>
        </nav>

        {/* Right: CTA */}
        <div className="flex items-center gap-4">
          {!loading && user ? (
            <div className="relative">
              <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">
                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white/10">
                  <Image src="/icon.png" alt="Profile" fill className="object-cover" />
                </div>
                <ChevronDown size={16} className="text-brand-white/60" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-12 w-48 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-xl">
                  <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-all border-b border-white/5">
                    <LayoutDashboard size={16} />
                    <span>Profile</span>
                  </Link>
                  <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-all border-b border-white/5">
                    <Settings size={16} />
                    <span>Settings</span>
                  </Link>
                  <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 text-red-400/80 hover:text-red-400 hover:bg-red-400/10 transition-all">
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : !loading ? (
            <>
              <Link href="/login">
                <Button variant="ghost" className="text-brand-white/80 hover:text-brand-white hover:bg-white/5 hidden sm:flex">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-brand-white text-brand-blue hover:bg-brand-lightpink hover:text-brand-blue transition-colors shadow-[0_0_15px_rgba(255,206,227,0.2)] hover:shadow-[0_0_25px_rgba(255,206,227,0.5)]">
                  Begin Journey
                </Button>
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}