import { Metadata } from "next";
import { Suspense } from "react";
import NewsCard from "@/components/NewsCard";
import AdSlot from "@/components/AdSlot";
import { fetchConflictNews, NEWS_CATEGORIES, NewsArticle } from "@/lib/newsapi";

export const metadata: Metadata = {
  title: "Conflict News — Latest Global War & Military Updates",
  description:
    "Auto-aggregated conflict news from Reuters, BBC, AP. Covering Ukraine, Russia, Middle East, North Korea, China-Taiwan, and NATO developments.",
  keywords: [
    "war news",
    "military news",
    "Ukraine Russia",
    "Middle East conflict",
    "NATO news",
    "nuclear threat news",
  ],
};

export const dynamic = "force-dynamic";

const CATEGORY_LABELS: Record<string, string> = {
  all: "All Conflicts",
  ukraine: "Russia-Ukraine",
  "middle-east": "Middle East",
  "north-korea": "North Korea",
  "china-taiwan": "China-Taiwan",
  nuclear: "Nuclear",
  nato: "NATO",
};

interface PageProps {
  searchParams: { category?: string; page?: string };
}

async function NewsGrid({
  category,
  page,
}: {
  category: string;
  page: number;
}) {
  let articles: NewsArticle[] = [];
  let error: string | null = null;

  try {
    articles = await fetchConflictNews(category, page, 18);
  } catch (e) {
    error = String(e);
  }

  if (error) {
    return (
      <div className="col-span-full text-center py-16 text-gray-500">
        <p className="text-lg mb-2">Unable to load news at this time.</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="col-span-full text-center py-16 text-gray-500">
        <p>No articles found for this category.</p>
      </div>
    );
  }

  return (
    <>
      {articles.map((article, i) => (
        <>
          <NewsCard key={article.url} article={article} />
          {/* In-content ad every 6 cards */}
          {(i + 1) % 6 === 0 && (
            <div className="col-span-full" key={`ad-${i}`}>
              <AdSlot slot="1122334455" format="rectangle" />
            </div>
          )}
        </>
      ))}
    </>
  );
}

export default async function NewsPage({ searchParams }: PageProps) {
  const category = Object.keys(NEWS_CATEGORIES).includes(
    searchParams.category ?? ""
  )
    ? (searchParams.category ?? "all")
    : "all";
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "WW3 Predictor — Conflict News",
    description:
      "Auto-aggregated global conflict news covering military escalations and geopolitical crises.",
    url: "https://ww3predictor.com/news",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Global Conflict News
          </h1>
          <p className="text-gray-400 text-sm">
            Auto-aggregated from Reuters, BBC, AP and major outlets. Updated
            hourly.
          </p>
        </div>

        {/* Header ad */}
        <AdSlot slot="2233445566" format="leaderboard" className="mb-6" />

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <a
              key={key}
              href={`/news?category=${key}`}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                category === key
                  ? "bg-red-600 border-red-500 text-white"
                  : "bg-gray-800 border-gray-700 text-gray-300 hover:border-red-700 hover:text-red-300"
              }`}
            >
              {label}
            </a>
          ))}
        </div>

        {/* News grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Suspense
            fallback={
              <div className="col-span-full flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              </div>
            }
          >
            <NewsGrid category={category} page={page} />
          </Suspense>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-4 mt-10">
          {page > 1 && (
            <a
              href={`/news?category=${category}&page=${page - 1}`}
              className="px-5 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              ← Previous
            </a>
          )}
          <span className="text-gray-500 text-sm">Page {page}</span>
          <a
            href={`/news?category=${category}&page=${page + 1}`}
            className="px-5 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Next →
          </a>
        </div>
      </div>
    </>
  );
}
