import Image from "next/image";
import { ExternalLink, Clock, Newspaper } from "lucide-react";
import { NewsArticle } from "@/lib/newsapi";

interface Props {
  article: NewsArticle;
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function NewsCard({ article }: Props) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.description ?? "",
    url: article.url,
    datePublished: article.publishedAt,
    publisher: {
      "@type": "Organization",
      name: article.source.name,
    },
    author: {
      "@type": "Person",
      name: article.author ?? article.source.name,
    },
    image: article.urlToImage ?? "",
  };

  return (
    <article className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-red-900/60 transition-all hover:shadow-lg hover:shadow-red-950/20 group">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Image */}
      <div className="relative h-44 bg-gray-800 overflow-hidden">
        {article.urlToImage ? (
          <Image
            src={article.urlToImage}
            alt={article.title}
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
            {article.source.name}
          </span>
          <span className="flex items-center gap-1 text-gray-500 text-xs">
            <Clock className="w-3 h-3" />
            {timeAgo(article.publishedAt)}
          </span>
        </div>

        <h3 className="text-white font-semibold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-red-300 transition-colors">
          {article.title}
        </h3>

        {article.description && (
          <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-3">
            {article.description}
          </p>
        )}

        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="inline-flex items-center gap-1.5 text-red-400 hover:text-red-300 text-xs font-medium transition-colors"
        >
          Read More
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </article>
  );
}
