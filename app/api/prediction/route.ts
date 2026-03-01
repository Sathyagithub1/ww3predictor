import { NextResponse } from "next/server";
import { supabase, WW3Prediction } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data, error } = await supabase
    .from("ww3_predictions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    // Return a seeded fallback so the page never shows an error on first run
    const fallback: Partial<WW3Prediction> = {
      score: 52,
      reasoning:
        "Multiple active conflict zones with elevated military tensions between major powers. Nuclear sabre-rattling continues but diplomatic channels remain open.",
      key_factors: [
        "Russia-Ukraine conflict ongoing with no diplomatic resolution in sight",
        "US-China tensions over Taiwan Strait military exercises",
        "Iran nuclear enrichment program approaching weapons-grade threshold",
        "NATO expanding eastward deployments in response to Russian threat",
        "North Korea ICBM tests increasing in frequency and range",
      ],
      news_sample: [],
      created_at: new Date().toISOString(),
    };
    return NextResponse.json(fallback);
  }

  return NextResponse.json(data);
}
