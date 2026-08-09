"use client";
import PikoLoader from "@/components/PikoLoader";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getMediaDetails } from "@/utils/anilist/client";
import { motion } from "framer-motion";
import { Star, Calendar, Play, Tv } from "lucide-react";
import CommentSection from "@/components/CommentSection";
import MediaActions from "@/components/MediaActions";

interface AnimeDetailClientProps {
  id: number;
}

export function AnimeDetailClient({ id }: AnimeDetailClientProps) {
  const [anime, setAnime] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [crunchyrollUrl, setCrunchyrollUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await getMediaDetails(id);
        setAnime(data);
      } catch (err) {
        console.error("Failed to fetch anime details:", err);
        setError("Failed to load anime details");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  useEffect(() => {
    if (!anime) return;
    const title = anime.title?.english || anime.title?.romaji;
    if (!title) return;
    fetch(`/api/crunchyroll?title=${encodeURIComponent(title)}`)
      .then((r) => r.json())
      .then((data) => { if (data.url) setCrunchyrollUrl(data.url); })
      .catch(() => {});
  }, [anime]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        <PikoLoader text="Loading anime details" />
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || "Anime not found"}</p>
          <Link href="/anime" className="text-brand-pink hover:underline">Back to browse</Link>
        </div>
      </div>
    );
  }

  const title = anime.title?.english || anime.title?.romaji || "Untitled";
  const bannerImage = anime.bannerImage;
  const coverImage = anime.coverImage?.extraLarge || anime.coverImage?.large || "/hero-image.jpg";

  const formatDate = (date: any) => {
    if (!date) return null;
    return new Date(date.year, date.month - 1, date.day).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#0B0F19]">
      {bannerImage && (
        <div className="fixed inset-0 h-96 z-0 overflow-hidden">
          <Image src={bannerImage} alt={title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0B0F19]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19] via-transparent to-[#0B0F19]" />
          <div className="absolute inset-0 backdrop-blur-sm" />
        </div>
      )}

      <div className="relative z-10 pt-20 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Top grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6"
          >
            {/* Cover */}
            <div className="md:col-span-1">
              <div className="relative h-96 rounded-xl overflow-hidden shadow-2xl">
                <Image src={coverImage} alt={title} fill className="object-cover" />
                {anime.averageScore && (
                  <div className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-md bg-white/20 border border-white/30">
                    <Star size={18} className="text-brand-pink fill-brand-pink" />
                    <span className="text-white font-bold text-lg">{anime.averageScore / 10}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="md:col-span-2 flex flex-col justify-between">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">{title}</h1>
                {anime.title?.native && <p className="text-white/60 mb-4">{anime.title.native}</p>}

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {anime.episodes && (
                    <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-lg p-3">
                      <p className="text-white/60 text-sm">Episodes</p>
                      <p className="text-white text-lg font-bold">{anime.episodes}</p>
                    </div>
                  )}
                  {anime.status && (
                    <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-lg p-3">
                      <p className="text-white/60 text-sm">Status</p>
                      <p className="text-white text-lg font-bold">{anime.status.replace(/_/g, " ")}</p>
                    </div>
                  )}
                  {anime.format && (
                    <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-lg p-3">
                      <p className="text-white/60 text-sm">Format</p>
                      <p className="text-white text-lg font-bold">{anime.format}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 mb-6">
                  {anime.startDate && (
                    <div className="flex items-center gap-2 text-white/80">
                      <Calendar size={18} className="text-brand-pink" />
                      <span>{formatDate(anime.startDate)}</span>
                    </div>
                  )}
                  {anime.endDate && anime.status === "FINISHED" && (
                    <div className="flex items-center gap-2 text-white/80">
                      <Calendar size={18} className="text-brand-pink" />
                      <span>{formatDate(anime.endDate)}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  {anime.trailer?.id && (
                    <motion.a
                      href={`https://www.youtube.com/watch?v=${anime.trailer.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-pink/30 border border-brand-pink/50 text-brand-pink hover:bg-brand-pink/50 transition-all font-medium"
                    >
                      <Play size={18} /> Watch Trailer
                    </motion.a>
                  )}
                  <motion.a
                    href={crunchyrollUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: crunchyrollUrl ? 1.05 : 1 }}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all font-medium ${
                      crunchyrollUrl
                        ? "bg-orange-500 text-white hover:bg-orange-400 cursor-pointer shadow-lg shadow-orange-500/30"
                        : "bg-orange-500/40 text-white/60 cursor-wait"
                    }`}
                  >
                    <Tv size={18} />
                    {crunchyrollUrl ? "Watch on Crunchyroll" : "Finding anime..."}
                  </motion.a>
                </div>

                {/* Like + Watchlist */}
                <MediaActions mediaId={id} mediaType="ANIME" title={title} coverImage={coverImage} />
              </motion.div>
            </div>
          </motion.div>

          {/* Synopsis */}
          {anime.description && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">Synopsis</h2>
              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="text-white/80 leading-relaxed prose prose-invert max-w-none text-sm" dangerouslySetInnerHTML={{ __html: anime.description }} />
              </div>
            </motion.div>
          )}

          {/* Studios, Genres, Country */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {anime.studios?.nodes && anime.studios.nodes.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Studios</h3>
                <div className="space-y-2">
                  {anime.studios.nodes.map((studio: any) => (
                    <Link key={studio.id} href={`/studio/${studio.id}`} className="block p-3 rounded-lg backdrop-blur-md bg-white/5 border border-white/10 text-white/80 hover:text-brand-pink hover:border-brand-pink/50 transition-colors">
                      {studio.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {anime.genres && anime.genres.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {anime.genres.map((genre: string) => (
                    <span key={genre} className="px-3 py-1 rounded-full backdrop-blur-md bg-brand-pink/20 border border-brand-pink/50 text-brand-pink text-sm font-medium">{genre}</span>
                  ))}
                </div>
              </div>
            )}
            {anime.countryOfOrigin && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Country</h3>
                <p className="p-3 rounded-lg backdrop-blur-md bg-white/5 border border-white/10 text-white/80">{anime.countryOfOrigin}</p>
              </div>
            )}
          </motion.div>

          {/* Characters */}
          {anime.characters?.edges && anime.characters.edges.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Characters</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {anime.characters.edges.map((edge: any, index: number) => (
                  <motion.div key={edge.node.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: 0.05 * index }} className="text-center group cursor-pointer">
                    <div className="relative h-40 rounded-lg overflow-hidden mb-2 border border-white/10 group-hover:border-brand-pink/50 transition-colors">
                      <Image src={edge.node.image?.large || "/hero-image.jpg"} alt={edge.node.name?.full} fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <p className="text-white/80 text-xs font-medium line-clamp-2">{edge.node.name?.full}</p>
                    <p className="text-white/40 text-xs">{edge.role}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Related */}
          {anime.relations?.edges && anime.relations.edges.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }} className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Related</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {anime.relations.edges.slice(0, 8).map((edge: any) => (
                  <Link key={edge.node.id} href={`/${edge.node.type === "ANIME" ? "anime" : "manga"}/${edge.node.id}`}>
                    <motion.div whileHover={{ scale: 1.05 }} className="group cursor-pointer">
                      <div className="relative h-32 rounded-lg overflow-hidden mb-2 border border-white/10 group-hover:border-brand-pink/50 transition-colors">
                        <Image src={edge.node.coverImage?.large || "/hero-image.jpg"} alt={edge.node.title?.romaji} fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <p className="text-white/80 text-xs font-medium line-clamp-2 group-hover:text-brand-pink transition-colors">{edge.node.title?.english || edge.node.title?.romaji}</p>
                      <p className="text-white/40 text-xs mt-1">{edge.relationType.replace(/_/g, " ")}</p>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* Recommendations */}
          {anime.recommendations?.nodes && anime.recommendations.nodes.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }} className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Similar Anime</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {anime.recommendations.nodes.slice(0, 8).map((rec: any) => (
                  <Link key={rec.mediaRecommendation?.id} href={`/${rec.mediaRecommendation?.type === "ANIME" ? "anime" : "manga"}/${rec.mediaRecommendation?.id}`}>
                    <motion.div whileHover={{ scale: 1.05 }} className="group cursor-pointer">
                      <div className="relative h-32 rounded-lg overflow-hidden mb-2 border border-white/10 group-hover:border-brand-pink/50 transition-colors">
                        <Image src={rec.mediaRecommendation?.coverImage?.large || "/hero-image.jpg"} alt={rec.mediaRecommendation?.title?.romaji} fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <p className="text-white/80 text-xs font-medium line-clamp-2 group-hover:text-brand-pink transition-colors">{rec.mediaRecommendation?.title?.english || rec.mediaRecommendation?.title?.romaji}</p>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* Comments */}
          <CommentSection mediaId={id} mediaType="ANIME" />

        </div>
      </div>
    </div>
  );
}
