import Link from "next/link";
import { ArrowLeft, UserX, AlertCircle, RefreshCw } from "lucide-react";
import { HeroSection, type GitHubUser } from "@/components/user/hero-section";
import { StatsCards } from "@/components/user/stats-cards";
import { LanguageChart } from "@/components/user/language-chart";
import { RepoGrid } from "@/components/user/repo-grid";
import { type GitHubRepo } from "@/components/user/repo-card";
import { Card } from "@/components/ui/card";
import { ContributionStreaks } from "@/components/user/contro-streaks";
import { BackButton } from "@/components/shared/back-button";
import { fetchContributions } from "@/lib/github-contributions";

interface Props {
  searchParams: Promise<{ username?: string }>;
}

export default async function ResultPage({ searchParams }: Props) {
  const { username } = await searchParams;

  if (!username || !username.trim()) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center border-zinc-800 bg-zinc-900/60 backdrop-blur-xl space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20">
            <AlertCircle className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-bold tracking-tight text-white">
              No Username Provided
            </h1>
            <p className="text-sm text-zinc-400">
              Please enter a valid GitHub username to analyze developer
              statistics.
            </p>
          </div>
          <BackButton />
        </Card>
      </main>
    );
  }

  const cleanUsername = username.trim().replace(/^@/, "");

  const githubFetchOptions = {
    next: { revalidate: 3600 },
    headers: {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "DevScan-Dashboard",
    },
  } as const;

  const [userRes, repoRes, contributionData] = await Promise.all([
    fetch(`https://api.github.com/users/${cleanUsername}`, githubFetchOptions),
    fetch(
      `https://api.github.com/users/${cleanUsername}/repos?sort=updated&per_page=100`,
      githubFetchOptions,
    ),
    fetchContributions(cleanUsername),
  ]);

  if (userRes.status === 404) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center border-zinc-800 bg-zinc-900/60 backdrop-blur-xl space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 ring-1 ring-red-500/20">
            <UserX className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-bold tracking-tight text-white">
              User Not Found
            </h1>
            <p className="text-sm text-zinc-400">
              Could not find GitHub user{" "}
              <span className="font-semibold text-zinc-200">
                @{cleanUsername}
              </span>
              . Please check the spelling and try again.
            </p>
          </div>
          <div className="pt-2 flex justify-center">
            <BackButton />
          </div>
        </Card>
      </main>
    );
  }

  if (userRes.status === 403) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center border-zinc-800 bg-zinc-900/60 backdrop-blur-xl space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20">
            <RefreshCw className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-bold tracking-tight text-white">
              API Rate Limit Reached
            </h1>
            <p className="text-sm text-zinc-400">
              GitHub API public hourly limit reached. Please wait a minute and
              reload.
            </p>
          </div>
          <div className="pt-2 flex justify-center">
            <BackButton />
          </div>
        </Card>
      </main>
    );
  }

  if (!userRes.ok) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center border-zinc-800 bg-zinc-900/60 backdrop-blur-xl space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 ring-1 ring-red-500/20">
            <AlertCircle className="h-7 w-7" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Unable to Fetch Data
          </h1>
          <p className="text-sm text-zinc-400">
            An error occurred while fetching details from GitHub. Please try
            again later.
          </p>
          <div className="pt-2 flex justify-center">
            <BackButton />
          </div>
        </Card>
      </main>
    );
  }

  const user: GitHubUser = await userRes.json();

  const rawRepos: GitHubRepo[] = repoRes.ok ? await repoRes.json() : [];

  // Filter and sanitize repos
  const repos = Array.isArray(rawRepos) ? rawRepos : [];

  // Calculate Language Distribution
  const languageCount: Record<string, number> = {};
  repos.forEach((repo) => {
    if (repo.language) {
      languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
    }
  });

  const topLanguages: [string, number][] = Object.entries(languageCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 antialiased pb-24 selection:bg-blue-500/30 selection:text-blue-200">
      {/* ── Top Navigation Bar ── */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <BackButton />

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex text-xs text-zinc-500 font-mono">
              github.com/{user.login}
            </span>
            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          </div>
        </div>
      </header>

      {/* ── 1. Hero Cover Section (Edge-to-Edge) ── */}
      <HeroSection user={user} />

      {/* ── Main Dashboard Content (Contained) ── */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* ── 2. Stats Dashboard ── */}
        <StatsCards
          publicRepos={user.public_repos}
          followers={user.followers}
          following={user.following}
        />

        <ContributionStreaks
          contributions={contributionData.contributions}
          totalContributions={contributionData.totalContributions}
        />

        {/* ── 3. Top Languages Constellation ── */}
        {topLanguages.length > 0 && (
          <LanguageChart topLanguages={topLanguages} />
        )}

        {/* ── 4. Recent Repositories Grid ── */}
        <RepoGrid repos={repos} />

        {/* ── Footer ── */}
        <footer className="pt-12 text-center text-xs text-zinc-600 border-t border-zinc-900/80">
          <p>
            Developer dashboard generated from public GitHub data • Inspired by
            Linear & Vercel
          </p>
        </footer>
      </div>
    </main>
  );
}
