import { type NextRequest, NextResponse } from "next/server";
import { getSeries } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id"); // eg: /api/tv?id=123
  if (!id) {
    return NextResponse.json({
      error: "No movie ID provided",
    });
  }

  const data = await getSeries(parseInt(id));
  return NextResponse.json(data);
}
