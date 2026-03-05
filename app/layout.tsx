import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "WW3 Predictor — AI-Powered Global Conflict Risk Monitor",
    template: "%s | WW3 Predictor",
  },
  description:
    "Real-time AI analysis of global conflict indicators. WW3 Predictor monitors geopolitical tensions, military escalations, and nuclear threats to assess World War 3 probability.",
  keywords: [
    "WW3 predictor",
    "world war 3 probability",
    "geopolitical risk",
    "conflict monitor",
    "nuclear threat",
    "Russia Ukraine war",
    "China Taiwan",
    "AI analysis",
  ],
  authors: [{ name: "WW3 Predictor" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  openGraph: {
    type: "website",
    siteName: "WW3 Predictor",
    title: "WW3 Predictor — AI-Powered Global Conflict Risk Monitor",
    description:
      "Real-time AI analysis of global conflict indicators. Updated every 6 hours.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "WW3 Predictor",
    description: "AI-powered global conflict risk monitor. Updated every 6h.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adSenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  return (
    <html lang="en" className="dark">
      <head>
        <meta name="news_keywords" content="war, conflict, military, nuclear, NATO, Russia, China, Ukraine, Iran, Israel, geopolitics" />
        <link rel="canonical" href="https://ww3predictor.com" />
        {/* Microsoft Clarity */}
        <Script id="clarity-analytics" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "vqsy3jy2h2");`}
        </Script>
        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-27XDZQ892F"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-27XDZQ892F');`}
        </Script>
        {/* AdSense — only loaded once approved */}
        {adSenseId && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSenseId}`}
            crossOrigin="anonymous"
            strategy="lazyOnload"
          />
        )}
      </head>
      <body className="bg-gray-950 text-gray-100 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
