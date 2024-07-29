import { auth } from "@clerk/nextjs/server";
import { WatchlistCover } from "@/components/watchlistCover";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MovieCard } from "@/components/movieCard";
import { getImage, getMovie } from "@/lib/tmdb";
import { type Movie } from "@/lib/interfaces";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { Movies } from "@/server/db/schema";
import Link from "next/link";
import { desc } from "drizzle-orm";

export default async function HomePage() {
  const { userId } = auth();

  const getMoviesDb = async () => {
    const res = await db.query.Movies.findMany({
        where: eq(Movies.user_id, userId?.toString() ?? ""),
        orderBy: desc(Movies.added_at),
    });

    // Map over the results, fetching additional data for each movie
    const enhancedMovies = await Promise.all(res.map(async (movie) => {
      const fetchedMovie = await getMovie(movie.movie_id);
      return fetchedMovie;
    }));

    return enhancedMovies;
  };

  const movies = await getMoviesDb();
  return (
    <div className="">
      {/* <Button>
        <Plus /> Create Watchlist
      </Button>
      <WatchlistCover id={1} name="My Watchlist" /> */}
      <div className="mx-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">

        {movies.map((movie) => (
          <Link href={`/movie/${movie.id}`} key={movie.id}>
            <MovieCard
              key={movie.id}
              name={movie.title??"Unknown"}
              release={movie.release_date?.toString() ?? "Unknown"}
              poster_url={getImage(movie.poster_path??"/3E53WEZJqP6aM84D8CckXx4pIHw.jpg")}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
