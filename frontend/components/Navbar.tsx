import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-zinc-950/60 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="text-2xl font-bold tracking-tighter text-white">
          Yozara<span className="text-pink-500">.</span>
        </Link>

        {/* Center: Links */}
        <nav className="hidden md:flex gap-8 text-sm font-medium text-zinc-400">
          <Link href="/anime" className="hover:text-white transition-colors">
            Anime
          </Link>
          <Link href="/comics" className="hover:text-white transition-colors">
            Comics
          </Link>
        </nav>

        {/* Right: CTA */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-zinc-300 hover:text-white hidden sm:flex">
            Log in
          </Button>
          <Button className="bg-white text-zinc-950 hover:bg-zinc-200">
            Sign In
          </Button>
        </div>
      </div>
    </header>
  );
}