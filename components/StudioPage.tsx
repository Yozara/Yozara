"use client";
import PikoLoader from "@/components/PikoLoader";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Star, ChevronLeft} from "lucide-react";

const ANILIST_API_URL = "https://graphql.anilist.co";

const STUDIO_QUERY = `
query ($id: Int, $page: Int) {
  Studio(id: $id) {
    id
    name
    siteUrl
    media(page: $page, perPage: 24, sort: POPULARITY_DESC, isMain: true) {
      pageInfo {
        total
        currentPage
        hasNextPage
      }
      nodes {
        id
        type
        title {
          english
          romaji
        }
        coverImage {
          large
          extraLarge
        }
        averageScore
        seasonYear
        status
        episodes
        genres
      }
    }
  }
}
`;

type Anime = {
  id: number;
  type: string;
  title?: { english?: string; romaji?: string };
  coverImage?: { large?: string; extraLarge?: string };
  averageScore?: number;
  seasonYear?: number;
  status?: string;
  episodes?: number;
  genres?: string[];
};

export default function StudioPage() {
  const params = useParams();
  const id = Number(params.id);
  const [studioName, setStudioName] = useState("");
  const [anime, setAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchStudio = async (p: number, append = false) => {
    try {
      const res = await fetch(ANILIST_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ query: STUDIO_QUERY, variables: { id, page: p } }),
      });
      const data = await res.json();
      const studio = data?.data?.Studio;
      if (studio) {
        setStudioName(studio.name);
        setHasNextPage(studio.media.pageInfo.hasNextPage);
        if (append) {
          setAnime((prev) => [...prev, ...studio.media.nodes]);
        } else {
          setAnime(studio.media.nodes);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (id) fetchStudio(1);
  }, [id]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    setLoadingMore(true);
    fetchStudio(next, true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        
          <PikoLoader text="Loading Studio...." />
        
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link
          href="/anime"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
        >
          <ChevronLeft size={18} /> Back
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-2">{studioName}</h1>
          <p className="text-white/40 text-sm">{anime.length} titles</p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {anime.map((item, index) => {
            const title = item.title?.english || item.title?.romaji || "Untitled";
            const img = item.coverImage?.extraLarge || item.coverImage?.large || "/hero-image.jpg";
            return (
              <Link key={item.id} href={`/anime/${item.id}`}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="relative rounded-xl overflow-hidden border border-white/10 hover:border-brand-pink/50 transition-colors cursor-pointer group"
                >
                  <div className="relative h-[220px]">
                    <Image src={img} alt={title} fill className="object-cover group-hover:scale-110 transition-transform duration-300" sizes="160px" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                    {item.averageScore && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
                        <Star size={9} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-white text-[9px] font-bold">{(item.averageScore / 10).toFixed(1)}</span>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <p className="text-white text-[10px] font-semibold line-clamp-2">{title}</p>
                      {item.seasonYear && <p className="text-white/40 text-[9px] mt-0.5">{item.seasonYear}</p>}
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Load More */}
        {hasNextPage && (
          <div className="flex justify-center mt-10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={loadMore}
              disabled={loadingMore}
              className="flex items-center gap-2 px-8 py-3 rounded-full bg-brand-pink text-white font-bold hover:bg-brand-pink/80 transition-all"
            >
              {loadingMore ? <Loader size={16} className="animate-spin" /> : null}
              {loadingMore ? "Loading..." : "Load More"}
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}
