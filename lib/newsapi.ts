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

// Curated sources that reliably cover war, conflicts, sanctions, terrorism
const CONFLICT_SOURCES =
  "bbc-news,reuters,al-jazeera-english,associated-press,cnn,the-guardian-uk,abc-news,nbc-news";

// Strictly military/geopolitical terms — uses word-boundary regex to avoid
// false matches like "war" inside "awards" or "forward"
const CONFLICT_TERMS = [
  "war", "military", "nuclear", "nato", "missile", "troops", "weapon", "weapons",
  "airstrike", "air strike", "ceasefire", "invasion", "sanction", "sanctions",
  "terror", "terrorist", "combat", "offensive", "frontline", "front line",
  "attack", "attacks", "strike", "strikes", "bombed", "bombing",
  "shelling", "shelled", "ballistic", "hypersonic", "warship", "artillery",
  "hamas", "hezbollah", "icbm", "pentagon", "kremlin",
  "putin", "zelensky", "netanyahu", "khamenei",
  "ukraine", "iran", "israel", "gaza", "north korea", "taiwan strait",
  "war crimes", "air defense", "drone strike", "killed in",
];

// Left-boundary only: \battack matches attack/attacks/attacked/attacking
// but not "sneak attack" -> still fine, and avoids false "award" matching "war"
const CONFLICT_REGEXES = CONFLICT_TERMS.map(
  (t) => new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i")
);

function isConflictArticle(article: NewsArticle): boolean {
  const text = `${article.title ?? ""} ${article.description ?? ""}`;
  return CONFLICT_REGEXES.some((re) => re.test(text));
}

export async function fetchTrendingNews(count = 6): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWSAPI_KEY;
  if (!apiKey) return [];

  // sources-only — free plan does not support sources+q together
  const params = new URLSearchParams({
    sources: CONFLICT_SOURCES,
    pageSize: "30",
    page: "1",
    apiKey,
  });

  try {
    const res = await fetch(
      `https://newsapi.org/v2/top-headlines?${params}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data: NewsAPIResponse = await res.json();
    if (data.status !== "ok") return [];
    return data.articles
      .filter((a) => a.title && a.title !== "[Removed]" && a.url)
      .filter(isConflictArticle)
      .slice(0, count);
  } catch {
    return [];
  }
}

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

  return data.articles
    .filter((a) => a.title && a.title !== "[Removed]" && a.url)
    .filter(isConflictArticle);
}
