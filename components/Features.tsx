import { motion } from "framer-motion";
import { Brain, Users, Activity } from "lucide-react";

const features = [
  {
    icon: <Brain className="w-8 h-8 text-pink-400" />,
    title: "AI Recommendations",
    description: "Our proprietary engine learns your taste to suggest hidden gems you'll actually love.",
    gradient: "from-pink-500/10 to-transparent"
  },
  {
    icon: <Users className="w-8 h-8 text-purple-400" />,
    title: "Social Tracking",
    description: "See what your friends are watching, review episodes, and join active community discussions.",
    gradient: "from-purple-500/10 to-transparent"
  },
  {
    icon: <Activity className="w-8 h-8 text-blue-400" />,
    title: "Live Statistics",
    description: "Track your watch time, favorite genres, and reading habits with beautiful data visualizations.",
    gradient: "from-blue-500/10 to-transparent"
  }
];

export default function Features() {
  return (
    <section className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">Join the Universe</h2>
        <p className="text-zinc-400 max-w-2xl mx-auto">Experience a platform built specifically for the modern otaku.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="group relative p-8 rounded-3xl bg-zinc-900 border border-white/5 overflow-hidden hover:border-white/10 transition-all duration-300 hover:-translate-y-2"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-zinc-950 flex items-center justify-center mb-6 border border-white/5 shadow-inner">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}