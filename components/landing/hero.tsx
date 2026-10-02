"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight, Search, Sparkles } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface HeroProps {
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
}

export function Hero({ searchInputRef }: HeroProps) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const heroContainerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const searchBoxRef = useRef<HTMLFormElement>(null);
  const tryChipsRef = useRef<HTMLDivElement>(null);

  // GSAP Animations with ScrollTrigger for scroll & reverse scroll
  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    const ctx = gsap.context(() => {
      // Hero entrance & scroll reaction (forward & reverse scroll)
      gsap.fromTo(
        badgeRef.current,
        { opacity: 0, y: -15, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: badgeRef.current,
            start: "top 95%",
            end: "bottom 5%",
            toggleActions: "play reverse play reverse",
          },
        }
      );

      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 95%",
            end: "bottom 5%",
            toggleActions: "play reverse play reverse",
          },
        }
      );

      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: subtitleRef.current,
            start: "top 95%",
            end: "bottom 5%",
            toggleActions: "play reverse play reverse",
          },
        }
      );

      // Search box is ALWAYS 100% visible, smoothly floating on scroll & reverse scroll
      if (searchBoxRef.current) {
        gsap.fromTo(
          searchBoxRef.current,
          { y: 15, scale: 0.98 },
          {
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "back.out(1.4)",
            scrollTrigger: {
              trigger: searchBoxRef.current,
              start: "top 95%",
              end: "bottom 5%",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      }

      if (tryChipsRef.current) {
        gsap.fromTo(
          tryChipsRef.current,
          { opacity: 0.3, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: tryChipsRef.current,
              start: "top 98%",
              end: "bottom 5%",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      }
    }, heroContainerRef);

    return () => ctx.revert();
  }, []);

  const handleSearch = (searchVal: string) => {
    const term = searchVal.trim();
    if (!term) return;

    setIsLoading(true);

    // Check if input is a repository URL or format owner/repo
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

    // Check if format is "owner/repo" (not containing http)
    if (term.includes("/") && !term.startsWith("http")) {
      const [owner, repoName] = term.split("/").map((s) => s.trim());
      if (owner && repoName) {
        router.push(
          `/repo?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repoName.replace(/\.git$/, ""))}`
        );
        return;
      }
    }

    // Default to developer profile search
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
    <section
      ref={heroContainerRef}
      className="relative w-full pt-6 pb-16 sm:pt-12 sm:pb-24 flex flex-col items-center justify-center text-center px-4"
    >
      {/* Subtler ambient light in background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[650px] h-[350px] sm:h-[450px] bg-indigo-600/10 rounded-full blur-[100px] sm:blur-[130px] pointer-events-none -z-10" />

      {/* Pill Badge */}
      <div
        ref={badgeRef}
        className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-[#0e1220]/90 backdrop-blur-md text-xs sm:text-sm font-medium text-zinc-200 shadow-[0_0_15px_rgba(99,102,241,0.15)] mb-6 sm:mb-8"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-sm shadow-emerald-500/50" />
        </span>
        GitHub analytics for everyone
      </div>

      {/* Hero Headline - Guaranteed visible in Brave, Edge, Chrome */}
      <h1
        ref={titleRef}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.15] max-w-4xl"
      >
        Understand any developer in{" "}
        <span
          className="inline-block font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400"
          style={{
            backgroundImage: "linear-gradient(135deg, #60a5fa 0%, #818cf8 40%, #c084fc 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "#818cf8", // Reliable fallback
          }}
        >
          one search.
        </span>
      </h1>

      {/* Subtitle */}
      <p
        ref={subtitleRef}
        className="text-zinc-300 text-sm sm:text-base md:text-lg max-w-2xl mt-4 sm:mt-6 leading-relaxed font-normal"
      >
        Look up a GitHub profile or repository and see languages, activity and
        top projects in one clean view. Compare two developers side by side.
      </p>

      {/* 
        High-visibility Search Box
        Guaranteed opacity 100%, crisp border & luminous glow
      */}
      <form
        ref={searchBoxRef}
        onSubmit={handleSubmit}
        className="relative w-full max-w-2xl mt-8 sm:mt-10 rounded-2xl border-2 border-indigo-500/40 hover:border-indigo-400 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/25 bg-[#0e111c] p-2 backdrop-blur-2xl shadow-[0_0_35px_rgba(99,102,241,0.22)] transition-all duration-300"
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex items-center flex-1 px-3">
            <Search className="w-5 h-5 text-indigo-400 shrink-0 mr-2" suppressHydrationWarning />
            <input
              ref={searchInputRef as React.RefObject<HTMLInputElement>}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter a GitHub username or repository URL"
              className="w-full bg-transparent py-2.5 text-sm sm:text-base text-white placeholder-zinc-400 outline-none font-medium"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 rounded-xl text-sm font-bold text-white bg-[#5850ec] hover:bg-[#4b43db] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all duration-200 shadow-lg shadow-indigo-600/40 cursor-pointer shrink-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" suppressHydrationWarning />
                <span>Analyzing...</span>
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
      <div
        ref={tryChipsRef}
        className="flex flex-wrap items-center justify-center gap-2 mt-5 sm:mt-6 text-xs sm:text-sm text-zinc-400 font-medium"
      >
        <span className="text-zinc-400 font-semibold">Try:</span>
        <button
          type="button"
          onClick={() => handleChipClick("ritesh5585")}
          className="px-3.5 py-1 rounded-full border border-indigo-500/30 bg-[#121626] hover:bg-indigo-950/40 hover:border-indigo-400 text-zinc-200 hover:text-white text-xs font-mono transition-all duration-150 cursor-pointer active:scale-95"
        >
          Ritesh V
        </button>
        <button
          type="button"
          onClick={() => handleChipClick("torvalds")}
          className="px-3.5 py-1 rounded-full border border-indigo-500/30 bg-[#121626] hover:bg-indigo-950/40 hover:border-indigo-400 text-zinc-200 hover:text-white text-xs font-mono transition-all duration-150 cursor-pointer active:scale-95"
        >
          torvalds
        </button>
        <button
          type="button"
          onClick={() => handleChipClick("alex/what-happens-when")}
          className="px-3.5 py-1 rounded-full border border-indigo-500/30 bg-[#121626] hover:bg-indigo-950/40 hover:border-indigo-400 text-zinc-200 hover:text-white text-xs font-mono transition-all duration-150 cursor-pointer active:scale-95"
        >
          Behind the Google.com
        </button>
      </div>
    </section>
  );
}
