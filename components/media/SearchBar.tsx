"use client";

import { useEffect, useState, useRef } from "react";
import { Search, X } from "lucide-react";
import { motion } from "framer-motion";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({
  onSearch,
  placeholder = "Search anime...",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      onSearch(query);
    }, 300); // 300ms debounce

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query, onSearch]);

  const handleClear = () => {
    setQuery("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <div className="relative group">
        {/* Background Glow */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-pink/20 to-blue-500/20 opacity-0 group-focus-within:opacity-100 blur-lg transition-opacity duration-300 pointer-events-none" />

        {/* Input Container */}
        <div className="relative backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4 focus-within:border-brand-pink/50 focus-within:bg-white/10 transition-all duration-300">
          <div className="flex items-center gap-3">
            <Search size={20} className="text-brand-pink/70 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="flex-1 bg-transparent outline-none text-white placeholder:text-white/40 text-base"
            />
            {query && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={handleClear}
                className="text-white/50 hover:text-white/80 transition-colors flex-shrink-0"
              >
                <X size={18} />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
