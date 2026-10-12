"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  UserCheck,
  GitCompare,
  FolderGit2,
  ArrowRight,
  Star,
  GitFork,
  Code2,
  TrendingUp,
  Award,
} from "lucide-react";

interface ShowcaseProps {
  onSelectUser?: (username: string) => void;
}

export function Showcase({ onSelectUser }: ShowcaseProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"profile" | "compare" | "repo">(
    "profile"
  );

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10 space-y-2">
        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-indigo-400">
          Interactive Live Preview
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          What Slatex reveals
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
          Switch tabs to see real profile insights, head-to-head comparisons, and repo metrics.
        </p>
      </div>

      {/* Tab Switcher - Responsive on all screen sizes */}
      <div className="flex justify-center mb-5 sm:mb-8">
        <div className="inline-flex p-1 rounded-xl bg-[#0e111c] border border-zinc-800 shadow-sm max-w-full overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "profile"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" suppressHydrationWarning />
            <span>Profile</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("compare")}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "compare"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" suppressHydrationWarning />
            <span>Compare</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("repo")}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "repo"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" suppressHydrationWarning />
            <span>Repository</span>
          </button>
        </div>
      </div>

      {/* Preview Container */}
      <div className="rounded-2xl border border-zinc-800 bg-[#0e111c] p-4 sm:p-8 shadow-xl">
        {/* TAB 1: Profile Analytics */}
        {activeTab === "profile" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800/80">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center font-bold text-base sm:text-xl text-white shrink-0">
                  RV
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-xl font-bold text-white">Ritesh V</h3>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                      Active Contributor
                    </span>
                  </div>
                  <p className="text-zinc-400 text-xs font-mono">@ritesh5585</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (onSelectUser) onSelectUser("ritesh5585");
                  else router.push("/profiles?username=ritesh5585");
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all cursor-pointer"
              >
                <span>Inspect profile</span>
                <ArrowRight className="w-3.5 h-3.5" suppressHydrationWarning />
              </button>
            </div>

            {/* Metrics Grid: 2 columns on mobile, 4 on desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
              <div className="p-3 sm:p-4 rounded-xl bg-[#131626] border border-zinc-800/80">
                <span className="text-[11px] text-zinc-400">Public Repos</span>
                <p className="text-lg sm:text-2xl font-bold text-white mt-0.5 tabular-nums">48</p>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                  <TrendingUp className="w-3 h-3" suppressHydrationWarning /> +12 this year
                </span>
              </div>
              <div className="p-3 sm:p-4 rounded-xl bg-[#131626] border border-zinc-800/80">
                <span className="text-[11px] text-zinc-400">Annual Commits</span>
                <p className="text-lg sm:text-2xl font-bold text-white mt-0.5 tabular-nums">1,482</p>
                <span className="text-[10px] text-indigo-400 mt-0.5 block">
                  94% Consistency
                </span>
              </div>
              <div className="p-3 sm:p-4 rounded-xl bg-[#131626] border border-zinc-800/80">
                <span className="text-[11px] text-zinc-400">Total Stars</span>
                <p className="text-lg sm:text-2xl font-bold text-white mt-0.5 tabular-nums">840+</p>
                <span className="text-[10px] text-amber-400 flex items-center gap-1 mt-0.5">
                  <Star className="w-3 h-3 fill-amber-400" suppressHydrationWarning /> 15 Repos
                </span>
              </div>
              <div className="p-3 sm:p-4 rounded-xl bg-[#131626] border border-zinc-800/80">
                <span className="text-[11px] text-zinc-400">Primary Stack</span>
                <p className="text-base sm:text-xl font-bold text-white mt-0.5">TypeScript</p>
                <span className="text-[10px] text-purple-400 mt-0.5 block">
                  Polyglot Verified
                </span>
              </div>
            </div>

            {/* Language bar */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-[#131626] border border-zinc-800/80 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-indigo-400" suppressHydrationWarning />
                  Byte-Weighted Language Share
                </span>
                <span className="text-zinc-500 font-mono text-[11px]">48 repos</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-zinc-800 overflow-hidden flex">
                <div style={{ width: "56%" }} className="bg-blue-500 h-full" title="TypeScript 56%" />
                <div style={{ width: "24%" }} className="bg-amber-400 h-full" title="JavaScript 24%" />
                <div style={{ width: "12%" }} className="bg-cyan-400 h-full" title="Python 12%" />
                <div style={{ width: "8%" }} className="bg-purple-500 h-full" title="Rust 8%" />
              </div>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-400 pt-1">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500" /> TypeScript 56%
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400" /> JavaScript 24%
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" /> Python 12%
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-purple-500" /> Rust 8%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Versus Compare */}
        {activeTab === "compare" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800/80">
              <div>
                <h3 className="text-base sm:text-xl font-bold text-white">
                  Head-to-Head Compare
                </h3>
                <p className="text-zinc-400 text-xs mt-0.5">
                  Benchmark two engineers across contributions, stars, and languages.
                </p>
              </div>
              <button
                type="button"
                onClick={() => router.push("/compare?user1=torvalds&user2=antirez")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all cursor-pointer"
              >
                <span>Launch compare</span>
                <ArrowRight className="w-3.5 h-3.5" suppressHydrationWarning />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-[#131626] border border-indigo-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-white font-bold text-sm">
                      LT
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Linus Torvalds</h4>
                      <span className="text-[11px] text-zinc-400 font-mono">@torvalds</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                    <Award className="w-3 h-3" suppressHydrationWarning /> Kernel
                  </span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-zinc-800/80">
                    <span className="text-zinc-400">Followers</span>
                    <span className="text-white font-semibold tabular-nums">220,000+</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-800/80">
                    <span className="text-zinc-400">Primary Language</span>
                    <span className="text-blue-400 font-semibold">C (94%)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-zinc-400">Top Repository</span>
                    <span className="text-indigo-300 font-mono">linux (180k+ ★)</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#131626] border border-purple-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-white font-bold text-sm">
                      SS
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Salvatore Sanfilippo</h4>
                      <span className="text-[11px] text-zinc-400 font-mono">@antirez</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center gap-1">
                    <Award className="w-3 h-3" suppressHydrationWarning /> Redis
                  </span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-zinc-800/80">
                    <span className="text-zinc-400">Followers</span>
                    <span className="text-white font-semibold tabular-nums">38,000+</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-800/80">
                    <span className="text-zinc-400">Primary Language</span>
                    <span className="text-purple-400 font-semibold">C / Tcl (88%)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-zinc-400">Top Repository</span>
                    <span className="text-purple-300 font-mono">redis (68k+ ★)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Repo Deep Dive */}
        {activeTab === "repo" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800/80">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                  <FolderGit2 className="w-5 h-5" suppressHydrationWarning />
                </div>
                <div>
                  <h3 className="text-base sm:text-xl font-bold text-white">facebook / react</h3>
                  <p className="text-zinc-400 text-xs mt-0.5">
                    The library for web and native user interfaces.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => router.push("/repo?owner=facebook&repo=react")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all cursor-pointer"
              >
                <span>Inspect repository</span>
                <ArrowRight className="w-3.5 h-3.5" suppressHydrationWarning />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
              <div className="p-3 sm:p-4 rounded-xl bg-[#131626] border border-zinc-800/80">
                <span className="text-[11px] text-zinc-400">Stars</span>
                <p className="text-lg sm:text-xl font-bold text-white mt-0.5 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" suppressHydrationWarning /> 228k
                </p>
              </div>
              <div className="p-3 sm:p-4 rounded-xl bg-[#131626] border border-zinc-800/80">
                <span className="text-[11px] text-zinc-400">Forks</span>
                <p className="text-lg sm:text-xl font-bold text-white mt-0.5 flex items-center gap-1">
                  <GitFork className="w-3.5 h-3.5 text-indigo-400" suppressHydrationWarning /> 46.2k
                </p>
              </div>
              <div className="p-3 sm:p-4 rounded-xl bg-[#131626] border border-zinc-800/80">
                <span className="text-[11px] text-zinc-400">License</span>
                <p className="text-base sm:text-lg font-bold text-white mt-0.5">MIT</p>
              </div>
              <div className="p-3 sm:p-4 rounded-xl bg-[#131626] border border-zinc-800/80">
                <span className="text-[11px] text-zinc-400">Branch</span>
                <p className="text-base sm:text-lg font-bold font-mono text-indigo-300 mt-0.5">main</p>
              </div>
            </div>

            {/* Commit pulse preview */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-[#131626] border border-zinc-800/80 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-300 font-semibold">Commit Cadence</span>
                <span className="text-emerald-400 font-medium text-[11px]">Active Development</span>
              </div>
              <div className="flex items-end gap-1 h-9 pt-1">
                {[40, 65, 30, 85, 50, 95, 70, 80, 45, 90, 60, 75, 55, 85, 90, 100].map(
                  (val, i) => (
                    <div
                      key={i}
                      style={{ height: `${val}%` }}
                      className="flex-1 rounded-xs bg-indigo-500/70"
                    />
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
