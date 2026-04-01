import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github, Twitter, Disc } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-zinc-950 pt-20 pb-10">
      <div className="container mx-auto px-4">
        {/* Bottom CTA */}
        <div className="flex flex-col items-center text-center mb-24">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to start tracking?</h2>
          <form className="flex flex-col sm:flex-row gap-3 w-full max-w-md" onSubmit={(e) => e.preventDefault()}>
            <Input 
              type="email" 
              placeholder="Enter your email" 
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
            <Link href="/" className="text-2xl font-bold tracking-tighter text-white inline-block mb-4">
              Yozara<span className="text-pink-500">.</span>
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
            <Link href="#" className="hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              <Disc className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}