export interface NewsArticle {
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  source: {
    name: string;
  };
  author: string | null;
}

interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

const CONFLICT_KEYWORDS =
  "war OR military OR nuclear OR NATO OR missile OR Russia OR China OR \"North Korea\" OR Iran OR Israel OR Gaza OR Ukraine";

export const NEWS_CATEGORIES: Record<string, string> = {
  all: CONFLICT_KEYWORDS,
  ukraine: "Ukraine OR Russia war",
  "middle-east": "Israel OR Gaza OR Iran OR Middle East",
  "north-korea": '"North Korea" OR Kim Jong Un missile',
  "china-taiwan": "China OR Taiwan strait military",
  nuclear: "nuclear weapon OR nuclear threat OR ICBM",
  nato: "NATO OR alliance military",
};

export async function fetchConflictNews(
  category = "all",
  page = 1,
  pageSize = 20
): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWSAPI_KEY;
  if (!apiKey) throw new Error("NEWSAPI_KEY not set");

  const q = NEWS_CATEGORIES[category] ?? CONFLICT_KEYWORDS;

  const params = new URLSearchParams({
    q,
    language: "en",
    sortBy: "publishedAt",
    pageSize: String(pageSize),
    page: String(page),
    apiKey,
  });

  const res = await fetch(`https://newsapi.org/v2/everything?${params}`, {
    next: { revalidate: 3600 }, // ISR — cache 1 hour
  });

  if (!res.ok) {
    throw new Error(`NewsAPI error: ${res.status} ${res.statusText}`);
  }

  const data: NewsAPIResponse = await res.json();

  if (data.status !== "ok") {
    throw new Error(`NewsAPI returned status: ${data.status}`);
  }

  // Filter out [Removed] articles
  return data.articles.filter(
    (a) => a.title && a.title !== "[Removed]" && a.url
  );
}
