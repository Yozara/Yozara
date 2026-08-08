"use client";

import { motion } from "framer-motion";

export default function PikoLoader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Piko sprite animation */}
      <div
        style={{
          width: 96,
          height: 96,
          overflow: "hidden",
          position: "relative",
          imageRendering: "pixelated",
        }}
      >
        <div
          style={{
            width: "500%", // 5 frames
            height: "100%",
            backgroundImage: "url('/piko-walk.png')",
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
            animation: "piko-walk 0.6s steps(5, end) infinite",
          }}
        />
      </div>

      {/* Bouncing dots */}
      <div className="flex items-center gap-1">
        <p className="text-white/60 text-sm">{text}</p>
        <div className="flex gap-1 ml-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-brand-pink inline-block"
              animate={{ y: [0, -6, 0] }}
              transition={{
                repeat: Infinity,
                duration: 0.6,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes piko-walk {
          from { transform: translateX(0%); }
          to { transform: translateX(-80%); }
        }
      `}</style>
    </div>
  );
}
