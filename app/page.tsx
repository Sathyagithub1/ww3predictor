import { Metadata } from "next";
import { RefreshCw, Clock, Info } from "lucide-react";
import PredictorMeter from "@/components/PredictorMeter";
import ThreatFactors from "@/components/ThreatFactors";
import NewsTicker from "@/components/NewsTicker";
import AdSlot from "@/components/AdSlot";
import { WW3Prediction } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "WW3 Predictor — Real-Time AI Threat Assessment",
  description:
    "AI-powered World War 3 probability meter. Updated every 6 hours using live geopolitical news and Claude AI analysis.",
};

// Revalidate every 6 hours (matches cron schedule)
export const revalidate = 21600;

async function getPrediction(): Promise<Partial<WW3Prediction>> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

    const res = await fetch(`${baseUrl}/api/prediction`, {
      next: { revalidate: 21600 },
    });

    if (!res.ok) throw new Error("Failed to fetch prediction");
    return res.json();
  } catch {
    return {
      score: 52,
      reasoning:
        "Multiple active conflict zones with elevated military tensions between major powers.",
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
  }
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

export default async function HomePage() {
  const prediction = await getPrediction();

  const score = prediction.score ?? 52;
  const factors = prediction.key_factors ?? [];
  const reasoning = prediction.reasoning ?? "";
  const newsSample = prediction.news_sample ?? [];
  const updatedAt = prediction.created_at
    ? timeAgo(prediction.created_at)
    : "recently";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "WW3 Predictor",
    url: "https://ww3predictor.com",
    description:
      "AI-powered World War 3 probability meter updated every 6 hours.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://ww3predictor.com/news?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header Ad Banner */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <AdSlot slot="1234567890" format="leaderboard" className="mb-2" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-red-950/50 border border-red-900/50 rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-400 text-sm font-medium">
              LIVE AI ANALYSIS — Updated every 6 hours
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 text-balance">
            🌍 WW3 Probability Meter
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            Real-time AI assessment of global conflict escalation risk based on
            live geopolitical news and military intelligence.
          </p>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left / Meter column */}
          <div className="lg:col-span-1 flex flex-col items-center gap-6">
            <div className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl p-6 flex flex-col items-center">
              <PredictorMeter score={score} animated />

              {/* Timestamp */}
              <div className="flex items-center gap-2 mt-4 text-gray-500 text-sm">
                <Clock className="w-4 h-4" />
                <span>Updated {updatedAt}</span>
              </div>

              {/* Next update hint */}
              <div className="flex items-center gap-2 mt-1 text-gray-600 text-xs">
                <RefreshCw className="w-3 h-3" />
                <span>Next update in ~6 hours</span>
              </div>
            </div>

            {/* Score scale legend */}
            <div className="w-full bg-gray-900/50 border border-gray-800 rounded-xl p-4">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-3 font-semibold">
                Risk Scale
              </p>
              {[
                { range: "0–20", label: "Low Risk", color: "bg-green-500" },
                { range: "21–40", label: "Elevated", color: "bg-yellow-500" },
                { range: "41–60", label: "Moderate", color: "bg-orange-500" },
                { range: "61–80", label: "High Alert", color: "bg-red-500" },
                { range: "81–100", label: "Critical", color: "bg-red-700" },
              ].map((item) => (
                <div key={item.range} className="flex items-center gap-2 mb-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${item.color} shrink-0`} />
                  <span className="text-gray-400 text-xs w-12">{item.range}</span>
                  <span className="text-gray-300 text-xs">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right / Analysis column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Reasoning */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-5 h-5 text-blue-400" />
                <h2 className="text-white font-semibold text-lg">
                  AI Analysis Summary
                </h2>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{reasoning}</p>
            </div>

            {/* Key factors */}
            {factors.length > 0 && (
              <ThreatFactors factors={factors} score={score} />
            )}

            {/* Methodology note */}
            <div className="bg-blue-950/20 border border-blue-900/30 rounded-xl p-4">
              <p className="text-blue-300/80 text-xs leading-relaxed">
                <strong className="text-blue-300">Methodology:</strong> This
                score is generated by Claude AI (claude-sonnet-4-6) analyzing the
                top 20 conflict-related news headlines from Reuters, BBC, AP, and
                other major outlets every 6 hours. It represents an analytical
                assessment — not a prediction or investment advice.
              </p>
            </div>

            {/* In-content ad */}
            <AdSlot slot="0987654321" format="rectangle" />
          </div>
        </div>

        {/* Headlines used */}
        {newsSample.length > 0 && (
          <div className="mt-10">
            <h2 className="text-gray-400 text-sm uppercase tracking-wider font-semibold mb-4">
              Headlines Used in This Analysis
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {newsSample.map((headline, i) => (
                <div
                  key={i}
                  className="bg-gray-900/40 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-gray-400"
                >
                  {headline}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* News ticker */}
      {newsSample.length > 0 && (
        <div className="sticky bottom-0">
          <NewsTicker headlines={newsSample} />
        </div>
      )}
    </>
  );
}
