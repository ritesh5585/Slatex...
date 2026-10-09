"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Compass,
  GitCompare,
  PlaySquare,
  GitFork,
  ArrowUpRight,
} from "lucide-react";

interface FeaturesProps {
  onExploreClick?: () => void;
  onCompareClick?: () => void;
  onYouTubeClick?: () => void;
  onOpenSourceClick?: () => void;
}

interface FeatureItem {
  id: string;
  title: string;
  badge: "Live" | "Beta" | "Coming soon";
  description: string;
  tags: string[];
  icon: React.ReactNode;
  onClick?: () => void;
}

export function Features({
  onExploreClick,
  onCompareClick,
  onYouTubeClick,
  onOpenSourceClick,
}: FeaturesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  const features: FeatureItem[] = [
    {
      id: "explore",
      title: "Explore developers",
      badge: "Live",
      description:
        "Profile stats, language mix, contribution history and top repositories.",
      tags: ["Profile", "Repos", "Contributions"],
      icon: (
        <Compass
          className="w-5 h-5 text-emerald-400"
          suppressHydrationWarning
        />
      ),
      onClick: onExploreClick,
    },
    {
      id: "compare",
      title: "Compare developers",
      badge: "Beta",
      description:
        "Put two profiles next to each other: skills, activity and best work.",
      tags: ["Skills", "Graphs", "Top repos"],
      icon: (
        <GitCompare
          className="w-5 h-5 text-purple-400"
          suppressHydrationWarning
        />
      ),
      onClick: onCompareClick,
    },
    {
      id: "opensource",
      title: "Find open source",
      badge: "Coming soon",
      description:
        "Beginner-friendly projects that match the skills you already have.",
      tags: ["Skill match", "Trending"],
      icon: (
        <GitFork className="w-5 h-5 text-indigo-400" suppressHydrationWarning />
      ),
      onClick: onOpenSourceClick,
    },
    {
      id: "youtube",
      title: "YouTube insights",
      badge: "Coming soon",
      description: "Paste a channel link to see creator and content analytics.",
      tags: ["Creator stats", "Engagement"],
      icon: (
        <PlaySquare
          className="w-5 h-5 text-rose-400"
          suppressHydrationWarning
        />
      ),
      onClick: onYouTubeClick,
    },
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    const ctx = gsap.context(() => {
      // Heading animation on scroll and reverse scroll
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { opacity: 0.15, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 90%",
              end: "bottom 10%",
              toggleActions: "play reverse play reverse",
            },
          },
        );
      }

      // Cards stagger animation on scroll and reverse scroll
      if (cardsContainerRef.current) {
        const cards = Array.from(cardsContainerRef.current.children);
        cards.forEach((card, index) => {
          gsap.fromTo(
            card,
            { opacity: 0.2, y: 25 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              delay: index * 0.08,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 92%",
                end: "bottom 8%",
                toggleActions: "play reverse play reverse",
              },
            },
          );
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const getBadgeStyle = (badge: FeatureItem["badge"]) => {
    switch (badge) {
      case "Live":
        return "border-emerald-500/40 bg-emerald-500/15 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.15)]";
      case "Beta":
        return "border-purple-500/40 bg-purple-500/15 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.15)]";
      case "Coming soon":
      default:
        return "border-zinc-700 bg-zinc-800/60 text-zinc-300";
    }
  };

  return (
    <section
      ref={containerRef}
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 relative"
    >
      {/* Subtle ambient light behind cards */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-64 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Section Header */}
      <div ref={headingRef} className="space-y-2 mb-8 sm:mb-10 text-left">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Everything starts with a username
        </h2>
        <p className="text-zinc-300 text-sm sm:text-base max-w-2xl font-normal leading-relaxed">
          One search powers every tool. Live features are ready today; the rest
          are on the roadmap.
        </p>
      </div>

      {/* Feature Cards Grid: 4 equal, beautifully responsive columns */}
      <div
        ref={cardsContainerRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full"
      >
        {features.map((feature) => (
          <div
            key={feature.id}
            onClick={feature.onClick}
            className="group relative flex flex-col justify-between rounded-2xl border border-zinc-700/80 bg-[#0e111c] p-6 backdrop-blur-md transition-all duration-300 hover:border-indigo-500/60 hover:bg-[#121626] hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-indigo-950/40 cursor-pointer"
          >
            {/* Top Row: Icon + Title + Badge */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800">
                  {feature.icon}
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border shrink-0 ${getBadgeStyle(
                    feature.badge,
                  )}`}
                >
                  {feature.badge}
                </span>
              </div>

              <div className="flex items-center justify-between gap-1">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-indigo-300 transition-colors">
                  {feature.title}
                </h3>
                <ArrowUpRight
                  className="w-4 h-4 text-zinc-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                  suppressHydrationWarning
                />
              </div>

              {/* Description - Crisp, readable text in Brave & Edge */}
              <p className="text-zinc-300 text-xs sm:text-sm mt-3 leading-relaxed font-normal">
                {feature.description}
              </p>
            </div>

            {/* Bottom Row: Tags */}
            <div className="flex flex-wrap items-center gap-1.5 mt-6 pt-2">
              {feature.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-lg border border-zinc-700/60 bg-[#161928] text-zinc-200 text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
