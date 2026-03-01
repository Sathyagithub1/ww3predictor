"use client";

import { useEffect } from "react";

interface Props {
  slot: string;
  format?: "auto" | "rectangle" | "leaderboard" | "banner";
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdSlot({ slot, format = "auto", className = "" }: Props) {
  const adSenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense not loaded yet
    }
  }, []);

  if (!adSenseId) {
    // Placeholder while AdSense is not configured
    return (
      <div
        className={`bg-gray-900/40 border border-dashed border-gray-700 rounded-lg flex items-center justify-center text-gray-600 text-xs ${className}`}
        style={{ minHeight: 90 }}
      >
        Ad slot [{slot}]
      </div>
    );
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={adSenseId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
