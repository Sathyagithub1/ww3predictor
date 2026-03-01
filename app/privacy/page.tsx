import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — WW3 Predictor",
  description:
    "WW3 Predictor privacy policy. Learn how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
      <p className="text-gray-500 text-sm mb-10">
        Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
      </p>

      <div className="space-y-8 text-gray-300 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">
            1. Information We Collect
          </h2>
          <p>
            WW3 Predictor does not require you to create an account or provide
            personal information to use this site. We may automatically collect
            the following non-personal information when you visit:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400">
            <li>Browser type and version</li>
            <li>Pages visited and time spent</li>
            <li>Referring URL</li>
            <li>General geographic location (country/region)</li>
            <li>Device type (desktop/mobile)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">
            2. Cookies
          </h2>
          <p>
            This website uses cookies for the following purposes:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400">
            <li>
              <strong className="text-gray-300">Analytics cookies</strong> — To
              understand how visitors use our site (e.g., Google Analytics, if
              enabled).
            </li>
            <li>
              <strong className="text-gray-300">Advertising cookies</strong> — If
              Google AdSense is active, Google may set cookies to serve
              personalized ads based on your browsing history.
            </li>
          </ul>
          <p className="mt-2">
            You can control cookies through your browser settings. Disabling
            cookies may affect some site functionality.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">
            3. Google AdSense
          </h2>
          <p>
            We use Google AdSense to display advertisements. Google, as a
            third-party vendor, uses cookies to serve ads based on your prior
            visits to this website or other websites. You may opt out of
            personalized advertising by visiting{" "}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 hover:text-red-300 underline"
            >
              Google Ad Settings
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">
            4. Third-Party Links
          </h2>
          <p>
            Our News page contains links to third-party news articles. We are not
            responsible for the privacy practices or content of those external
            sites. We recommend reviewing their privacy policies.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">
            5. Data Security
          </h2>
          <p>
            We implement appropriate technical measures to protect any data we
            collect. Our infrastructure uses Supabase (PostgreSQL) with row-level
            security and Vercel edge network.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">
            6. Children&apos;s Privacy
          </h2>
          <p>
            This site is not directed at children under 13. We do not knowingly
            collect personal information from children.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">
            7. Changes to This Policy
          </h2>
          <p>
            We may update this privacy policy from time to time. Changes will be
            posted on this page with an updated date.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">8. Contact</h2>
          <p>
            If you have questions about this privacy policy, please contact us via
            our{" "}
            <a
              href="/contact"
              className="text-red-400 hover:text-red-300 underline"
            >
              Contact page
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
