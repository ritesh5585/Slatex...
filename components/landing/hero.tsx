"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight, Search } from "lucide-react";

interface HeroProps {
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
}

export function Hero({ searchInputRef }: HeroProps) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSearch = (searchVal: string) => {
    const term = searchVal.trim();
    if (!term) return;

    setIsLoading(true);

    if (term.includes("github.com/")) {
      const parts = term
        .replace(/\.git$/, "")
        .split("github.com/")[1]
        .split("/")
        .filter(Boolean);

      if (parts.length >= 2) {
        router.push(
          `/repo?owner=${encodeURIComponent(parts[0])}&repo=${encodeURIComponent(parts[1])}`
        );
        return;
      } else if (parts.length === 1) {
        router.push(`/profiles?username=${encodeURIComponent(parts[0])}`);
        return;
      }
    }

    if (term.includes("/") && !term.startsWith("http")) {
      const [owner, repoName] = term.split("/").map((s) => s.trim());
      if (owner && repoName) {
        router.push(
          `/repo?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repoName.replace(/\.git$/, ""))}`
        );
        return;
      }
    }

    const cleanUser = term.replace(/^@/, "");
    router.push(`/profiles?username=${encodeURIComponent(cleanUser)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleChipClick = (sample: string) => {
    setQuery(sample);
    handleSearch(sample);
  };

  return (
    <section className="relative w-full max-w-4xl mx-auto pt-10 sm:pt-16 pb-12 sm:pb-16 flex flex-col items-center justify-center text-center px-4">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[500px] h-[250px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Headline */}
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
        Understand any developer in{" "}
        <span className="text-indigo-400">one search.</span>
      </h1>

      {/* Subtitle */}
      <p className="text-zinc-400 text-sm sm:text-base md:text-lg max-w-xl mt-3 sm:mt-4 leading-relaxed font-normal">
        Look up a GitHub profile or repository to see languages, activity, and
        top projects. Compare two developers side by side.
      </p>

      {/* Search Box - Fast, mobile-first responsive */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl mt-6 sm:mt-8 rounded-xl border border-zinc-700/80 bg-[#0e111c] p-1.5 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all shadow-lg"
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex items-center flex-1 px-3 py-1">
            <Search className="w-4 h-4 text-zinc-400 shrink-0 mr-2" suppressHydrationWarning />
            <input
              ref={searchInputRef as React.RefObject<HTMLInputElement>}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter GitHub username or repo (e.g. facebook/react)"
              className="landing-search-input w-full bg-transparent py-1 text-sm sm:text-base text-white placeholder-zinc-500 outline-none font-medium"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all cursor-pointer shrink-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" suppressHydrationWarning />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <span>Analyze</span>
                <ArrowRight className="w-4 h-4 hidden sm:inline-block" suppressHydrationWarning />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Try Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-4 sm:mt-5 text-xs text-zinc-400">
        <span className="font-medium text-zinc-500">Try:</span>
        <button
          type="button"
          onClick={() => handleChipClick("ritesh5585")}
          className="px-2.5 py-1 rounded-md border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 hover:text-white text-zinc-300 font-mono transition-colors cursor-pointer"
        >
          ritesh5585
        </button>
        <button
          type="button"
          onClick={() => handleChipClick("callmegautam")}
          className="px-2.5 py-1 rounded-md border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 hover:text-white text-zinc-300 font-mono transition-colors cursor-pointer"
        >
          callmegautam
        </button>
        <button
          type="button"
          onClick={() => handleChipClick("alex/what-happens-when")}
          className="px-2.5 py-1 rounded-md border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 hover:text-white text-zinc-300 font-mono transition-colors cursor-pointer"
        >
          alex/what-happens-when
        </button>
      </div>
    </section>
  );
}
