"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getMediaDetails } from "@/utils/anilist/client";
import { motion } from "framer-motion";
import { Star, Calendar, ExternalLink, Loader, BookOpen, Download } from "lucide-react";

interface MangaDetailClientProps {
  id: number;
}

export function MangaDetailClient({ id }: MangaDetailClientProps) {
  const [manga, setManga] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await getMediaDetails(id);
        setManga(data);
      } catch (err) {
        console.error("Failed to fetch manga details:", err);
        setError("Failed to load manga details");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-12 h-12 text-brand-pink animate-spin" />
          <p className="text-white/60">Loading manga details...</p>
        </div>
      </div>
    );
  }

  if (error || !manga) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || "Manga not found"}</p>
          <Link href="/manga" className="text-brand-pink hover:underline">
            Back to browse
          </Link>
        </div>
      </div>
    );
  }

  const title = manga.title?.english || manga.title?.romaji || "Untitled";
  const bannerImage = manga.bannerImage;
  const coverImage = manga.coverImage?.extraLarge || manga.coverImage?.large || "/hero-image.jpg";
  const formatDate = (date: any) => {
    if (!date) return null;
    return new Date(date.year, date.month - 1, date.day).toLocaleDateString(
      "en-US",
      { year: "numeric", month: "long", day: "numeric" }
    );
  };

  return (
  <div
  className="min-h-screen bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: "url('/images/bg1.jpg')",
  }}
>
      {bannerImage && (
        <div className="fixed inset-0 h-96 -z-10 overflow-hidden">
          <Image src={bannerImage} alt={title} fill className="object-cover" priority />
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0B0F19]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19] via-transparent to-[#0B0F19]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0B0F19] backdrop-blur-md" />
<div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19] via-transparent to-[#0B0F19] backdrop-blur-md" />
        </div>
      )}

      {/* Content */}
      <div className="relative pt-20 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Section with Cover and Basic Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          >
            {/* Cover Image */}
            <div className="md:col-span-1">
              <div className="relative h-96 rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src={coverImage}
                  alt={title}
                  fill
                  className="object-cover"
                />
                {/* Rating Badge */}
                {manga.averageScore && (
                  <div className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-md bg-white/20 border border-white/30">
                    <Star
                      size={18}
                      className="text-brand-pink fill-brand-pink"
                    />
                    <span className="text-white font-bold text-lg">
                      {manga.averageScore / 10}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Basic Info */}
            <div className="md:col-span-2 flex flex-col justify-between">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                  {title}
                </h1>
                {manga.title?.native && (
                  <p className="text-white/60 mb-4">{manga.title.native}</p>
                )}

                {/* Key Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {manga.chapters && (
                    <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-lg p-3">
                      <p className="text-white/60 text-sm">Chapters</p>
                      <p className="text-white text-lg font-bold">
                        {manga.chapters}
                      </p>
                    </div>
                  )}
                  {manga.volumes && (
                    <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-lg p-3">
                      <p className="text-white/60 text-sm">Volumes</p>
                      <p className="text-white text-lg font-bold">
                        {manga.volumes}
                      </p>
                    </div>
                  )}
                  {manga.status && (
                    <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-lg p-3">
                      <p className="text-white/60 text-sm">Status</p>
                      <p className="text-white text-lg font-bold">
                        {manga.status.replace(/_/g, " ")}
                      </p>
                    </div>
                  )}
                </div>

                {/* Dates */}
                <div className="flex flex-wrap gap-4 mb-6">
                  {manga.startDate && (
                    <div className="flex items-center gap-2 text-white/80">
                      <Calendar size={18} className="text-brand-pink" />
                      <span>{formatDate(manga.startDate)}</span>
                    </div>
                  )}
                  {manga.endDate && manga.status === "FINISHED" && (
                    <div className="flex items-center gap-2 text-white/80">
                      <Calendar size={18} className="text-brand-pink" />
                      <span>{formatDate(manga.endDate)}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
<div className="flex flex-wrap gap-3">
  {manga.siteUrl && (
    <motion.a
      href={manga.siteUrl}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.05 }}
      className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all font-medium"
    >
      <ExternalLink size={18} />
      AniList
    </motion.a>
  )}

  {/* Read Here Button */}
  <motion.a
    href={`https://weebcentral.com/search/simple?q=${encodeURIComponent(title)}`}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.05 }}
    className="flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-pink text-white hover:bg-brand-pink/80 transition-all font-medium"
  >
    <BookOpen size={18} />
    Read Here
  </motion.a>

  {/* Download Button */}
  <motion.a
    href={`https://weebcentral.com/search/simple?q=${encodeURIComponent(title)}`}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.05 }}
    className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 border border-brand-pink/50 text-brand-pink hover:bg-brand-pink/10 transition-all font-medium"
  >
    <Download size={18} />
    Download
  </motion.a>
</div>       

          {/* Synopsis */}
          {manga.description && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Synopsis</h2>
              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6">
                <div
                  className="text-white/80 leading-relaxed prose prose-invert max-w-none text-sm"
                  dangerouslySetInnerHTML={{ __html: manga.description }}
                />
              </div>
            </motion.div>
          )}

          {/* Genres, Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12"
          >
            {/* Genres */}
            {manga.genres && manga.genres.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-4">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {manga.genres.map((genre: string) => (
                    <span
                      key={genre}
                      className="px-3 py-1 rounded-full backdrop-blur-md bg-brand-pink/20 border border-brand-pink/50 text-brand-pink text-sm font-medium"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {manga.tags && manga.tags.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {manga.tags.slice(0, 15).map((tag: any) => (
                    <span
                      key={tag.name}
                      className="px-2 py-1 rounded-full backdrop-blur-md bg-white/10 border border-white/20 text-white/70 text-xs font-medium"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Characters */}
          {manga.characters?.edges && manga.characters.edges.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Characters</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {manga.characters.edges.map((edge: any, index: number) => (
                  <motion.div
                    key={edge.node.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.05 * index }}
                    className="text-center group cursor-pointer"
                  >
                    <div className="relative h-40 rounded-lg overflow-hidden mb-2 border border-white/10 group-hover:border-brand-pink/50 transition-colors">
                      <Image
                        src={edge.node.image?.large || "/hero-image.jpg"}
                        alt={edge.node.name?.full}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <p className="text-white/80 text-xs font-medium line-clamp-2">
                      {edge.node.name?.full}
                    </p>
                    <p className="text-white/40 text-xs">{edge.role}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Related Manga */}
          {manga.relations?.edges && manga.relations.edges.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Related</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {manga.relations.edges.slice(0, 8).map((edge: any) => (
                  <Link
                    key={edge.node.id}
                    href={`/${edge.node.type === "ANIME" ? "anime" : "manga"}/${edge.node.id}`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="group cursor-pointer"
                    >
                      <div className="relative h-32 rounded-lg overflow-hidden mb-2 border border-white/10 group-hover:border-brand-pink/50 transition-colors">
                        <Image
                          src={edge.node.coverImage?.large || "/hero-image.jpg"}
                          alt={edge.node.title?.romaji}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <p className="text-white/80 text-xs font-medium line-clamp-2 group-hover:text-brand-pink transition-colors">
                        {edge.node.title?.english || edge.node.title?.romaji}
                      </p>
                      <p className="text-white/40 text-xs mt-1">
                        {edge.relationType.replace(/_/g, " ")}
                      </p>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* Recommendations */}
          {manga.recommendations?.nodes && manga.recommendations.nodes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                Similar Manga
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {manga.recommendations.nodes.slice(0, 8).map((rec: any) => (
                  <Link
                    key={rec.mediaRecommendation?.id}
                    href={`/${rec.mediaRecommendation?.type === "ANIME" ? "anime" : "manga"}/${rec.mediaRecommendation?.id}`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="group cursor-pointer"
                    >
                      <div className="relative h-32 rounded-lg overflow-hidden mb-2 border border-white/10 group-hover:border-brand-pink/50 transition-colors">
                        <Image
                          src={rec.mediaRecommendation?.coverImage?.large || "/hero-image.jpg"}
                          alt={
                            rec.mediaRecommendation?.title?.romaji
                          }
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <p className="text-white/80 text-xs font-medium line-clamp-2 group-hover:text-brand-pink transition-colors">
                        {rec.mediaRecommendation?.title?.english ||
                          rec.mediaRecommendation?.title?.romaji}
                      </p>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
