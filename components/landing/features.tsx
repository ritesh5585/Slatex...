"use client";

import React from "react";
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
  const features: FeatureItem[] = [
    {
      id: "explore",
      title: "Explore developers",
      badge: "Live",
      description:
        "Profile stats, language breakdown, contribution history, and top repositories.",
      tags: ["Profile", "Repos", "Contributions"],
      icon: (
        <Compass
          className="w-4 h-4 text-emerald-400"
          suppressHydrationWarning
        />
      ),
      onClick: onExploreClick,
    },
    {
      id: "compare",
      title: "Compare developers",
      badge: "Live",
      description:
        "Put two profiles side by side: skills, activity, and top repositories.",
      tags: ["Skills", "Metrics", "Top repos"],
      icon: (
        <GitCompare
          className="w-4 h-4 text-purple-400"
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
        "Beginner-friendly projects that match the skills and languages you use.",
      tags: ["Skill match", "Trending"],
      icon: (
        <GitFork className="w-4 h-4 text-indigo-400" suppressHydrationWarning />
      ),
      onClick: onOpenSourceClick,
    },
    {
      id: "youtube",
      title: "YouTube insights",
      badge: "Coming soon",
      description: "Paste a channel link to see creator and content metrics.",
      tags: ["Creator stats", "Engagement"],
      icon: (
        <PlaySquare
          className="w-4 h-4 text-rose-400"
          suppressHydrationWarning
        />
      ),
      onClick: onYouTubeClick,
    },
  ];

  const getBadgeStyle = (badge: FeatureItem["badge"]) => {
    switch (badge) {
      case "Live":
        return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
      case "Beta":
        return "border-purple-500/30 bg-purple-500/10 text-purple-400";
      case "Coming soon":
      default:
        return "border-zinc-800 bg-zinc-800/60 text-zinc-400";
    }
  };

  return (
    <section
      id="features"
      className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12"
    >
      <div className="mb-5 sm:mb-8 text-left sm:text-center max-w-2xl mx-auto space-y-1.5">
        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-indigo-400">
          Platform Suite
        </span>
        <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Everything starts with a search
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm">
          Live tools are ready to inspect today; the rest are actively expanding.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
        {features.map((feature) => (
          <div
            key={feature.id}
            onClick={feature.onClick}
            className="group relative flex flex-col justify-between rounded-xl border border-zinc-800 bg-[#0e111c] p-4 sm:p-5 transition-all duration-200 hover:border-zinc-700 hover:bg-[#121524] cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
                  {feature.icon}
                </div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border ${getBadgeStyle(
                    feature.badge,
                  )}`}
                >
                  {feature.badge}
                </span>
              </div>

              <div className="flex items-center justify-between gap-1">
                <h3 className="text-sm sm:text-base font-semibold text-white group-hover:text-indigo-300 transition-colors">
                  {feature.title}
                </h3>
                <ArrowUpRight
                  className="w-3.5 h-3.5 text-zinc-500 group-hover:text-indigo-400 transition-colors shrink-0"
                  suppressHydrationWarning
                />
              </div>

              <p className="text-zinc-400 text-xs mt-1.5 leading-relaxed">
                {feature.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1 mt-4 pt-2.5 border-t border-zinc-800/60">
              {feature.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] font-medium"
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
