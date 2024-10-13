import { type NextRequest, NextResponse } from "next/server";
import { getEpisodes } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");
	const season = searchParams.get("season"); // eg: /api/season?id=123&season=1

	if (!id || !season) {
		return NextResponse.json({
			error: "No movie ID or season provided",
		});
	}

  const data = await getEpisodes(parseInt(id), parseInt(season));
  return NextResponse.json(data);

}