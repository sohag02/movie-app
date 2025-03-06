import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/server/db";
import { EpisodeWatchlist } from "@/server/db/schema";
import { eq, desc, and } from "drizzle-orm";

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const series_id = searchParams.get("series_id");
  const episode_number = searchParams.get("episode_number");
  const season_number = searchParams.get("season_number");

  if (!series_id || !episode_number || !season_number) {
    return NextResponse.json({
      success: false,
      message: "No series ID, episode number, or season number provided",
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
    .insert(EpisodeWatchlist)
    .values({
      user_id: userId,
      series_id: parseInt(series_id),
      episode_number: parseInt(episode_number),
      season_number: parseInt(season_number),
    })
    .onConflictDoNothing({
      target: [EpisodeWatchlist.user_id, EpisodeWatchlist.series_id, EpisodeWatchlist.episode_number, EpisodeWatchlist.season_number],
    })
    .returning({
      id: EpisodeWatchlist.id,
    });

  return NextResponse.json({
    success: true,
    message: res,
  });
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const series_id = searchParams.get("series_id");
  const episode_number = searchParams.get("episode_number");
  const season_number = searchParams.get("season_number");

  if (!series_id || !episode_number || !season_number) {
    return NextResponse.json({
      success: false,
      message: "No series ID or episode number provided",
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
    .delete(EpisodeWatchlist)
    .where(
      and(
        eq(EpisodeWatchlist.user_id, userId),
        eq(EpisodeWatchlist.series_id, parseInt(series_id)),
        eq(EpisodeWatchlist.episode_number, parseInt(episode_number)),
        eq(EpisodeWatchlist.season_number, parseInt(season_number)),
      ),
    );

  return NextResponse.json({
    success: true,
    message: res,
  });
}

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
  const series_id = searchParams.get("series_id");
	
	if (!series_id) {
		return NextResponse.json({
			message: "No series ID provided",
		});
	}
	
  const { userId } = auth();
	
  if (!userId) {
    return NextResponse.json({
      message: "User not logged in",
    });
  }

  const watchlist = await db.query.EpisodeWatchlist.findMany({
    where: and(
      eq(EpisodeWatchlist.user_id, userId),
      eq(EpisodeWatchlist.series_id, parseInt(series_id)),
    ),
    orderBy: desc(EpisodeWatchlist.added_at),
  });

  return NextResponse.json(
    watchlist,
  );
}