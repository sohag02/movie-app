"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { MediaType, type Movie, type SearchResponse, type Media } from "@/lib/interfaces";
import { BookmarkCheck, Search, X, ChevronRight } from "lucide-react";
import { Bookmark } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Input } from "./ui/input";
import { useWatchlist } from "@/components/WatchlistProvider";
import { getImage } from "@/lib/tmdb";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Media[]>([]);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const router = useRouter();
  
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setQuery(query);

    if (query.length > 2) {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?query=${query}`);
        const data = (await res.json()) as SearchResponse;
        const medias = (data.results ?? []).filter(
          (movie) => movie.media_type !== MediaType.Person,
        );
        
        if (!medias || medias.length === 0) {
          setResults([]);
          return;
        }
        
        setResults(medias.slice(0, 5) ?? []);
      } catch (error) {
        console.error("Error searching:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setResults([]);
    }
  };

  const toggleSearchBar = () => {
    setIsSearchVisible(!isSearchVisible);
    if (!isSearchVisible) {
      // Focus the input when the search bar is shown
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);    
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Only blur if we're not clicking within the results container
    if (
      !e.currentTarget.contains(e.relatedTarget as Node) && 
      !resultsContainerRef.current?.contains(e.relatedTarget as Node)
    ) {
      setIsFocused(false);
    }
  };

  const clearSearch = () => {
    setIsFocused(false);
    setQuery("");
    setResults([]);
    setIsSearchVisible(false);
  };

  const selectResult = (mediaType: string, id: number) => {
    clearSearch();
    if (mediaType === MediaType.Movie) {
      router.push(`/movie/${id}`);
    } else if (mediaType === MediaType.TV) {
      router.push(`/tv/${id}`);
    }
  };

  // Close search when ESC key is pressed
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearSearch();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <div className="relative">
      {!isSearchVisible && (
        <button
          onClick={toggleSearchBar}
          className="p-2 text-gray-400 hover:text-gray-200"
          aria-label="Open search"
        >
          <Search className="h-6 w-6" />
        </button>
      )}
      
      <AnimatePresence>
        {isSearchVisible && (
          <motion.div 
            className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-sm md:absolute md:inset-auto md:right-0 md:top-0 md:w-96 md:bg-transparent md:backdrop-blur-none"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-2 p-4">
              <Input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="flex-1 rounded-full border-0 bg-gray-800/90 px-4 py-2 focus-visible:ring-primary"
                placeholder="Search movies and TV shows..."
                autoComplete="off"
              />
              
              <button
                onClick={clearSearch}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:text-white"
                aria-label="Close search"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Search results */}
            <AnimatePresence>
              {(results.length > 0 || isLoading) && isFocused && (
                <motion.div
                  ref={resultsContainerRef}
                  className="flex-1 overflow-auto overscroll-contain p-2 md:absolute md:left-0 md:right-0 md:top-16 md:max-h-[80vh] md:rounded-lg md:bg-gray-900/95 md:shadow-xl"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center p-4">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-primary"></div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {results.map((result) => (
                        <motion.div
                          key={`${result.id}-${result.media_type}`}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => selectResult(result.media_type, result.id)}
                          className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-gray-800"
                        >
                          <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded-md">
                            {result.poster_path ? (
                              <Image
                                src={getImage(result.poster_path, "w92") || ""}
                                alt={result.title || result.name || ""}
                                width={48}
                                height={72}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-gray-700">
                                <span className="text-xs">No image</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 overflow-hidden">
                            <h3 className="truncate font-medium">
                              {result.title || result.name}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <span>
                                {result.media_type === MediaType.Movie ? "Movie" : "TV Show"}
                              </span>
                              <span>•</span>
                              <span>
                                {result.release_date?.substring(0, 4) || 
                                 result.first_air_date?.substring(0, 4) || 
                                 "Unknown"}
                              </span>
                            </div>
                            <p className="mt-1 line-clamp-1 text-xs text-gray-400">
                              {result.overview}
                            </p>
                          </div>
                          
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;