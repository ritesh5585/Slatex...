import Link from "next/link";
import {
  Users,
  Star,
  ExternalLink,
  Trophy,
  Code2,
  FolderGit2,
  Flame,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/shared/back-button";
import { DashboardSidebar } from "@/components/user/dashboard-sidebar";
import {
  compareGitHubUsers,
  ComparedUser,
} from "@/lib/api/github/services/compare";
import { MonthlyContributionChart } from "@/components/compare/monthly-chart";
import { CompareSearchBar } from "@/components/compare/compare-search-bar";
import { GitHubGraphQLError } from "@/lib/api/github";

interface Props {
  searchParams: Promise<{ user1?: string; user2?: string }>;
}

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toLocaleString()}`;
  return n.toLocaleString();
}

function StatRow({
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
      <span className="text-left font-semibold text-zinc-300 tabular-nums">
        {fmt(v1)}
      </span>
      <div className="flex justify-end w-full h-2 bg-transparent rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500/80 rounded-full transition-all duration-500"
          style={{ width: `${Math.max(2, p1)}%` }}
        />
      </div>
      <div className="text-center font-medium text-zinc-400 whitespace-nowrap px-1 select-none text-[11px] sm:text-xs">
        {label}
      </div>
      <div className="flex justify-start w-full h-2 bg-transparent rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-500/90 rounded-full transition-all duration-500"
          style={{ width: `${Math.max(2, p2)}%` }}
        />
      </div>
      <span className="text-right font-semibold text-zinc-300 tabular-nums">
        {fmt(v2)}
      </span>
    </div>
  );
}

function ProfileCard({
  user,
  accent,
}: {
  user: ComparedUser;
  accent: "blue" | "amber";
}) {
  const ringClass = accent === "blue" ? "ring-blue-500/50" : "ring-amber-500/50";
  const textClass = accent === "blue" ? "text-blue-400" : "text-amber-400";

  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl border border-zinc-800/80 bg-[#0e111c]/60 backdrop-blur-md">
      {user.avatarUrl ? (
        <img
          src={user.avatarUrl}
          alt={user.login}
          className={`w-14 h-14 rounded-full object-cover ring-2 ${ringClass}`}
        />
      ) : (
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl text-white ring-2 ${ringClass} ${accent === "blue" ? "bg-blue-600" : "bg-amber-600"
            }`}
        >
          {user.login[0]?.toUpperCase()}
        </div>
      )}
      <div className="min-w-0">
        <h3 className="text-base font-bold text-white truncate">
          {user.name || user.login}
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
          <Link
            href={`/profiles?username=${user.login}`}
            className={`${textClass} hover:underline`}
          >
            @{user.login}
          </Link>
          <span>·</span>
          <a
            href={user.url}
            target="_blank"
            rel="noreferrer"
            className="hover:text-zinc-200 inline-flex items-center gap-0.5"
          >
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <p className="text-xs text-zinc-500 mt-0.5 truncate">
          {user.location ? `${user.location} · ` : ""}
          {user.joinedFormatted}
        </p>
      </div>
    </div>
  );
}

function LanguagesCard({ user, accentColor }: { user: ComparedUser; accentColor: string }) {
  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-zinc-800/80 bg-[#0e111c]/60 backdrop-blur-md space-y-3">
      <p className="text-xs text-zinc-400 font-medium">
        <span className="text-white font-bold">{user.login}</span> · by repository count
      </p>
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-zinc-800 gap-0.5">
        {user.languages.map((l) => (
          <div
            key={l.name}
            style={{ width: `${l.percent}%`, backgroundColor: l.color || accentColor }}
            title={`${l.name}: ${l.count} repos (${l.percent}%)`}
            className="h-full first:rounded-l-full last:rounded-r-full transition-all"
          />
        ))}
      </div>
      <div className="space-y-2 pt-1">
        {user.languages.map((l) => (
          <div key={l.name} className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: l.color || accentColor }}
              />
              <span className="text-zinc-200 font-medium">{l.name}</span>
            </div>
            <span className="text-zinc-400 tabular-nums">
              {l.count} repo{l.count === 1 ? "" : "s"}
            </span>
          </div>
        ))}
        {user.languages.length === 0 && (
          <p className="text-xs text-zinc-500">No language data found</p>
        )}
      </div>
    </div>
  );
}

function TopReposCard({ user, fallbackColor }: { user: ComparedUser; fallbackColor: string }) {
  return (
    <div className="space-y-2">
      {user.topRepos.slice(0, 3).map((r) => (
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
                    style={{ backgroundColor: r.languageColor || fallbackColor }}
                  />
                  <span className="text-[11px] text-zinc-400">{r.language}</span>
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
      {user.topRepos.length === 0 && (
        <div className="p-4 rounded-xl border border-zinc-800 bg-[#0e111c]/40 text-xs text-zinc-500 text-center">
          No public repositories found
        </div>
      )}
    </div>
  );
}

export default async function ComparePage({ searchParams }: Props) {
  const { user1, user2 } = await searchParams;

  // Empty state when either user is not provided
  if (!user1 || !user2) {
    return (
      <main className="min-h-screen bg-[#08090f] text-zinc-100 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full p-8 text-center border-zinc-800 bg-[#0e111c]/80 backdrop-blur-xl space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400">
            <Users className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-white tracking-tight">Compare Any Two Developers</h1>
            <p className="text-xs sm:text-sm text-zinc-400">
              Enter two GitHub usernames below to get a real side-by-side comparison.
            </p>
          </div>
          <CompareSearchBar initialU1={user1 || ""} initialU2={user2 || ""} />
          <div className="pt-2">
            <BackButton />
          </div>
        </Card>
      </main>
    );
  }

  // Real data fetching via GraphQL service
  let comparisonData;
  try {
    comparisonData = await compareGitHubUsers(user1, user2);
  } catch (err: any) {
    const message =
      err instanceof GitHubGraphQLError
        ? err.message
        : "Failed to load real comparison from GitHub";

    return (
      <main className="min-h-screen bg-[#08090f] text-zinc-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center border-red-900/40 bg-[#0e111c]/80 backdrop-blur-xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-white">Comparison Failed</h1>
          <p className="text-sm text-zinc-400">{message}</p>
          <div className="pt-2 flex justify-center gap-3">
            <BackButton />
          </div>
        </Card>
      </main>
    );
  }

  const { user1: a, user2: b, monthlyData, insight } = comparisonData;

  const recentlyViewed = [
    { label: a.login, href: `/profiles?username=${a.login}` },
    { label: b.login, href: `/profiles?username=${b.login}` },
  ];

  return (
    <div className="flex h-screen bg-[#08090f] text-zinc-100 antialiased overflow-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* ── Desktop Sidebar ─────────────────────────────────────────────── */}
      <div className="hidden md:flex w-56 shrink-0 flex-col h-full z-20">
        <DashboardSidebar
          username={a.login}
          activeTab="compare"
          recentlyViewed={recentlyViewed}
        />
      </div>

      <div className="relative flex-1 flex flex-col min-w-0 overflow-hidden bg-[#08090f]">
        <div className="hero-glow" />
        <div className="hero-grid absolute inset-0 opacity-[0.06] pointer-events-none" />

        <div className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-8 py-6 max-w-5xl mx-auto w-full space-y-7">
          {/* Header Title */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Compare developers
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400">
              Two real GitHub accounts, live metrics, last 12 months.
            </p>
          </div>

          {/* Interactive Search & Swap Bar */}
          <CompareSearchBar initialU1={a.login} initialU2={b.login} />

          {/* Profile Identity Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ProfileCard user={a} accent="blue" />
            <ProfileCard user={b} accent="amber" />
          </div>

          {/* Dynamic Verdict Callout */}
          <p className="text-sm font-medium text-zinc-300 leading-relaxed px-1">
            {insight.verdict}
          </p>

          <div className="space-y-4 pt-1">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Head-to-Head Analysis &amp; Who is Better</span>
              </h2>
              <Badge
                variant="secondary"
                className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300 font-medium text-xs px-2.5 py-0.5"
              >
                Leader: @{insight.overallWinner} ({insight.score.u1Wins} vs {insight.score.u2Wins})
              </Badge>
            </div>

            {/* 4 Core Domain Winner Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* More Projects */}
              <div className="p-4 rounded-xl border border-zinc-800 bg-[#0e111c]/70 backdrop-blur-md space-y-1">
                <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold">
                  <FolderGit2 className="w-4 h-4 text-indigo-400" />
                  <span>More Projects</span>
                </div>
                <div className="text-base font-bold text-white">
                  @{insight.moreProjects.winner}
                </div>
                <p className="text-[11px] text-zinc-400">
                  {insight.moreProjects.count} public repos ({insight.moreProjects.diff} more)
                </p>
              </div>

              {/* Best Content & Stars */}
              <div className="p-4 rounded-xl border border-zinc-800 bg-[#0e111c]/70 backdrop-blur-md space-y-1">
                <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold">
                  <Star className="w-4 h-4 text-amber-400" />
                  <span>Best Content &amp; Impact</span>
                </div>
                <div className="text-base font-bold text-white">
                  @{insight.bestContent.winner}
                </div>
                <p className="text-[11px] text-zinc-400">
                  {insight.bestContent.stars.toLocaleString()} total stars (Top: {insight.bestContent.topRepo})
                </p>
              </div>

              {/* Higher Activity */}
              <div className="p-4 rounded-xl border border-zinc-800 bg-[#0e111c]/70 backdrop-blur-md space-y-1">
                <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold">
                  <Flame className="w-4 h-4 text-rose-400" />
                  <span>Highest Activity</span>
                </div>
                <div className="text-base font-bold text-white">
                  @{insight.mostActive.winner}
                </div>
                <p className="text-[11px] text-zinc-400">
                  {insight.mostActive.contributions.toLocaleString()} contributions (1y)
                </p>
              </div>
            </div>

            {/* Language Breakdown & Specialization */}
            <div className="p-4 rounded-xl border border-zinc-800 bg-[#0e111c]/70 backdrop-blur-md space-y-2 text-xs">
              <div className="flex items-center gap-2 font-semibold text-zinc-300">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <span>Languages &amp; Tech Stack Comparison</span>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                {insight.languageAnalysis.summary}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-[11px] bg-blue-500/10 border border-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded-full">
                  @{a.login}: {insight.languageAnalysis.u1Langs.join(", ") || "General"}
                </span>
                <span className="text-[11px] bg-amber-500/10 border border-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full">
                  @{b.login}: {insight.languageAnalysis.u2Langs.join(", ") || "General"}
                </span>
              </div>
            </div>

            {/* Strengths Side-by-Side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-blue-900/30 bg-[#0e111c]/60 space-y-2">
                <div className="font-semibold text-blue-400">Why @{a.login} shines:</div>
                <div className="space-y-1">
                  {insight.strengths.u1.map((s, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-zinc-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-amber-900/30 bg-[#0e111c]/60 space-y-2">
                <div className="font-semibold text-amber-400">Why @{b.login} shines:</div>
                <div className="space-y-1">
                  {insight.strengths.u2.map((s, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-zinc-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Numbers Section ───────────────────────────────────────────── */}
          <div className="space-y-3 pt-2">
            <h2 className="text-base font-bold text-white tracking-tight">Numbers</h2>
            <div className="p-4 sm:p-5 rounded-2xl border border-zinc-800/80 bg-[#0e111c]/60 backdrop-blur-md space-y-1">
              <StatRow label="Followers" v1={a.followers} v2={b.followers} />
              <StatRow label="Following" v1={a.following} v2={b.following} />
              <StatRow label="Public repos" v1={a.publicRepos} v2={b.publicRepos} />
              <StatRow label="Stars received" v1={a.totalStars} v2={b.totalStars} />
              <StatRow label="Contributions" v1={a.totalContributions} v2={b.totalContributions} />
              <StatRow label="Commits" v1={a.totalCommits} v2={b.totalCommits} />
            </div>
          </div>

          {/* ── Contributions per Month Chart ─────────────────────────────── */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white tracking-tight">
                Contributions per month
              </h2>
              <div className="flex items-center gap-4 text-xs font-medium">
                <div className="flex items-center gap-1.5 text-zinc-300">
                  <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
                  <span>@{a.login}</span>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-300">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
                  <span>@{b.login}</span>
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-5 rounded-2xl border border-zinc-800/80 bg-[#0e111c]/60 backdrop-blur-md">
              <MonthlyContributionChart
                data={monthlyData}
                u1Name={a.login}
                u2Name={b.login}
              />
            </div>
          </div>

          {/* ── Languages Section ─────────────────────────────────────────── */}
          <div className="space-y-3 pt-2">
            <h2 className="text-base font-bold text-white tracking-tight">Languages</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <LanguagesCard user={a} accentColor="#3b82f6" />
              <LanguagesCard user={b} accentColor="#f59e0b" />
            </div>
          </div>

          <div className="space-y-3 pt-2 pb-6">
            <h2 className="text-base font-bold text-white tracking-tight">
              Most starred repositories
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TopReposCard user={a} fallbackColor="#3b82f6" />
              <TopReposCard user={b} fallbackColor="#f59e0b" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}