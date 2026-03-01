"use client";

interface Props {
  headlines: string[];
}

export default function NewsTicker({ headlines }: Props) {
  if (!headlines || headlines.length === 0) return null;

  const text = headlines.join(" ━━━ ");

  return (
    <div className="bg-red-900/80 border-t border-red-700 overflow-hidden py-2">
      <style>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(100vw); }
          100% { transform: translateX(-100%); }
        }
        .ticker-text {
          animation: ticker-scroll 60s linear infinite;
          white-space: nowrap;
        }
      `}</style>
      <div className="flex items-center">
        <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 shrink-0 uppercase tracking-wider mr-4">
          ● LIVE
        </span>
        <div className="overflow-hidden flex-1">
          <p className="ticker-text text-white text-sm">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}
