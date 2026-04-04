"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Disc as Discord } from "lucide-react"; // Keeping Disc as it rarely causes export issues

export default function Footer() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user ?? null);
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    router.push(trimmedEmail ? `/signup?email=${encodeURIComponent(trimmedEmail)}` : "/signup");
  };

  if (user) {
    return (
      <footer className="mt-auto border-t border-white/10 bg-zinc-950 pt-20 pb-10">
        <div className="container mx-auto px-4">
          {/* Footer Navigation for Logged-in Users */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 pt-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center justify-start mb-4">
              <Image
                src="/logo.png"
                alt="Yozara"
                width={240}
                height={80}
                className="h-20 w-auto object-contain"
                priority
              />
            </Link>
            <p className="text-zinc-500 text-sm">
              The modern platform for anime and manga enthusiasts.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li><Link href="#" className="hover:text-white transition-colors">Anime</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Manga</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Community</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Premium</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">API Docs</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Guidelines</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10 text-zinc-500 text-sm">
          <p>© 2026 Yozara. All rights reserved.</p>
          <div className="flex items-center gap-4">
            
            {/* Twitter / X SVG */}
            <Link href="#" className="hover:text-white transition-colors" aria-label="Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/>
              </svg>
            </Link>

            {/* GitHub SVG */}
            <Link href="#" className="hover:text-white transition-colors" aria-label="GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5-.73 1.02-1.08 2.25-1 3.5 0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>
              </svg>
            </Link>

            {/* Discord (Using Lucide's Disc) */}
            <Link href="#" className="hover:text-white transition-colors" aria-label="Discord">
              <Discord className="w-5 h-5" />
            </Link>
            
          </div>
        </div>
      </div>
    </footer>
  );
  }

  return (
    <footer className="mt-auto border-t border-white/10 bg-zinc-950 pt-20 pb-10">
      <div className="container mx-auto px-4">
        {/* Bottom CTA for Non-logged-in Users */}
        <div className="flex flex-col items-center text-center mb-24">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to start tracking?</h2>
          <form className="flex flex-col sm:flex-row gap-3 w-full max-w-md" onSubmit={handleSubmit}>
            <Input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 bg-zinc-900 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-pink-500"
            />
            <Button type="submit" size="lg" className="h-12 bg-white text-zinc-950 hover:bg-zinc-200 font-semibold px-8">
              Join Now
            </Button>
          </form>
        </div>

        {/* Footer Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 border-t border-white/10 pt-16">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center justify-start mb-4">
              <Image
                src="/logo.png"
                alt="Yozara"
                width={240}
                height={80}
                className="h-20 w-auto object-contain"
                priority
              />
            </Link>
            <p className="text-zinc-500 text-sm">
              The modern platform for anime and manga enthusiasts.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li><Link href="#" className="hover:text-white transition-colors">Anime</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Manga</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Community</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Premium</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">API Docs</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Guidelines</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10 text-zinc-500 text-sm">
          <p>© 2026 Yozara. All rights reserved.</p>
          <div className="flex items-center gap-4">
            
            {/* Twitter / X SVG */}
            <Link href="#" className="hover:text-white transition-colors" aria-label="Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/>
              </svg>
            </Link>

            {/* GitHub SVG */}
            <Link href="#" className="hover:text-white transition-colors" aria-label="GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5-.73 1.02-1.08 2.25-1 3.5 0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>
              </svg>
            </Link>

            {/* Discord (Using Lucide's Disc) */}
            <Link href="#" className="hover:text-white transition-colors" aria-label="Discord">
              <Discord className="w-5 h-5" />
            </Link>
            
          </div>
        </div>
      </div>
    </footer>
  );
}
