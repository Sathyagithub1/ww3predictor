import { Metadata } from "next";
import { Mail, Globe, Twitter } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact — WW3 Predictor",
  description:
    "Get in touch with the WW3 Predictor team. Contact us for press inquiries, feedback, or general questions.",
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-white mb-3">Contact Us</h1>
      <p className="text-gray-400 mb-10 leading-relaxed">
        Have a question, feedback, or press inquiry? Reach out using the methods
        below. We typically respond within 1–2 business days.
      </p>

      <div className="space-y-4 mb-10">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-900/40 rounded-full flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-white font-medium text-sm mb-0.5">Email</p>
            <a
              href="mailto:contact@ww3predictor.com"
              className="text-red-400 hover:text-red-300 text-sm transition-colors"
            >
              contact@ww3predictor.com
            </a>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-sky-900/40 rounded-full flex items-center justify-center shrink-0">
            <Twitter className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <p className="text-white font-medium text-sm mb-0.5">Twitter / X</p>
            <a
              href="https://twitter.com/ww3predictor"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 hover:text-red-300 text-sm transition-colors"
            >
              @ww3predictor
            </a>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-green-900/40 rounded-full flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-white font-medium text-sm mb-0.5">Website</p>
            <span className="text-gray-400 text-sm">ww3predictor.com</span>
          </div>
        </div>
      </div>

      {/* Simple contact form note */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
        <h2 className="text-white font-semibold mb-3">Press & Partnerships</h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          For press inquiries, data licensing, or partnership opportunities,
          please email{" "}
          <a
            href="mailto:press@ww3predictor.com"
            className="text-red-400 hover:text-red-300"
          >
            press@ww3predictor.com
          </a>{" "}
          with the subject line{" "}
          <span className="text-gray-300 font-mono text-xs bg-gray-800 px-1.5 py-0.5 rounded">
            [PRESS] Your Inquiry
          </span>
          .
        </p>
      </div>
    </div>
  );
}
