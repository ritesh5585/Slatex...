"use client";

import React from "react";
import {
  Zap,
  Layers,
  GitCompare,
  Activity,
  FileCode2,
  ShieldCheck,
} from "lucide-react";

export function Capabilities() {
  const capabilities = [
    {
      icon: <Zap className="w-3.5 h-3.5 text-amber-400" suppressHydrationWarning />,
      title: "Real-Time GraphQL",
      subtitle: "Zero stale scrapers; direct GitHub v4 API queries.",
      tag: "Live API",
    },
    {
      icon: <Layers className="w-3.5 h-3.5 text-blue-400" suppressHydrationWarning />,
      title: "Polyglot Byte Share",
      subtitle: "Accurate code byte weight across all public repos.",
      tag: "Byte-Accurate",
    },
    {
      icon: <GitCompare className="w-3.5 h-3.5 text-purple-400" suppressHydrationWarning />,
      title: "Side-by-Side Versus",
      subtitle: "Direct head-to-head metric comparison & verdict.",
      tag: "Compare",
    },
    {
      icon: <Activity className="w-3.5 h-3.5 text-rose-400" suppressHydrationWarning />,
      title: "Commit Heatmaps",
      subtitle: "Annual streak tracking & engineering velocity.",
      tag: "12 Months",
    },
    {
      icon: <FileCode2 className="w-3.5 h-3.5 text-emerald-400" suppressHydrationWarning />,
      title: "Repo Intelligence",
      subtitle: "Tech stack, stars, forks & README TOC viewer.",
      tag: "Deep Scan",
    },
    {
      icon: <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" suppressHydrationWarning />,
      title: "Redis Edge Shield",
      subtitle: "Sub-millisecond repeat hits, zero rate limits.",
      tag: "Cached",
    },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
      {/* Header */}
      <div className="text-left sm:text-center max-w-xl mx-auto mb-5 sm:mb-8 space-y-1">
        <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-400">
          Core Capabilities
        </span>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Engineered for developer clarity
        </h2>
      </div>

      {/* 2 Cards per row on Mobile, 3 on Desktop, reduced height */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5">
        {capabilities.map((cap) => (
          <div
            key={cap.title}
            className="group relative flex flex-col justify-between rounded-xl border border-zinc-800/90 bg-[#0e111c]/90 p-3 sm:p-4 transition-all duration-150 hover:border-zinc-700 hover:bg-[#121524] shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 shrink-0">
                  {cap.icon}
                </div>
                <span className="text-[9px] sm:text-[10px] font-semibold text-zinc-400 px-1.5 py-0.5 rounded bg-zinc-900/80 border border-zinc-800 shrink-0">
                  {cap.tag}
                </span>
              </div>

              <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-indigo-300 transition-colors leading-tight">
                {cap.title}
              </h3>
              <p className="text-zinc-400 text-[11px] sm:text-xs mt-1 leading-snug line-clamp-2">
                {cap.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
