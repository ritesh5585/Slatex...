import {
  UserX,
  AlertCircle,
  RefreshCw,
  GitCommit,
  Layers,
  Calendar,
  ArrowLeft,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { DashboardSidebar } from "@/components/user/dashboard-sidebar";
import { DashboardHeader } from "@/components/user/dashboard-header";
import { CommitRepoCards } from "@/components/user/commit-repo-cards";
import { ContributionHeatmap } from "@/components/user/contribution-heatmap";
import { CommitActivity } from "@/components/user/commit-activity";
import { Card } from "@/components/ui/card";
import ErrorPage from "@/components/shared/Error";

import {
  getUserByUsername,
  getUserCommitActivity,
  NotFoundError,
  RateLimitError,
} from "@/lib/api/github";

interface Props {
  searchParams: Promise<{ username?: string }>;
}


export default async function UserCommitsPage({ searchParams }: Props) {
  const { username } = await searchParams;

  if (!username || !username.trim()) {
    return (
      <ErrorPage
        icon={AlertCircle}
        iconClass="bg-amber-500/10 text-amber-400 ring-amber-500/20"
        title="No Username Provided"
        description="Please provide a valid GitHub username to view commit activity."
      />
    );
  }

  const cleanUsername = username.trim().replace(/^@/, "");
  let user: Awaited<ReturnType<typeof getUserByUsername>>;
  let commitActivity: Awaited<ReturnType<typeof getUserCommitActivity>>;

  try {
    [user, commitActivity] = await Promise.all([
      getUserByUsername(cleanUsername),
      getUserCommitActivity(cleanUsername),
    ]);
  } catch (err) {
    if (err instanceof NotFoundError) {
      return (
        <ErrorPage
          icon={UserX}
          iconClass="bg-red-500/10 text-red-400 ring-red-500/20"
          title="User Not Found"
          description={
            <>
              Could not find GitHub user{" "}
              <span className="font-semibold text-zinc-200">
                @{cleanUsername}
              </span>
              . Please verify the username.
            </>
          }
        />
      );
    }
    if (err instanceof RateLimitError) {
      return (
        <ErrorPage
          icon={RefreshCw}
          iconClass="bg-amber-500/10 text-amber-400 ring-amber-500/20"
          title="API Rate Limit Reached"
          description="GitHub rate limit reached. Please wait a minute and reload."
        />
      );
    }
    return (
      <ErrorPage
        icon={AlertCircle}
        iconClass="bg-red-500/10 text-red-400 ring-red-500/20"
        title="Unable to Fetch Commits"
        description="An error occurred while fetching commit data from GitHub. Please try again."
      />
    );
  }

  const formattedContrDays = commitActivity.contributions.map((c) => ({
    date: c.date,
    count: c.contributionCount,
  }));

  const recentlyViewed = [
    { label: "vercel/next.js", href: "#" },
    { label: "facebook/react", href: "#" },
    { label: user.login, href: `/profiles?username=${encodeURIComponent(user.login)}` },
  ];

  return (
    <main className="h-screen bg-[#08090f] text-zinc-100 antialiased flex overflow-hidden">
      {/* ── Desktop Sidebar ──────────────────────────────────────────────── */}
      <div className="hidden md:flex w-52 shrink-0 flex-col h-full">
        <DashboardSidebar
          username={cleanUsername}
          activeTab="commits"
          recentlyViewed={recentlyViewed}
        />
      </div>

      {/* ── Main Content Area ────────────────────────────────────────────── */}
      <div className="relative flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="hero-glow" />
        <div className="hero-grid absolute inset-0 opacity-[0.06] pointer-events-none" />
        {/* Top Bar with Mobile Nav & Search */}
        <DashboardHeader
          username={cleanUsername}
          userUrl={user.url}
          activeTab="commits"
          recentlyViewed={recentlyViewed}
        />

        {/* Scrollable Container */}
        <div className="relative z-10 flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 py-6 space-y-6 max-w-6xl mx-auto">
            {/* Page Header Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-md">
              <div className="flex items-center gap-3.5">
                <Link
                  href={`/profiles?username=${encodeURIComponent(cleanUsername)}`}
                  className="relative group shrink-0"
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.name || user.login}
                    className="h-12 w-12 rounded-full ring-2 ring-zinc-700 shadow-md group-hover:ring-indigo-500 transition-all"
                  />
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-zinc-900" />
                </Link>

                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      Commit & Contribution Insights
                    </h1>
                    <span className="rounded-full bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 text-xs font-semibold text-indigo-400">
                      {commitActivity.totalCommitContributions} commits
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Activity & repository commit breakdown for{" "}
                    <strong className="text-zinc-200">@{user.login}</strong>
                  </p>
                </div>
              </div>

              {/* Navigation Back Button */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <Link
                  href={`/profiles?username=${encodeURIComponent(cleanUsername)}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-800 bg-[#0e111c] text-xs font-medium text-zinc-300 hover:text-white hover:border-zinc-700 hover:bg-[#141829] transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to Overview</span>
                </Link>
              </div>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card className="p-4 border-zinc-800/60 bg-zinc-900/40 backdrop-blur-md">
                <div className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
                  <GitCommit className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Total Commits</span>
                </div>
                <div className="text-2xl font-bold text-white mt-1 tabular-nums">
                  {commitActivity.totalCommitContributions.toLocaleString()}
                </div>
                <div className="text-[11px] text-zinc-500 mt-0.5">In the past 12 months</div>
              </Card>

              <Card className="p-4 border-zinc-800/60 bg-zinc-900/40 backdrop-blur-md">
                <div className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Active Repos</span>
                </div>
                <div className="text-2xl font-bold text-white mt-1 tabular-nums">
                  {commitActivity.totalRepositoriesWithContributedCommits ||
                    commitActivity.repoCommitContributions.length}
                </div>
                <div className="text-[11px] text-zinc-500 mt-0.5">Repositories pushed to</div>
              </Card>

              <Card className="p-4 border-zinc-800/60 bg-zinc-900/40 backdrop-blur-md">
                <div className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Total Contributions</span>
                </div>
                <div className="text-2xl font-bold text-white mt-1 tabular-nums">
                  {commitActivity.totalContributions.toLocaleString()}
                </div>
                <div className="text-[11px] text-zinc-500 mt-0.5">All activities combined</div>
              </Card>

              <Card className="p-4 border-zinc-800/60 bg-zinc-900/40 backdrop-blur-md">
                <div className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Active Days</span>
                </div>
                <div className="text-2xl font-bold text-white mt-1 tabular-nums">
                  {formattedContrDays.filter((d) => d.count > 0).length}
                </div>
                <div className="text-[11px] text-zinc-500 mt-0.5">Days with recorded activity</div>
              </Card>
            </div>

            {/* ── Active Repositories Section (User Request) ──────────────── */}
            <CommitRepoCards
              repoContributions={commitActivity.repoCommitContributions}
              username={cleanUsername}
            />

            {/* ── Commit Activity & Heatmap ──────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Heatmap Card */}
              <Card className="p-5 border-zinc-800/60 bg-zinc-900/40 backdrop-blur-md">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-white">Annual Contribution Heatmap</h2>
                  <span className="text-[11px] text-zinc-500 bg-zinc-800/60 rounded-full px-2.5 py-0.5 border border-zinc-700/40">
                    Past 365 Days
                  </span>
                </div>
                <ContributionHeatmap contributions={formattedContrDays} />
              </Card>

              {/* Weekly Commit Activity */}
              <Card className="p-5 border-zinc-800/60 bg-zinc-900/40 backdrop-blur-md">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-white">Weekly Commit Pace</h2>
                  <span className="text-[11px] text-zinc-500 bg-zinc-800/60 rounded-full px-2.5 py-0.5 border border-zinc-700/40">
                    Last 12 weeks
                  </span>
                </div>
                <CommitActivity contributions={formattedContrDays} />
              </Card>
            </div>

            {/* ── Recent Activity Feed ───────────────────────────────────── */}
            <Card className="p-5 border-zinc-800/60 bg-zinc-900/40 backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-white">Recent Commit Log</h2>
                <a
                  href={user.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  View GitHub profile →
                </a>
              </div>

              <div className="space-y-0 divide-y divide-zinc-800/50">
                {formattedContrDays
                  .filter((d) => d.count > 0)
                  .slice(-8)
                  .reverse()
                  .map((day) => {
                    const date = new Date(day.date);
                    const formattedDate = date.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    });
                    const daysAgo = Math.round(
                      (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24),
                    );
                    const timeLabel =
                      daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : `${daysAgo}d ago`;

                    return (
                      <div
                        key={day.date}
                        className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                      >
                        <div className="flex items-center gap-3">
                          <span className="h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
                          <div>
                            <div className="text-sm font-medium text-zinc-200">
                              {day.count} contribution{day.count !== 1 ? "s" : ""} pushed
                            </div>
                            <div className="text-xs text-zinc-500">{formattedDate}</div>
                          </div>
                        </div>
                        <span className="text-xs font-mono text-zinc-400 bg-zinc-800/60 px-2 py-0.5 rounded-md border border-zinc-700/40">
                          {timeLabel}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </Card>

            {/* Footer */}
            <footer className="pt-6 pb-12 text-center text-xs text-zinc-700">
              <p>Slatex... commit analytics · Powered by public GitHub API</p>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}
