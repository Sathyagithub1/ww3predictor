import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { analyzeThreatLevel } from "@/lib/claude";
import { fetchConflictNews } from "@/lib/newsapi";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Vercel Pro allows up to 300s; free tier 60s

export async function POST(request: NextRequest) {
  // Protect endpoint with CRON_SECRET
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // Vercel Cron sends the secret as Bearer token
  // Manual calls can also pass it as x-cron-secret header
  const manualSecret = request.headers.get("x-cron-secret");

  const isAuthorized =
    (authHeader === `Bearer ${cronSecret}`) ||
    (manualSecret === cronSecret);

  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Fetch headlines
    const articles = await fetchConflictNews("all", 1, 20);
    const headlines = articles.map((a) => a.title);

    if (headlines.length === 0) {
      return NextResponse.json(
        { error: "No headlines fetched from NewsAPI" },
        { status: 502 }
      );
    }

    // 2. Analyze with Claude
    const prediction = await analyzeThreatLevel(headlines);

    // 3. Store in Supabase
    const db = createServerClient();
    const { data, error } = await db
      .from("ww3_predictions")
      .insert({
        score: prediction.score,
        reasoning: prediction.reasoning,
        key_factors: prediction.factors,
        news_sample: headlines.slice(0, 5),
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Database insert failed", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      prediction: data,
    });
  } catch (err) {
    console.error("update-prediction error:", err);
    return NextResponse.json(
      { error: "Internal server error", details: String(err) },
      { status: 500 }
    );
  }
}

// Allow GET for manual testing in browser (still requires secret as query param)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Delegate to POST logic by creating a fake POST request
  const fakeRequest = new NextRequest(request.url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${process.env.CRON_SECRET}`,
    },
  });

  return POST(fakeRequest);
}
