"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export function Faq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "Do I need a GitHub account or API key to use Slatex?",
      a: "No. Slatex requires zero logins, tokens, or configuration. It directly queries public GitHub GraphQL endpoints so you can look up any developer or public repository immediately.",
    },
    {
      q: "How are language percentages calculated?",
      a: "Rather than simply counting repositories, Slatex aggregates the byte volume of source code in each language across public repositories for true polyglot analysis.",
    },
    {
      q: "How does the developer comparison work?",
      a: "The comparison tool fetches two GitHub handles simultaneously, evaluating commit frequency, repository impact, and language overlap side by side with highlighted metric advantages.",
    },
    {
      q: "Can I inspect repositories as well as developer profiles?",
      a: "Yes. Enter either a username (e.g. 'shadcn') or a repository format (e.g. 'facebook/react' or full github.com URL). Slatex automatically routes to the appropriate view.",
    },
    {
      q: "Why is Slatex faster than browsing GitHub directly?",
      a: "Slatex utilizes Upstash Redis caching to store GraphQL responses. Repeat lookups return in sub-milliseconds without hitting GitHub rate limits or reloading heavy web pages.",
    },
  ];

  return (
    <section className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
      <div className="text-left sm:text-center mb-6 sm:mb-10 space-y-1.5">
        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-indigo-400">
          FAQ
        </span>
        <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
          Frequently asked questions
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm">
          Everything you need to know about Slatex data and performance.
        </p>
      </div>

      <div className="space-y-2.5">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={faq.q}
              className={`rounded-xl border transition-all ${
                isOpen
                  ? "border-zinc-700 bg-[#0e111c]"
                  : "border-zinc-800/80 bg-[#0c0e17] hover:border-zinc-700"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3 text-left cursor-pointer"
              >
                <span className="text-xs sm:text-sm font-semibold text-white">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform ${
                    isOpen ? "rotate-180 text-indigo-400" : ""
                  }`}
                  suppressHydrationWarning
                />
              </button>
              {isOpen && (
                <div className="px-4 sm:px-5 pb-4 pt-1 text-xs text-zinc-300 leading-relaxed border-t border-zinc-800/40">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
