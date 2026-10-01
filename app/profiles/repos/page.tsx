import { UserX, AlertCircle, RefreshCw, BookOpen, Star, GitFork, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { DashboardSidebar } from "@/components/user/dashboard-sidebar";
import { DashboardHeader } from "@/components/user/dashboard-header";
import { RepoListView } from "@/components/user/repo-list-view";
import { BackButton } from "@/components/shared/back-button";
import { Card } from "@/components/ui/card";
import { type GitHubRepo } from "@/components/user/repo-card";
import {
  getUserByUsername,
  getUserRepos,
  NotFoundError,
  RateLimitError,
} from "@/lib/api/github";

interface Props {
  searchParams: Promise<{ username?: string }>;
}

function ErrorPage({
  icon: Icon,
  iconClass,
  title,
  description,
}: {
  icon: React.ElementType;
  iconClass: string;
  title: string;
  description: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#08090f] text-zinc-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center border-zinc-800 bg-zinc-900/60 backdrop-blur-xl space-y-4">
        <div
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ring-1 ${iconClass}`}
        >
          <Icon className="h-7 w-7" />
        </div>
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-white">{title}</h1>
          <p className="text-sm text-zinc-400">{description}</p>
        </div>
        <div className="pt-2 flex justify-center">
          <BackButton />
        </div>
      </Card>
    </main>
  );
}

export default async function UserReposPage({ searchParams }: Props) {
  const { username } = await searchParams;

  if (!username || !username.trim()) {
    return (
      <ErrorPage
        icon={AlertCircle}
        iconClass="bg-amber-500/10 text-amber-400 ring-amber-500/20"
        title="No Username Provided"
        description="Please provide a valid GitHub username to view repositories."
      />
    );
  }

  const cleanUsername = username.trim().replace(/^@/, "");
  let user: Awaited<ReturnType<typeof getUserByUsername>>;
  let userRepos: Awaited<ReturnType<typeof getUserRepos>>;

  try {
    [user, userRepos] = await Promise.all([
      getUserByUsername(cleanUsername),
      getUserRepos(cleanUsername, 100),
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
        title="Unable to Fetch Repositories"
        description="An error occurred while fetching repositories. Please try again."
      />
    );
  }

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

  const recentlyViewed = [
    { label: "vercel/next.js", href: "#" },
    { label: "facebook/react", href: "#" },
    { label: user.login, href: `/profiles?username=${encodeURIComponent(user.login)}` },
  ];

  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const totalForks = repos.reduce((sum, r) => sum + r.forks_count, 0);

  return (
    <main className="h-screen bg-[#08090f] text-zinc-100 antialiased flex overflow-hidden">
      {/* ── Desktop Sidebar ──────────────────────────────────────────────── */}
      <div className="hidden md:flex w-52 shrink-0 flex-col h-full">
        <DashboardSidebar
          username={cleanUsername}
          activeTab="repos"
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
          activeTab="repos"
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
                      All Repositories
                    </h1>
                    <span className="rounded-full bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 text-xs font-semibold text-indigo-400">
                      {user.repositories.totalCount}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5 flex items-center gap-2">
                    <span>Created by <strong className="text-zinc-200">@{user.login}</strong></span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-amber-400" /> {totalStars.toLocaleString()} stars
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <GitFork className="h-3 w-3 text-zinc-400" /> {totalForks.toLocaleString()} forks
                    </span>
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

            {/* Repositories Interactive Grid View */}
            <RepoListView
              repos={repos}
              username={cleanUsername}
              totalCount={user.repositories.totalCount}
            />

            {/* Footer */}
            <footer className="pt-6 pb-12 text-center text-xs text-zinc-700">
              <p>Slatex... repository explorer · Powered by public GitHub API</p>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}