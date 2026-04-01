import Hero from "@/components/Hero";
import TrendingScroll from "@/components/TrendingScroll";
import Features from "@/components/Features";
import FAQ from "@/components/FAQ";

export default function Home() {
  return (
    <div className="flex flex-col gap-24 pb-24">
      <Hero />
      <TrendingScroll />
      <Features />
      <FAQ />
    </div>
  );
}