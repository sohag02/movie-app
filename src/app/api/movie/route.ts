import { type NextRequest, NextResponse } from "next/server";
import { getMovie } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({
      error: "No movie ID provided",
    });
  }

  const data = await getMovie(parseInt(id));
  return NextResponse.json(data);
}
