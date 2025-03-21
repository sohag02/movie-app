"use client";
import { useState } from "react";
import Image from "next/image";
import { MediaType, type Movie, type SearchResponse, type Media } from "@/lib/interfaces";
import { BookmarkCheck, Search, X } from "lucide-react";
import { Bookmark } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Input } from "./ui/input";
import { useWatchlist } from "@/components/WatchlistProvider";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Media[]>([]);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setQuery(query);

    if (query.length > 2) {
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
    } else {
      setResults([]);
    }
  };

  const toggleSearchBar = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const handleFocus = () => {
    setIsFocused(true);    
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsFocused(false);
      setQuery("");
      setResults([]);
      setIsSearchVisible(!isSearchVisible);
    }
  };

  const clearSearch = () => {
    setIsFocused(false);
    setQuery("");
    setResults([]);
    setIsSearchVisible(false);
  };

  const getDetailsLink = (mediaType: Movie["media_type"], id: number) => {
    if (mediaType === MediaType.Movie) {
      return `/movie/${id}`;
    } else if (mediaType === MediaType.TV) {
      return `/tv/${id}`;
    } else {
      return `/`;
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="flex items-center">
        {!isSearchVisible && (
          <button
            onClick={toggleSearchBar}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <Search className="h-6 w-6" />
          </button>
        )}
        {isSearchVisible && (
          <div className="absolute inset-0">
            <div className="flex w-full items-center justify-center">
              <Input
                type="text"
                value={query}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="w-full md:w-1/2 rounded-md border border-gray-300 px-4 py-2"
                placeholder="Search for a movie..."
                autoFocus
              />
              <button
                onClick={toggleSearchBar}
                className="p-2 text-gray-500 hover:text-gray-700 md:hidden"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            {isFocused && results.length > 0 ? (
              <div className="flex justify-center w-full">
                <SearchResult />
              </div>
            ) : ('')}
          </div>
        )}
      </div>
    </div>
  );
  function SearchResult() {
    return (
      <ul className="absolute z-10 mt-1 max-h-auto w-full md:w-1/2 overflow-y-auto rounded-md border bg-background">
        {results.map((movie) => (
          <Card
            key={movie.id}
            className="relative rounded-none flex flex-row border-b border-gray-200 p-2 last:border-none"
            onMouseDown={(e) => e.preventDefault()} // Prevent input blur
          >
            <Link
              href={getDetailsLink(movie.media_type, movie.id)}
              className="flex flex-grow"
              passHref
              onClick={clearSearch} // Clear search on click
            >
              <Image
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.name ?? "No Title"}
                width={50}
                height={75}
                className="rounded-sm"
              />
              <div className="ml-3">
                <p className="font-semibold">{movie.title ?? movie.name}</p>
                <p className="text-gray-500">
                  {new Date(
                    movie.first_air_date ?? movie.release_date!,
                  ).toLocaleDateString()}
                </p>
                <p className="text-gray-500">
                  {movie.vote_average?.toFixed(1)}
                </p>
              </div>
            </Link>
            {isInWatchlist(movie.id ?? 0) ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromWatchlist(movie.id).catch((err) => {
                    console.error(err);
                    console.log("Something went wrong in catch");
                  });
                }}
                className="absolute right-2 top-2 rounded-full bg-gray-200 p-1 text-gray-500 hover:bg-gray-300"
              >
                <BookmarkCheck className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToWatchlist(movie.id, movie.media_type).catch((err) => {
                    console.error(err);
                    console.log("Something went wrong in catch");
                  });
                }}
                className="absolute right-2 top-2 rounded-full bg-gray-200 p-1 text-gray-500 hover:bg-gray-300"
              >
                <Bookmark className="h-4 w-4" />
              </button>
            )}
          </Card>
        ))}
      </ul>
    );
  }
};

export default SearchBar;