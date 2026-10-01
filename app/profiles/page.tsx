import { UserX, AlertCircle, RefreshCw, MapPin, Calendar } from "lucide-react";
import { type GitHubRepo } from "@/components/user/repo-card";
import { Card } from "@/components/ui/card";
import { ContributionStreaks } from "@/components/user/contro-streaks";
import { BackButton } from "@/components/shared/back-button";
import { DashboardSidebar } from "@/components/user/dashboard-sidebar";
import { DashboardHeader } from "@/components/user/dashboard-header";
import { ContributionHeatmap } from "@/components/user/contribution-heatmap";
import { CommitActivity } from "@/components/user/commit-activity";
import { getLanguageColor } from "@/lib/language-colors";
import Link from "next/link";

import {
  getUserByUsername,
  getUserRepos,
  getUserContributions,
  NotFoundError,
  RateLimitError,
} from "@/lib/api/github";

interface Props {
  searchParams: Promise<{ username?: string }>;
}

// ── Error / empty states ──────────────────────────────────────────────────────
function ErrorPage({ icon: Icon, iconClass, title, description }: {
  icon: React.ElementType; iconClass: string; title: string; description: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
      
      <Card className="max-w-md w-full p-8 text-center border-zinc-800 bg-zinc-900/60 backdrop-blur-xl space-y-4">
        <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ring-1 ${iconClass}`}>
          <Icon className="h-7 w-7" />
        </div>
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-white">{title}</h1>
          <p className="text-sm text-zinc-400">{description}</p>
        </div>
        <div className="pt-2 flex justify-center"><BackButton /></div>
      </Card>
    </main>
  );
}

export default async function ResultPage({ searchParams }: Props) {
  const { username } = await searchParams;

  if (!username || !username.trim()) {
    return (
      <ErrorPage
        icon={AlertCircle}
        iconClass="bg-amber-500/10 text-amber-400 ring-amber-500/20"
        title="No Username Provided"
        description="Please enter a valid GitHub username to analyze developer statistics."
      />
    );
  }

  const cleanUsername = username.trim().replace(/^@/, "");
  let user: Awaited<ReturnType<typeof getUserByUsername>>;
  let userRepos: Awaited<ReturnType<typeof getUserRepos>>;
  let contributionData: Awaited<ReturnType<typeof getUserContributions>>;

  try {
    [user, userRepos, contributionData] = await Promise.all([
      getUserByUsername(cleanUsername),
      getUserRepos(cleanUsername),
      getUserContributions(cleanUsername),
    ]);
  } catch (err) {
    if (err instanceof NotFoundError) {
      return (
        <ErrorPage
          icon={UserX}
          iconClass="bg-red-500/10 text-red-400 ring-red-500/20"
          title="User Not Found"
          description={<>Could not find GitHub user <span className="font-semibold text-zinc-200">@{cleanUsername}</span>. Please check the spelling and try again.</>}
        />
      );
    }
    if (err instanceof RateLimitError) {
      return (
        <ErrorPage
          icon={RefreshCw}
          iconClass="bg-amber-500/10 text-amber-400 ring-amber-500/20"
          title="API Rate Limit Reached"
          description="GitHub hourly limit reached. Please wait a minute and reload."
        />
      );
    }
    return (
      <ErrorPage
        icon={AlertCircle}
        iconClass="bg-red-500/10 text-red-400 ring-red-500/20"
        title="Unable to Fetch Data"
        description="An error occurred while fetching details from GitHub. Please try again later."
      />
    );
  }

  // ── Data preparation ───────────────────────────────────────────────────────
  const repos: GitHubRepo[] = userRepos.map((repo) => ({
    id: repo.id,
    name: repo.name,
    owner: { login: user.login, avatar_url: user.avatarUrl },
    description: repo.description,
    html_url: repo.url,
    language: repo.primaryLanguage?.name ?? null,
    stargazers_count: repo.stargazerCount,
    forks_count: repo.forkCount,
    updated_at: repo.updatedAt,
    topics: repo.repositoryTopics.nodes.map(({ topic }) => topic.name),
  }));

  const languageCount: Record<string, number> = {};
  repos.forEach((repo) => {
    if (repo.language) languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
  });
  const topLanguages: [string, number][] = Object.entries(languageCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const totalLangCount = topLanguages.reduce((s, [, c]) => s + c, 0);

  const contributions = contributionData.contributions.map((day) => ({
    date: day.date,
    count: day.contributionCount,
  }));
  const totalContributions = contributionData.totalContributions;

  // Top 4 repos by stars for the sidebar
  const topRepos = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 4);
  const recentRepos = [...repos].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()).slice(0, 4);

  const formattedJoinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : null;

  const recentlyViewed = [
    { label: "vercel/next.js", href: "#" },
    { label: "facebook/react", href: "#" },
    { label: user.login, href: "#" },
  ];

  return (
    <main className="h-screen bg-[#08090f] text-zinc-100 antialiased flex overflow-hidden">
      {/* ── Left Sidebar ─────────────────────────────────────────────────── */}
      <div className="hidden md:flex w-52 shrink-0 flex-col h-full">
        <DashboardSidebar
          username={cleanUsername}
          activeTab="overview"
          recentlyViewed={recentlyViewed}
        />
      </div>

      {/* ── Main Content Area ─────────────────────────────────────────────── */}
      <div className="relative flex-1 flex flex-col min-w-0 overflow-hidden bg-[#08090f] selection:bg-indigo-500/30 selection:text-indigo-200">
        <div className="hero-glow" />
        <div className="hero-grid absolute inset-0 opacity-[0.06] pointer-events-none" />
        <DashboardHeader
          username={cleanUsername}
          userUrl={user.url}
          activeTab="overview"
          recentlyViewed={recentlyViewed}
        />

        {/* Scrollable Content */}
        <div className="relative z-10 flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 py-6 space-y-5 max-w-6xl mx-auto">

            {/* ── Profile Hero Card ──────────────────────────────────────── */}
            <Card className="p-5 border-zinc-800/60 bg-zinc-900/40 backdrop-blur-md">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <img
                    src={user.avatarUrl}
                    alt={user.name || user.login}
                    className="h-16 w-16 rounded-full ring-2 ring-zinc-700 shadow-xl"
                  />
                  <span className="absolute bottom-0.5 right-0.5 flex h-3.5 w-3.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                    <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-zinc-900 bg-emerald-500" />
                  </span>
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <h1 className="text-xl font-bold text-white tracking-tight">{user.name || user.login}</h1>
                    <span className="text-sm text-zinc-500 font-mono">@{user.login}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-zinc-500">
                    {user.location && (
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{user.location}</span>
                    )}
                    {formattedJoinDate && (
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Joined {formattedJoinDate}</span>
                    )}
                    <a href={user.url} target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300 transition-colors">
                      github.com/{user.login}
                    </a>
                  </div>
                  {user.bio && <p className="mt-2 text-sm text-zinc-300 leading-relaxed">{user.bio}</p>}
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-4 border-t border-zinc-800/60">
                {[
                  { label: "Public repos", value: user.repositories.totalCount },
                  { label: "Followers", value: user.followers.totalCount },
                  { label: "Following", value: user.following.totalCount },
                  { label: "Contributions", value: totalContributions },
                ].map(({ label, value }) => (
                  <div key={label} className="text-center">
                    <div className="text-2xl font-bold text-white tabular-nums">{value.toLocaleString()}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* ── Streaks Row ───────────────────────────────────────────── */}
            <ContributionStreaks contributions={contributions} totalContributions={totalContributions} />

            {/* ── Middle Row: Contributions + Top Languages ─────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Contributions Heatmap */}
              <Card className="lg:col-span-2 p-5 border-zinc-800/60 bg-zinc-900/40 backdrop-blur-md">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-white">Contributions</h2>
                  <span className="text-[11px] text-zinc-500 bg-zinc-800/60 rounded-full px-2.5 py-1 border border-zinc-700/40">Last 12 months</span>
                </div>
                <ContributionHeatmap contributions={contributions} />
              </Card>

              {/* Top Languages */}
              <Card className="p-5 border-zinc-800/60 bg-zinc-900/40 backdrop-blur-md">
                <h2 className="text-sm font-semibold text-white mb-4">Top languages</h2>
                <div className="space-y-3">
                  {topLanguages.map(([name, count]) => {
                    const pct = totalLangCount > 0 ? Math.round((count / totalLangCount) * 100) : 0;
                    const color = getLanguageColor(name);
                    return (
                      <div key={name} className="flex items-center gap-3">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                          <span className="text-sm text-zinc-200 truncate">{name}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="w-20 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
                          </div>
                          <span className="text-xs text-zinc-500 tabular-nums w-8 text-right">{pct}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* ── Bottom Row: Commit Activity + Repositories ────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Commit Activity */}
              <Card className="p-5 border-zinc-800/60 bg-zinc-900/40 backdrop-blur-md">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-white">Commit activity</h2>
                  <span className="text-[11px] text-zinc-500 bg-zinc-800/60 rounded-full px-2.5 py-1 border border-zinc-700/40">Last 12 weeks</span>
                </div>
                <CommitActivity contributions={contributions} />
              </Card>

              {/* Repositories */}
              <Card className="p-5 border-zinc-800/60 bg-zinc-900/40 backdrop-blur-md">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-white">Repositories</h2>
                  <div className="flex gap-1 text-xs">
                    <span className="px-2.5 py-1 rounded-full bg-zinc-700/50 text-zinc-300 font-medium">Top</span>
                    <span className="px-2.5 py-1 rounded-full text-zinc-500 hover:bg-zinc-800/60 cursor-pointer transition-colors">Recent</span>
                  </div>
                </div>
                <div className="space-y-0 divide-y divide-zinc-800/50">
                  {topRepos.map((repo) => {
                    const color = getLanguageColor(repo.language);
                    return (
                      <Link
                        key={repo.id}
                        href={`/repo?owner=${repo.owner.login}&repo=${repo.name}`}
                        className="flex items-start gap-3 py-3 first:pt-0 last:pb-0 group hover:bg-zinc-800/20 -mx-1 px-1 rounded-lg transition-colors"
                      >
                        <span className="mt-1.5 h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold text-zinc-100 group-hover:text-white truncate">{repo.name}</div>
                          {repo.description && (
                            <div className="text-xs text-zinc-500 line-clamp-1 mt-0.5">{repo.description}</div>
                          )}
                        </div>
                        <span className="shrink-0 text-xs text-zinc-500 font-mono">{repo.language || "—"}</span>
                      </Link>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* ── Recent Commits ─────────────────────────────────────────── */}
            <Card className="p-5 border-zinc-800/60 bg-zinc-900/40 backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-white">Recent commits</h2>
                <a href={user.url} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                  View all
                </a>
              </div>
              {contributions.length === 0 ? (
                <p className="text-sm text-zinc-500 text-center py-4">No recent commits found.</p>
              ) : (
                <div className="space-y-0 divide-y divide-zinc-800/50">
                  {contributions.slice(-5).reverse().map((day, i) => {
                    if (day.count === 0) return null;
                    const date = new Date(day.date);
                    const hoursAgo = Math.round((Date.now() - date.getTime()) / 3600000);
                    const timeLabel = hoursAgo < 24 ? `${hoursAgo}h ago` : `${Math.round(hoursAgo / 24)}d ago`;
                    return (
                      <div key={day.date} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                        <span className="h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold text-zinc-100">{day.count} contribution{day.count !== 1 ? "s" : ""}</div>
                          <div className="text-xs text-zinc-500">{user.login} · {timeLabel}</div>
                        </div>
                        <span className="shrink-0 text-xs font-mono text-zinc-600">{day.date.slice(2).replace(/-/g, "").slice(0, 6)}</span>
                      </div>
                    );
                  }).filter(Boolean)}
                </div>
              )}
            </Card>

            {/* Footer */}
            <footer className="pb-8 text-center text-xs text-zinc-700">
              <p>Developer dashboard powered by public GitHub data · Slatex</p>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}

