import { NextRequest, NextResponse } from "next/server";
import { fetchConflictNews, NEWS_CATEGORIES } from "@/lib/newsapi";

export const revalidate = 3600; // ISR — cache 1 hour

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") ?? "all";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));

  if (!Object.keys(NEWS_CATEGORIES).includes(category)) {
    return NextResponse.json(
      { error: "Invalid category" },
      { status: 400 }
    );
  }

  try {
    const articles = await fetchConflictNews(category, page, 20);
    return NextResponse.json(
      { articles, category, page },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      }
    );
  } catch (err) {
    console.error("News API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch news", details: String(err) },
      { status: 502 }
    );
  }
}
