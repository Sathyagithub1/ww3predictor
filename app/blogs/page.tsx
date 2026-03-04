import { Metadata } from "next";
import { BookOpen, Clock, ExternalLink, Newspaper } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Blog — Geopolitical Analysis & Commentary",
  description:
    "In-depth geopolitical analysis, conflict commentary, and expert insights on global military tensions.",
};

export const dynamic = "force-dynamic";

interface WPPost {
  id: number;
  date: string;
  link: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string }>;
  };
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&[^;]+;/g, " ").trim();
}

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

async function fetchPosts(page = 1): Promise<WPPost[]> {
  const base =
    process.env.WORDPRESS_BLOG_URL ?? "https://ww3predictor.com/blog";
  try {
    const res = await fetch(
      `${base}/wp-json/wp/v2/posts?_embed&per_page=9&page=${page}&status=publish`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

interface PageProps {
  searchParams: { page?: string };
}

export default async function BlogsPage({ searchParams }: PageProps) {
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10));
  const posts = await fetchPosts(page);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-7 h-7 text-red-400" />
          <h1 className="text-3xl font-bold text-white">Blog</h1>
        </div>
        <p className="text-gray-400 text-sm">
          In-depth analysis and commentary on global conflict developments.
        </p>
      </div>

      {/* Posts grid */}
      {posts.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">No posts found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => {
            const title = stripHtml(post.title.rendered);
            const excerpt = stripHtml(post.excerpt.rendered);
            const image =
              post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;

            return (
              <article
                key={post.id}
                className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-red-900/60 transition-all hover:shadow-lg hover:shadow-red-950/20 group"
              >
                {/* Image */}
                <div className="relative h-44 bg-gray-800 overflow-hidden">
                  {image ? (
                    <Image
                      src={image}
                      alt={title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Newspaper className="w-12 h-12 text-gray-600" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-red-400 text-xs font-semibold uppercase tracking-wider">
                      WW3 Predictor
                    </span>
                    <span className="flex items-center gap-1 text-gray-500 text-xs">
                      <Clock className="w-3 h-3" />
                      {timeAgo(post.date)}
                    </span>
                  </div>

                  <h3 className="text-white font-semibold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-red-300 transition-colors">
                    {title}
                  </h3>

                  {excerpt && (
                    <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-3">
                      {excerpt}
                    </p>
                  )}

                  <a
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-red-400 hover:text-red-300 text-xs font-medium transition-colors"
                  >
                    Read More
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {(page > 1 || posts.length === 9) && (
        <div className="flex items-center justify-center gap-4 mt-10">
          {page > 1 && (
            <a
              href={`/blogs?page=${page - 1}`}
              className="px-5 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              ← Previous
            </a>
          )}
          <span className="text-gray-500 text-sm">Page {page}</span>
          {posts.length === 9 && (
            <a
              href={`/blogs?page=${page + 1}`}
              className="px-5 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Next →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
