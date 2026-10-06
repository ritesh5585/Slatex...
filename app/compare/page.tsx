"use client";

import React, { useState, useEffect, Suspense, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  GitCompare,
  ArrowLeftRight,
  Sparkles,
  Loader2,
  ExternalLink,
  Star,
  Users,
  Search,
  AlertCircle,
  Menu,
  X,
  Trophy,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { DashboardSidebar } from "@/components/user/dashboard-sidebar";
import { ComparedUser, MonthlyContributionPoint } from "@/app/api/github/compare/route";

// ── Sample default data matching the mockup images ──────────────────────────
const MOCK_USER1: ComparedUser = {
  login: "ritesh5585",
  name: "Ritesh Vishwakarma",
  avatarUrl: "https://github.com/ritesh5585.png",
  bio: "Full-stack developer building modern developer tools & web applications.",
  location: "Mumbai",
  company: null,
  url: "https://github.com/ritesh5585",
  createdAt: "2025-01-10T00:00:00Z",
  joinedFormatted: "joined Jan 2025",
  followers: 13,
  following: 16,
  publicRepos: 23,
  totalStars: 2,
  totalContributions: 443,
  totalCommits: 391,
  languages: [
    { name: "JavaScript", count: 12, color: "#f7df1e", percent: 57 },
    { name: "TypeScript", count: 4, color: "#3178c6", percent: 19 },
    { name: "CSS", count: 2, color: "#563d7c", percent: 10 },
    { name: "Other", count: 3, color: "#8b949e", percent: 14 },
  ],
  topRepos: [
    {
      id: "r1",
      name: "Slatex-",
      description: "Modern developer analytics and portfolio explorer",
      url: "https://github.com/ritesh5585/Slatex-",
      stars: 2,
      forks: 1,
      language: "TypeScript",
      languageColor: "#3178c6",
    },
    {
      id: "r2",
      name: "DigiLaterals-Tasks",
      description: "Frontend architecture and UI components",
      url: "https://github.com/ritesh5585/DigiLaterals-Tasks",
      stars: 0,
      forks: 0,
      language: "JavaScript",
      languageColor: "#f7df1e",
    },
    {
      id: "r3",
      name: "Practice-Notes-",
      description: "Documentation and personal development notes",
      url: "https://github.com/ritesh5585/Practice-Notes-",
      stars: 0,
      forks: 0,
      language: "MDX",
      languageColor: "#fcb32c",
    },
  ],
};

const MOCK_USER2: ComparedUser = {
  login: "priya-dev",
  name: "Priya Nair",
  avatarUrl: "https://github.com/priya-dev.png",
  bio: "Systems architect & open-source enthusiast.",
  location: "Bengaluru",
  company: null,
  url: "https://github.com/priya-dev",
  createdAt: "2021-03-15T00:00:00Z",
  joinedFormatted: "joined Mar 2021",
  followers: 1284,
  following: 92,
  publicRepos: 41,
  totalStars: 3406,
  totalContributions: 1912,
  totalCommits: 1540,
  languages: [
    { name: "TypeScript", count: 18, color: "#3178c6", percent: 44 },
    { name: "Rust", count: 11, color: "#dea584", percent: 27 },
    { name: "Go", count: 7, color: "#00ADD8", percent: 17 },
    { name: "Other", count: 5, color: "#8b949e", percent: 12 },
  ],
  topRepos: [
    {
      id: "p1",
      name: "queuekit",
      description: "High-throughput asynchronous distributed message queue",
      url: "https://github.com/priya-dev/queuekit",
      stars: 2310,
      forks: 142,
      language: "Rust",
      languageColor: "#dea584",
    },
    {
      id: "p2",
      name: "ledger-cli-go",
      description: "Fast terminal double-entry accounting engine written in Go",
      url: "https://github.com/priya-dev/ledger-cli-go",
      stars: 688,
      forks: 45,
      language: "Go",
      languageColor: "#00ADD8",
    },
    {
      id: "p3",
      name: "tsconfig-presets",
      description: "Strict, optimal TypeScript compiler configuration presets",
      url: "https://github.com/priya-dev/tsconfig-presets",
      stars: 341,
      forks: 28,
      language: "TypeScript",
      languageColor: "#3178c6",
    },
  ],
};

const MOCK_MONTHLY: MonthlyContributionPoint[] = [
  { month: "Nov", key: "2025-11", u1: 0, u2: 110 },
  { month: "Dec", key: "2025-12", u1: 0, u2: 85 },
  { month: "Jan", key: "2026-01", u1: 48, u2: 175 },
  { month: "Feb", key: "2026-02", u1: 32, u2: 148 },
  { month: "Mar", key: "2026-03", u1: 64, u2: 210 },
  { month: "Apr", key: "2026-04", u1: 82, u2: 135 },
  { month: "May", key: "2026-05", u1: 45, u2: 195 },
  { month: "Jun", key: "2026-06", u1: 96, u2: 160 },
  { month: "Jul", key: "2026-07", u1: 128, u2: 245 },
  { month: "Aug", key: "2026-08", u1: 110, u2: 170 },
  { month: "Sep", key: "2026-09", u1: 72, u2: 190 },
  { month: "Oct", key: "2026-10", u1: 45, u2: 149 },
];

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toLocaleString()}`;
  return n.toLocaleString();
}

// ── Custom Tooltip for Recharts ──────────────────────────────────────────────
const CustomMonthlyTooltip = ({ active, payload, label, u1Name, u2Name }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-zinc-700/80 bg-[#0d0f17]/95 px-3.5 py-2.5 shadow-2xl backdrop-blur-md text-xs z-50">
      <p className="text-zinc-400 font-semibold mb-2">{label}</p>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-blue-500" />
          <span className="text-zinc-300 font-medium">@{u1Name}:</span>
          <span className="font-bold text-white tabular-nums">
            {payload[0]?.value?.toLocaleString()} commits
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-amber-500" />
          <span className="text-zinc-300 font-medium">@{u2Name}:</span>
          <span className="font-bold text-white tabular-nums">
            {payload[1]?.value?.toLocaleString()} commits
          </span>
        </div>
      </div>
    </div>
  );
};

// ── Comparative Bar Metric Row ───────────────────────────────────────────────
function MetricComparisonRow({
  label,
  v1,
  v2,
}: {
  label: string;
  v1: number;
  v2: number;
}) {
  const max = Math.max(v1, v2, 1);
  const p1 = Math.round((v1 / max) * 100);
  const p2 = Math.round((v2 / max) * 100);

  return (
    <div className="grid grid-cols-[60px_1fr_auto_1fr_60px] sm:grid-cols-[80px_1fr_130px_1fr_80px] items-center gap-2 sm:gap-3 py-2 text-xs sm:text-sm">
      {/* Left Value */}
      <span className="text-left font-semibold text-zinc-300 tabular-nums">
        {fmt(v1)}
      </span>

      {/* Left Bar (Blue, right-aligned towards label) */}
      <div className="flex justify-end w-full h-2 sm:h-2.5 bg-transparent rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500/80 rounded-full transition-all duration-500"
          style={{ width: `${Math.max(2, p1)}%` }}
        />
      </div>

      {/* Center Metric Label */}
      <div className="text-center font-medium text-zinc-400 whitespace-nowrap px-1 select-none text-[11px] sm:text-xs">
        {label}
      </div>

      {/* Right Bar (Amber, left-aligned away from label) */}
      <div className="flex justify-start w-full h-2 sm:h-2.5 bg-transparent rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-500/90 rounded-full transition-all duration-500"
          style={{ width: `${Math.max(2, p2)}%` }}
        />
      </div>

      {/* Right Value */}
      <span className="text-right font-semibold text-zinc-300 tabular-nums">
        {fmt(v2)}
      </span>
    </div>
  );
}

function CompareContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const paramU1 = searchParams.get("user1")?.trim() || "";
  const paramU2 = searchParams.get("user2")?.trim() || "";

  // Local inputs
  const [input1, setInput1] = useState(paramU1 || "ritesh5585");
  const [input2, setInput2] = useState(paramU2 || "priya-dev");

  // Comparison state
  const [data, setData] = useState<{
    user1: ComparedUser;
    user2: ComparedUser;
    monthlyData: MonthlyContributionPoint[];
    verdict?: string;
  } | null>({
    user1: MOCK_USER1,
    user2: MOCK_USER2,
    monthlyData: MOCK_MONTHLY,
    verdict:
      "priya-dev leads on 5 of 6 metrics. ritesh5585 follows fewer accounts, so the gap in followers is the widest.",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // View state switcher: 'result' | 'empty' | 'not_found'
  const [viewState, setViewState] = useState<"result" | "empty" | "not_found">("result");

  // Fetch comparison from GraphQL route
  const performFetch = async (u1: string, u2: string) => {
    if (!u1 || !u2) {
      setViewState("empty");
      return;
    }
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch(
        `/api/github/compare?user1=${encodeURIComponent(u1)}&user2=${encodeURIComponent(u2)}`,
      );
      const json = await res.json();

      if (!res.ok) {
        setErrorMsg(json.error || `Could not load comparison`);
        setViewState("not_found");
      } else {
        setData(json);
        setViewState("result");
      }
    } catch {
      setErrorMsg("Failed to connect to comparison service");
      setViewState("not_found");
    } finally {
      setLoading(false);
    }
  };

  // Sync with URL params
  useEffect(() => {
    if (paramU1 && paramU2) {
      setInput1(paramU1);
      setInput2(paramU2);
      performFetch(paramU1, paramU2);
    } else if (paramU1 && !paramU2) {
      setInput1(paramU1);
      setInput2("");
      setViewState("empty");
    } else if (!paramU1 && !paramU2) {
      // Default initial view
      setViewState("result");
    }
  }, [paramU1, paramU2]);

  // Handle compare trigger
  const handleCompare = (e?: React.FormEvent) => {
    e?.preventDefault();
    const clean1 = input1.trim().replace(/^@/, "");
    const clean2 = input2.trim().replace(/^@/, "");

    if (!clean1 || !clean2) {
      setViewState("empty");
      return;
    }

    startTransition(() => {
      router.push(`/compare?user1=${encodeURIComponent(clean1)}&user2=${encodeURIComponent(clean2)}`);
    });
    performFetch(clean1, clean2);
  };

  // Swap users
  const handleSwap = () => {
    const next1 = input2;
    const next2 = input1;
    setInput1(next1);
    setInput2(next2);

    if (next1 && next2) {
      startTransition(() => {
        router.push(`/compare?user1=${encodeURIComponent(next1)}&user2=${encodeURIComponent(next2)}`);
      });
      performFetch(next1, next2);
    }
  };

  // Preset click
  const handlePresetClick = (p1: string, p2: string) => {
    setInput1(p1);
    setInput2(p2);
    startTransition(() => {
      router.push(`/compare?user1=${encodeURIComponent(p1)}&user2=${encodeURIComponent(p2)}`);
    });
    performFetch(p1, p2);
  };

  const recentlyViewed = [
    { label: data?.user1.login || "ritesh5585", href: `/profiles?username=${data?.user1.login || "ritesh5585"}` },
    { label: data?.user2.login || "priya-dev", href: `/profiles?username=${data?.user2.login || "priya-dev"}` },
    { label: "vercel/next.js", href: "#" },
  ];

  return (
    <div className="flex h-screen bg-[#08090f] text-zinc-100 antialiased overflow-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* ── Left Sidebar ─────────────────────────────────────────────────── */}
      <div className="hidden md:flex w-56 shrink-0 flex-col h-full z-20">
        <DashboardSidebar
          username={data?.user1?.login || input1}
          activeTab="compare"
          recentlyViewed={recentlyViewed}
        />
      </div>

      {/* ── Mobile Sidebar Drawer ────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-64 h-full bg-[#0d0e17] z-10 flex flex-col">
            <div className="flex justify-end p-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <DashboardSidebar
              username={data?.user1?.login || input1}
              activeTab="compare"
              recentlyViewed={recentlyViewed}
              onItemClick={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* ── Main View Area ──────────────────────────────────────────────── */}
      <div className="relative flex-1 flex flex-col min-w-0 overflow-hidden bg-[#08090f]">
        {/* Glow Effects */}
        <div className="hero-glow" />
        <div className="hero-grid absolute inset-0 opacity-[0.06] pointer-events-none" />

        {/* Mobile Top Header */}
        <div className="flex md:hidden items-center justify-between px-4 py-3 border-b border-zinc-800/80 bg-[#0d0e17]/80 backdrop-blur-md z-30">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
              S
            </div>
            <span className="font-bold text-sm text-white">Compare Developers</span>
          </div>
          <Link
            href="/"
            className="text-xs text-zinc-400 hover:text-zinc-200"
          >
            Home
          </Link>
        </div>

        {/* Scrollable Container */}
        <div className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-8 py-6 max-w-5xl mx-auto w-full space-y-6">
          {/* Header Title & Subtitle */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <span>Compare developers</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 font-normal">
              Two GitHub accounts, same metrics, last 12 months.
            </p>
          </div>

          {/* Interactive Search Bar (Image 2 style) */}
          <form
            onSubmit={handleCompare}
            className="flex flex-col sm:flex-row items-center gap-2.5 w-full"
          >
            <div className="flex items-center flex-1 w-full gap-2 rounded-xl border border-zinc-800 bg-[#0e111c] px-3 py-1.5 focus-within:border-zinc-700 transition-colors">
              {/* User 1 input */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50 shrink-0" />
                <input
                  type="text"
                  value={input1}
                  onChange={(e) => setInput1(e.target.value)}
                  placeholder="ritesh5585"
                  className="w-full bg-transparent text-sm text-white placeholder-zinc-500 outline-none font-medium truncate"
                />
              </div>

              {/* Swap Button */}
              <button
                type="button"
                onClick={handleSwap}
                title="Swap accounts"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors shrink-0 cursor-pointer"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>

              {/* User 2 input */}
              <div className="flex items-center gap-2 flex-1 min-w-0 border-l border-zinc-800 pl-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50 shrink-0" />
                <input
                  type="text"
                  value={input2}
                  onChange={(e) => setInput2(e.target.value)}
                  placeholder="priya-dev"
                  className="w-full bg-transparent text-sm text-white placeholder-zinc-500 outline-none font-medium truncate"
                />
              </div>
            </div>

            {/* Compare Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                  <span>Loading...</span>
                </>
              ) : (
                <span>Compare</span>
              )}
            </button>
          </form>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
            <span>Presets:</span>
            <button
              type="button"
              onClick={() => handlePresetClick("ritesh5585", "priya-dev")}
              className="text-zinc-400 hover:text-white hover:underline cursor-pointer"
            >
              ritesh5585 vs priya-dev
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => handlePresetClick("shadcn", "leerob")}
              className="text-zinc-400 hover:text-white hover:underline cursor-pointer"
            >
              shadcn vs leerob
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => handlePresetClick("torvalds", "antirez")}
              className="text-zinc-400 hover:text-white hover:underline cursor-pointer"
            >
              torvalds vs antirez
            </button>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════
              VIEW STATE: RESULT
             ═══════════════════════════════════════════════════════════════════ */}
          {viewState === "result" && data && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Profile Cards (Image 2 style) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Dev 1 Profile Card */}
                <div className="flex items-center gap-4 p-4 rounded-2xl border border-zinc-800/80 bg-[#0e111c]/60 backdrop-blur-md">
                  <div className="relative">
                    {data.user1.avatarUrl ? (
                      <img
                        src={data.user1.avatarUrl}
                        alt={data.user1.login}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-blue-500/50"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl ring-2 ring-blue-500/50">
                        {data.user1.login[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-white truncate">
                      {data.user1.name || data.user1.login}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                      <Link
                        href={`/profiles?username=${data.user1.login}`}
                        className="text-blue-400 hover:underline flex items-center gap-0.5"
                      >
                        @{data.user1.login}
                      </Link>
                      <span>·</span>
                      <a
                        href={data.user1.url}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-zinc-200 inline-flex items-center gap-0.5"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5 truncate">
                      {data.user1.location ? `${data.user1.location} · ` : ""}
                      {data.user1.joinedFormatted}
                    </p>
                  </div>
                </div>

                {/* Dev 2 Profile Card */}
                <div className="flex items-center gap-4 p-4 rounded-2xl border border-zinc-800/80 bg-[#0e111c]/60 backdrop-blur-md">
                  <div className="relative">
                    {data.user2.avatarUrl ? (
                      <img
                        src={data.user2.avatarUrl}
                        alt={data.user2.login}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-amber-500/50"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold text-xl ring-2 ring-amber-500/50">
                        {data.user2.login[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-white truncate">
                      {data.user2.name || data.user2.login}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                      <Link
                        href={`/profiles?username=${data.user2.login}`}
                        className="text-amber-400 hover:underline flex items-center gap-0.5"
                      >
                        @{data.user2.login}
                      </Link>
                      <span>·</span>
                      <a
                        href={data.user2.url}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-zinc-200 inline-flex items-center gap-0.5"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5 truncate">
                      {data.user2.location ? `${data.user2.location} · ` : ""}
                      {data.user2.joinedFormatted}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dynamic Lead / Edge Statement */}
              {data.verdict && (
                <div className="text-sm font-medium text-zinc-300 px-1 leading-relaxed">
                  {data.verdict}
                </div>
              )}

              {/* ── Numbers Section (Image 2 style) ────────────────────────── */}
              <div className="space-y-3 pt-2">
                <h2 className="text-base font-bold text-white tracking-tight">Numbers</h2>
                <div className="p-4 sm:p-5 rounded-2xl border border-zinc-800/80 bg-[#0e111c]/60 backdrop-blur-md space-y-1">
                  <MetricComparisonRow
                    label="Followers"
                    v1={data.user1.followers}
                    v2={data.user2.followers}
                  />
                  <MetricComparisonRow
                    label="Following"
                    v1={data.user1.following}
                    v2={data.user2.following}
                  />
                  <MetricComparisonRow
                    label="Public repos"
                    v1={data.user1.publicRepos}
                    v2={data.user2.publicRepos}
                  />
                  <MetricComparisonRow
                    label="Stars received"
                    v1={data.user1.totalStars}
                    v2={data.user2.totalStars}
                  />
                  <MetricComparisonRow
                    label="Contributions"
                    v1={data.user1.totalContributions}
                    v2={data.user2.totalContributions}
                  />
                  <MetricComparisonRow
                    label="Commits"
                    v1={data.user1.totalCommits}
                    v2={data.user2.totalCommits}
                  />
                </div>
              </div>

              {/* ── Contributions Per Month (Image 1 style) ────────────────── */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h2 className="text-base font-bold text-white tracking-tight">
                    Contributions per month
                  </h2>
                  <div className="flex items-center gap-4 text-xs font-medium">
                    <div className="flex items-center gap-1.5 text-zinc-300">
                      <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
                      <span>{data.user1.login}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-300">
                      <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
                      <span>{data.user2.login}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl border border-zinc-800/80 bg-[#0e111c]/60 backdrop-blur-md">
                  <div className="w-full h-64 sm:h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={data.monthlyData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#27272a"
                          vertical={false}
                          opacity={0.3}
                        />
                        <XAxis
                          dataKey="month"
                          stroke="#71717a"
                          fontSize={11}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#71717a"
                          fontSize={11}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          content={
                            <CustomMonthlyTooltip
                              u1Name={data.user1.login}
                              u2Name={data.user2.login}
                            />
                          }
                          cursor={{ fill: "rgba(255, 255, 255, 0.04)" }}
                        />
                        <Bar
                          dataKey="u1"
                          name={data.user1.login}
                          fill="#3b82f6"
                          radius={[3, 3, 0, 0]}
                          maxBarSize={24}
                        />
                        <Bar
                          dataKey="u2"
                          name={data.user2.login}
                          fill="#f59e0b"
                          radius={[3, 3, 0, 0]}
                          maxBarSize={24}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* ── Languages Section (Image 1 style) ──────────────────────── */}
              <div className="space-y-3 pt-2">
                <h2 className="text-base font-bold text-white tracking-tight">Languages</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Dev 1 Languages */}
                  <div className="p-4 sm:p-5 rounded-2xl border border-zinc-800/80 bg-[#0e111c]/60 backdrop-blur-md space-y-3">
                    <p className="text-xs text-zinc-400 font-medium">
                      <span className="text-white font-bold">{data.user1.login}</span> · by repository count
                    </p>

                    {/* Segmented Bar */}
                    <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-zinc-800 gap-0.5">
                      {data.user1.languages.map((l) => (
                        <div
                          key={l.name}
                          style={{
                            width: `${l.percent}%`,
                            backgroundColor: l.color || "#3b82f6",
                          }}
                          title={`${l.name}: ${l.count} repos (${l.percent}%)`}
                          className="h-full first:rounded-l-full last:rounded-r-full transition-all"
                        />
                      ))}
                    </div>

                    {/* Language List */}
                    <div className="space-y-2 pt-2">
                      {data.user1.languages.map((l) => (
                        <div
                          key={l.name}
                          className="flex items-center justify-between text-xs sm:text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: l.color || "#3b82f6" }}
                            />
                            <span className="text-zinc-200 font-medium">{l.name}</span>
                          </div>
                          <span className="text-zinc-400 tabular-nums">
                            {l.count} repo{l.count === 1 ? "" : "s"}
                          </span>
                        </div>
                      ))}
                      {data.user1.languages.length === 0 && (
                        <p className="text-xs text-zinc-500">No language data available</p>
                      )}
                    </div>
                  </div>

                  {/* Dev 2 Languages */}
                  <div className="p-4 sm:p-5 rounded-2xl border border-zinc-800/80 bg-[#0e111c]/60 backdrop-blur-md space-y-3">
                    <p className="text-xs text-zinc-400 font-medium">
                      <span className="text-white font-bold">{data.user2.login}</span> · by repository count
                    </p>

                    {/* Segmented Bar */}
                    <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-zinc-800 gap-0.5">
                      {data.user2.languages.map((l) => (
                        <div
                          key={l.name}
                          style={{
                            width: `${l.percent}%`,
                            backgroundColor: l.color || "#f59e0b",
                          }}
                          title={`${l.name}: ${l.count} repos (${l.percent}%)`}
                          className="h-full first:rounded-l-full last:rounded-r-full transition-all"
                        />
                      ))}
                    </div>

                    {/* Language List */}
                    <div className="space-y-2 pt-2">
                      {data.user2.languages.map((l) => (
                        <div
                          key={l.name}
                          className="flex items-center justify-between text-xs sm:text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: l.color || "#f59e0b" }}
                            />
                            <span className="text-zinc-200 font-medium">{l.name}</span>
                          </div>
                          <span className="text-zinc-400 tabular-nums">
                            {l.count} repo{l.count === 1 ? "" : "s"}
                          </span>
                        </div>
                      ))}
                      {data.user2.languages.length === 0 && (
                        <p className="text-xs text-zinc-500">No language data available</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Most Starred Repositories (Image 1 style) ──────────────── */}
              <div className="space-y-3 pt-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Most starred repositories
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Dev 1 Repos */}
                  <div className="space-y-2">
                    {data.user1.topRepos.slice(0, 3).map((r) => (
                      <div
                        key={r.id}
                        className="p-3.5 rounded-xl border border-zinc-800/80 bg-[#0e111c]/60 hover:bg-[#131726] transition-colors flex items-center justify-between gap-3 group"
                      >
                        <div className="min-w-0">
                          <a
                            href={r.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors truncate block"
                          >
                            {r.name}
                          </a>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {r.language && (
                              <>
                                <span
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: r.languageColor || "#3b82f6" }}
                                />
                                <span className="text-[11px] text-zinc-400">
                                  {r.language}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-zinc-400 shrink-0 font-medium">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                          <span className="tabular-nums">{fmt(r.stars)} stars</span>
                        </div>
                      </div>
                    ))}
                    {data.user1.topRepos.length === 0 && (
                      <div className="p-4 rounded-xl border border-zinc-800 bg-[#0e111c]/40 text-xs text-zinc-500 text-center">
                        No public repositories found
                      </div>
                    )}
                  </div>

                  {/* Dev 2 Repos */}
                  <div className="space-y-2">
                    {data.user2.topRepos.slice(0, 3).map((r) => (
                      <div
                        key={r.id}
                        className="p-3.5 rounded-xl border border-zinc-800/80 bg-[#0e111c]/60 hover:bg-[#131726] transition-colors flex items-center justify-between gap-3 group"
                      >
                        <div className="min-w-0">
                          <a
                            href={r.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors truncate block"
                          >
                            {r.name}
                          </a>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {r.language && (
                              <>
                                <span
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: r.languageColor || "#f59e0b" }}
                                />
                                <span className="text-[11px] text-zinc-400">
                                  {r.language}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-zinc-400 shrink-0 font-medium">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                          <span className="tabular-nums">{fmt(r.stars)} stars</span>
                        </div>
                      </div>
                    ))}
                    {data.user2.topRepos.length === 0 && (
                      <div className="p-4 rounded-xl border border-zinc-800 bg-[#0e111c]/40 text-xs text-zinc-500 text-center">
                        No public repositories found
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              VIEW STATE: EMPTY
             ═══════════════════════════════════════════════════════════════════ */}
          {viewState === "empty" && (
            <div className="p-8 sm:p-12 rounded-2xl border border-zinc-800/80 bg-[#0e111c]/80 backdrop-blur-md text-center max-w-xl mx-auto space-y-4 my-8 animate-in fade-in">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400">
                <Users className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Enter two usernames
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Compare any two public GitHub accounts. You can also open a profile first and use Compare from there.
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePresetClick("ritesh5585", "priya-dev")}
                  className="px-3.5 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-xs text-zinc-200 transition-colors"
                >
                  Demo: ritesh5585 vs priya-dev
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetClick("shadcn", "leerob")}
                  className="px-3.5 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-xs text-zinc-200 transition-colors"
                >
                  shadcn vs leerob
                </button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              VIEW STATE: NOT FOUND
             ═══════════════════════════════════════════════════════════════════ */}
          {viewState === "not_found" && (
            <div className="p-8 sm:p-12 rounded-2xl border border-red-900/30 bg-[#0e111c]/80 backdrop-blur-md text-center max-w-xl mx-auto space-y-4 my-8 animate-in fade-in">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                We couldn&apos;t find &ldquo;{errorMsg?.match(/"([^"]+)"/)?.[1] || input2 || "priya-dve"}&rdquo;
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Check the spelling. Usernames can&apos;t contain spaces and are case-insensitive.
                {input1 ? ` The other user, ${input1}, loaded fine.` : ""}
              </p>
              <div className="pt-2 flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePresetClick("ritesh5585", "priya-dev")}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all"
                >
                  Load Sample Comparison
                </button>
              </div>
            </div>
          )}

          {/* ── Footer & Mockup View Switcher (Image 1/2 bottom) ──────────── */}
          <div className="pt-8 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-800/60 text-xs text-zinc-500">
            <div>
              Data from the GitHub API, last 12 months.
            </div>

            {/* Mockup Preview Switcher */}
            <div className="flex items-center rounded-lg border border-zinc-800 bg-[#0d0e17] p-1">
              <button
                type="button"
                onClick={() => setViewState("result")}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  viewState === "result"
                    ? "bg-zinc-800 text-white shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Result
              </button>
              <button
                type="button"
                onClick={() => setViewState("empty")}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  viewState === "empty"
                    ? "bg-zinc-800 text-white shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Empty
              </button>
              <button
                type="button"
                onClick={() => setViewState("not_found")}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  viewState === "not_found"
                    ? "bg-zinc-800 text-white shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Not found
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen bg-[#08090f] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
