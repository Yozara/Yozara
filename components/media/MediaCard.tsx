"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export interface MediaCardProps {
  id: number;
  title: string;
  englishTitle?: string;
  coverImage: string;
  bannerImage?: string;
  score: number;
  type: "ANIME" | "MANGA";
  format?: string;
  season?: string;
  year?: number;
  genres: string[];
}

export function MediaCard({
  id,
  title,
  coverImage,
  score,
  type,
  format,
  year,
  genres,
}: MediaCardProps) {
  const href = type === "ANIME" ? `/anime/${id}` : `/manga/${id}`;
  const safeCoverImage = coverImage || "/hero-image.jpg";

  return (
    <Link href={href}>
      <motion.div
        className="group relative h-full cursor-pointer"
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
      >
        {/* Card Container */}
        <div className="relative h-96 overflow-hidden rounded-xl backdrop-blur-md bg-white/5 border border-white/10 shadow-xl transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-brand-pink/30">
          {/* Image */}
          <div className="relative h-64 w-full overflow-hidden bg-gradient-to-b from-white/10 to-transparent">
            <Image
              src={safeCoverImage}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0B0F19]/80" />

            {/* Score Badge */}
            {score > 0 && (
              <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-brand-pink/90 backdrop-blur-sm border border-brand-pink/50 text-white text-xs font-bold">
                {score}%
              </div>
            )}

            {/* Format Badge */}
            {format && (
              <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-xs font-semibold">
                {format}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 h-32 flex flex-col justify-between">
            {/* Title */}
            <div className="flex-1 overflow-hidden">
              <h3 className="text-white font-bold text-sm leading-tight line-clamp-2 group-hover:text-brand-pink transition-colors">
                {title}
              </h3>
            </div>

            {/* Genre Tags */}
            <div className="flex flex-wrap gap-1">
              {genres.slice(0, 2).map((genre) => (
                <span
                  key={genre}
                  className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs"
                >
                  {genre}
                </span>
              ))}
              {genres.length > 2 && (
                <span className="px-2 py-0.5 text-white/40 text-xs">
                  +{genres.length - 2}
                </span>
              )}
            </div>

            {/* Year */}
            {year && (
              <p className="text-white/40 text-xs mt-1">{year}</p>
            )}
          </div>

          {/* Hover Glow */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-b from-brand-pink/20 to-transparent" />
        </div>
      </motion.div>
    </Link>
  );
}
