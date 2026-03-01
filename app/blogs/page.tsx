import { Metadata } from "next";
import { ExternalLink, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog — Geopolitical Analysis & Commentary",
  description:
    "In-depth geopolitical analysis, conflict commentary, and expert insights on global military tensions.",
};

export default function BlogsPage() {
  const wpUrl =
    process.env.WORDPRESS_BLOG_URL ?? "https://blog.ww3predictor.com";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <BookOpen className="w-7 h-7 text-red-400" />
          <h1 className="text-3xl font-bold text-white">Blog</h1>
        </div>
        <p className="text-gray-400">
          In-depth analysis and commentary on global conflict developments.
        </p>
      </div>

      {/* WordPress embed */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mb-8">
        <div className="bg-gray-800 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-gray-400 text-xs font-mono">{wpUrl}</span>
          <a
            href={wpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white text-xs flex items-center gap-1 transition-colors"
          >
            Open <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <iframe
          src={wpUrl}
          className="w-full"
          style={{ height: "70vh", minHeight: 500 }}
          title="WW3 Predictor Blog"
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
      </div>

      {/* Fallback link */}
      <div className="text-center">
        <p className="text-gray-500 text-sm mb-3">
          Having trouble viewing the blog?
        </p>
        <a
          href={wpUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
        >
          Open Blog in New Tab
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
