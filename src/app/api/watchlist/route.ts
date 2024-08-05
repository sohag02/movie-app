import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/server/db";
import { Movies } from "@/server/db/schema";
import { eq, desc, and } from "drizzle-orm";

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const movie_id = searchParams.get("movie_id");

  if (!movie_id) {
    return NextResponse.json({
      success: false,
      message: "No movie ID provided",
    });
  }

  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({
      success: false,
      message: "User not logged in",
    });
  }

  // Check if the movie is already in the watchlist
  const isInWatchlist = await db.query.Movies.findFirst({
    where: and(
      eq(Movies.user_id, userId),
      eq(Movies.movie_id, parseInt(movie_id)),
    ),
  });

  if (isInWatchlist) {
    return NextResponse.json({
      success: false,
      message: "Movie already in watchlist",
    });
  }

  const res = await db
    .insert(Movies)
    .values({
      user_id: userId,
      movie_id: parseInt(movie_id),
    })
    .onConflictDoNothing({
      target: [Movies.user_id, Movies.movie_id],
    })
    .returning({
      id: Movies.id,
    });

  return NextResponse.json({
    success: true,
    message: res,
  });
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const movie_id = searchParams.get("movie_id");

  if (!movie_id) {
    return NextResponse.json({
      success: false,
      message: "No movie ID provided",
    });
  }

  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({
      success: false,
      message: "User not logged in",
    });
  }

  const res = await db
    .delete(Movies)
    .where(
      and(eq(Movies.user_id, userId), eq(Movies.movie_id, parseInt(movie_id))),
    );

  return NextResponse.json({
    success: true,
    message: res,
  });
}

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({
      message: "User not logged in",
    });
  }

  const watchlist = await db.query.Movies.findMany({
    where: eq(Movies.user_id, userId),
    orderBy: desc(Movies.added_at),
  });

  return NextResponse.json({
    watchlist,
  });
}
