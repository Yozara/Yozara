"use client";

import { motion } from "framer-motion";
export default function PikoLoader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      {/* Piko walking GIF */}
      <img
        src="/piko-walk.gif"
        alt="Piko loading"
        style={{ width: 100, height: 100, imageRendering: "pixelated" }}
      />

      {/* Text + bouncing dots */}
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
    </div>
  );
}
