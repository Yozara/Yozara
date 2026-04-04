"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { searchMedia } from "@/utils/anilist/client";
import { MediaCard } from "@/components/media/MediaCard";
import { SearchBar } from "@/components/media/SearchBar";
import { FilterPanel } from "@/components/media/FilterPanel";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";

const ANIME_GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Mahou Shoujo",
  "Mecha",
  "Music",
  "Mystery",
  "Psychological",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
  "Thriller",
];

interface SearchFilters {
  genre?: string[];
  status?: string;
  format?: string[];
  sort?: string;
}

export function AnimeSearchClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"));
  const [filters, setFilters] = useState<SearchFilters>({
    sort: "POPULARITY_DESC",
  });
  const [results, setResults] = useState<any[]>([]);
  const [pageInfo, setPageInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch anime based on search and filters
  const fetchAnime = useCallback(
    async (searchQuery: string, pageNum: number) => {
      try {
        setLoading(true);
        setError(null);

        const response = await searchMedia("ANIME", {
          search: searchQuery || undefined,
          genre: filters.genre,
          status: filters.status as any,
          format: filters.format,
          page: pageNum,
          sort: filters.sort || "POPULARITY_DESC",
        });

        setResults(response.Page?.media || []);
        setPageInfo(response.Page?.pageInfo);
      } catch (err) {
        console.error("Search failed:", err);
        setError("Failed to load anime. Please try again.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  // Update URL when query or page changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (page > 1) params.set("page", page.toString());
    router.push(`/anime?${params.toString()}`, { scroll: false });
  }, [query, page, router]);

  // Fetch anime when query, page, or filters change
  useEffect(() => {
    fetchAnime(query, page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [query, page, filters, fetchAnime]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setPage(1);
  };

  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0F19] via-[#0F1428] to-[#0B0F19]">
      {/* Hero Section with Background */}
      <div className="relative pt-20 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-pink/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
              Discover Anime
            </h1>
            <p className="text-white/60">
              Explore thousands of anime series and find your next favorite
            </p>
          </motion.div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search by title, genre, studio..."
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Filters */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <FilterPanel
              genres={ANIME_GENRES}
              onFilterChange={handleFilterChange}
            />
          </motion.div>

          {/* Main Content - Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3"
          >
            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader className="w-12 h-12 text-brand-pink animate-spin mb-4" />
                <p className="text-white/60">Loading anime...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-20">
                <p className="text-red-400 mb-4">{error}</p>
                <button
                  onClick={() => fetchAnime(query, page)}
                  className="px-4 py-2 rounded-lg bg-brand-pink/30 border border-brand-pink/50 text-brand-pink hover:bg-brand-pink/50 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Results Grid */}
            {!loading && !error && results.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
                  {results.map((anime, index) => (
                    <motion.div
                      key={anime.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <MediaCard
                        id={anime.id}
                        title={anime.title?.english || anime.title?.romaji}
                        coverImage={anime.coverImage?.extraLarge || anime.coverImage?.large}
                        score={anime.averageScore}
                        type="ANIME"
                        format={anime.format}
                        year={anime.seasonYear}
                        genres={anime.genres || []}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {pageInfo && pageInfo.lastPage > 1 && (
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2 rounded-lg backdrop-blur-md bg-white/5 border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <div className="flex items-center gap-2">
                      <span className="text-white/80">
                        Page {page} of {pageInfo.lastPage}
                      </span>
                    </div>

                    <button
                      onClick={() => setPage((p) => Math.min(pageInfo.lastPage, p + 1))}
                      disabled={page === pageInfo.lastPage}
                      className="p-2 rounded-lg backdrop-blur-md bg-white/5 border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Empty State */}
            {!loading && !error && results.length === 0 && (
              <div className="text-center py-20">
                <p className="text-white/60 mb-4">
                  {query
                    ? `No anime found for "${query}". Try a different search.`
                    : "No anime found. Try adjusting your filters."}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
