import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/server/db";
import { Movies } from "@/server/db/schema";
import { eq, desc, and } from "drizzle-orm";

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const movie_id = searchParams.get("movie_id");
  const media_type = searchParams.get("media_type");

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
    .insert(Movies)
    .values({
      user_id: userId,
      movie_id: parseInt(movie_id),
      media_type: media_type,
    })
    .onConflictDoNothing({
      target: [Movies.user_id, Movies.movie_id, Movies.media_type],
    })
    .returning({
      id: Movies.id,
    });

  return NextResponse.json({
    success: true,
    message: res,
  });
}

export async function PUT(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const movie_id = searchParams.get("movie_id");
  const status = searchParams.get("status");

  if (!movie_id || !status) {
    return NextResponse.json({
      success: false,
      message: "No movie ID or status provided",
    });
  } else if (status !== "watched" && status !== "not watched") {
    return NextResponse.json({
      success: false,
      message: "Invalid status",
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
    .update(Movies)
    .set({ status: status })
    .where(
      and(
        eq(Movies.user_id, userId),
        eq(Movies.movie_id, parseInt(movie_id)),
      ),
    );

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