import { type NextRequest, NextResponse } from "next/server";
import { getSimilarMovies, getSimilarSeries } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id"); // eg: /api/similar?id=123&type=movie
  const type = searchParams.get("type"); // eg: /api/similar?id=123&type=tv
  
	// type validation
	if (type !== "movie" && type !== "tv") {
		return NextResponse.json({
			error: "Invalid type",
		});
	}

	// id validation
	if (!id) {
		return NextResponse.json({
			error: "No id provided",
		});
	}

	// get data
	if (type === "movie") {
		const data = await getSimilarMovies(parseInt(id));
		return NextResponse.json(data);
	} else if (type === "tv") {
		const data = await getSimilarSeries(parseInt(id));
		return NextResponse.json(data);
	}

}