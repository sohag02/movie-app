import { type NextRequest, NextResponse } from "next/server";
import { searchMovie } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");
  if (!query) {
    return NextResponse.json({
      error: "No query provided",
    });
  }

  const data = await searchMovie(query);
  return NextResponse.json(data);
}
