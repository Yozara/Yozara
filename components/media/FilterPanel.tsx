"use client";

import { useState } from "react";
import { ChevronDown, X } from "lucide-react";

interface FilterPanelProps {
  genres: string[];
  onFilterChange: (filters: {
    genre?: string[];
    status?: string;
    format?: string[];
    sort?: string;
  }) => void;
}

const STATUSES = ["FINISHED", "RELEASING", "NOT_YET_RELEASED", "CANCELLED"];
const FORMATS = {
  ANIME: ["TV", "MOVIE", "TV_SHORT", "SPECIAL", "OVA", "ONA"],
  MANGA: ["MANGA", "LIGHT_NOVEL", "ONE_SHOT"],
};
const SORT_OPTIONS = [
  { value: "POPULARITY_DESC", label: "Most Popular" },
  { value: "SCORE_DESC", label: "Highest Rated" },
  { value: "TRENDING_DESC", label: "Trending Now" },
  { value: "UPDATED_TIME_DESC", label: "Recently Updated" },
  { value: "START_DATE_DESC", label: "Newest" },
];

export function FilterPanel({
  genres,
  onFilterChange,
}: FilterPanelProps) {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState("POPULARITY_DESC");
  const [isOpen, setIsOpen] = useState(false);

  const handleGenreToggle = (genre: string) => {
    const updated = selectedGenres.includes(genre)
      ? selectedGenres.filter((g) => g !== genre)
      : [...selectedGenres, genre];
    setSelectedGenres(updated);
    onFilterChange({ genre: updated.length > 0 ? updated : undefined });
  };

  const handleStatusChange = (status: string) => {
    const updated = selectedStatus === status ? "" : status;
    setSelectedStatus(updated);
    onFilterChange({ status: updated || undefined });
  };

  const handleFormatToggle = (format: string) => {
    const updated = selectedFormats.includes(format)
      ? selectedFormats.filter((f) => f !== format)
      : [...selectedFormats, format];
    setSelectedFormats(updated);
    onFilterChange({ format: updated.length > 0 ? updated : undefined });
  };

  const handleSortChange = (sort: string) => {
    setSelectedSort(sort);
    onFilterChange({ sort });
  };

  const hasActiveFilters =
    selectedGenres.length > 0 ||
    selectedStatus ||
    selectedFormats.length > 0;

  const resetFilters = () => {
    setSelectedGenres([]);
    setSelectedStatus("");
    setSelectedFormats([]);
    setSelectedSort("POPULARITY_DESC");
    onFilterChange({});
  };

  return (
    <div className="space-y-4">
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full md:hidden flex items-center justify-between px-4 py-3 rounded-lg backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white font-medium"
      >
        <span>Filters {hasActiveFilters && `(${selectedGenres.length + (selectedStatus ? 1 : 0) + selectedFormats.length})`}</span>
        <ChevronDown
          size={20}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Filter Panel */}
      <div
        className={`space-y-6 p-4 rounded-lg backdrop-blur-md bg-white/5 border border-white/10 ${
          isOpen ? "block" : "hidden md:block"
        }`}
      >
        {/* Sort */}
        <div>
          <label className="block text-white font-semibold text-sm mb-2">
            Sort By
          </label>
          <div className="space-y-2">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
                  selectedSort === option.value
                    ? "bg-brand-pink/30 border border-brand-pink/50 text-brand-pink font-medium"
                    : "hover:bg-white/10 text-white/80"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-white font-semibold text-sm mb-2">
            Status
          </label>
          <div className="space-y-2">
            {STATUSES.map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
                  selectedStatus === status
                    ? "bg-brand-pink/30 border border-brand-pink/50 text-brand-pink font-medium"
                    : "hover:bg-white/10 text-white/80"
                }`}
              >
                {status.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Genres */}
        <div>
          <label className="block text-white font-semibold text-sm mb-2">
            Genres
          </label>
          <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-2">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => handleGenreToggle(genre)}
                className={`px-3 py-2 rounded-lg transition-all text-sm text-center ${
                  selectedGenres.includes(genre)
                    ? "bg-brand-pink/30 border border-brand-pink/50 text-brand-pink font-medium"
                    : "hover:bg-white/10 text-white/80"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all border border-white/10"
          >
            <X size={16} />
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}
