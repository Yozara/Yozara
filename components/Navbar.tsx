"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 h-24 bg-gradient-to-b from-brand-blue from-60% to-transparent pointer-events-auto">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between mt-2">
        
        {/* Left: Bigger Logo and Brand Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-12 h-12"> 
            <Image 
              src="/logo.png" 
              alt="Yozara Logo" 
              fill
              className="object-contain transition-transform group-hover:scale-110"
              priority
            />
          </div>
          <span className="text-2xl font-bold text-brand-white hidden md:block">
            Yozara<span className="text-brand-pink">.</span>
          </span>
        </Link>

        {/* Center: Links */}
        <nav className="hidden md:flex gap-8 text-sm font-medium">
          <Link href="/anime" className="relative text-brand-white/80 hover:text-brand-white transition-colors duration-300 py-1 after:absolute after:bottom-0 after:left-1/2 after:h-[2px] after:w-0 after:-translate-x-1/2 after:bg-brand-pink hover:after:w-full after:transition-all after:duration-300">
            Anime
          </Link>
          <Link href="/comics" className="relative text-brand-white/80 hover:text-brand-white transition-colors duration-300 py-1 after:absolute after:bottom-0 after:left-1/2 after:h-[2px] after:w-0 after:-translate-x-1/2 after:bg-brand-pink hover:after:w-full after:transition-all after:duration-300">
            Comics
          </Link>
        </nav>

        {/* Right: CTA */}
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-brand-white/80 hover:text-brand-white hover:bg-white/5 hidden sm:flex">
              Log in
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-brand-white text-brand-blue hover:bg-brand-lightpink hover:text-brand-blue transition-colors shadow-[0_0_15px_rgba(255,206,227,0.2)] hover:shadow-[0_0_25px_rgba(255,206,227,0.5)]">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}