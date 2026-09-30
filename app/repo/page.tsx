import Link from "next/link";
import { AlertCircle, ArrowLeft, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BackButton } from "@/components/shared/back-button";
import { CommitActivity } from "@/components/repo/commit-activity";
import { CommitTimeline } from "@/components/repo/commit-timeline";
import { ContributorsList } from "@/components/repo/contributors-list";
import { LanguagePie } from "@/components/repo/language-pie";
import { ReadmeViewer } from "@/components/repo/readme-viewer";
import { RepoHeader } from "@/components/repo/repo-header";
import { RepoStats } from "@/components/repo/repo-stats";
import {
  getCommitHistory,
  getRepo,
  getRepoLanguages,
  getRepoReadme,
  NotFoundError,
  RateLimitError,
} from "@/lib/api/github";
import type { GitHubCommitActivityWeek, GitHubContributor } from "@/lib/github";

interface Props {
  searchParams: Promise<{ owner?: string; repo?: string; url?: string }>;
}

function parseRepoParams({ owner, repo, url }: Awaited<Props["searchParams"]>) {
  if (owner?.trim() && repo?.trim()) {
    return { owner: owner.trim(), name: repo.trim().replace(/\.git$/, "") };
  }

  if (!url) return { owner: "", name: "" };

  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
    const [parsedOwner = "", parsedName = ""] = parsed.pathname
      .split("/")
      .filter(Boolean);
    return { owner: parsedOwner, name: parsedName.replace(/\.git$/, "") };
  } catch {
    return { owner: "", name: "" };
  }
}

function ErrorShell({
  icon,
  title,
  description,
  tone = "red",
}: {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  tone?: "amber" | "red";
}) {
  const colors =
    tone === "amber"
      ? "bg-amber-500/10 text-amber-400 ring-amber-500/20"
      : "bg-red-500/10 text-red-400 ring-red-500/20";

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
      <Card className="w-full max-w-md space-y-4 border-zinc-800 bg-zinc-900/60 p-8 text-center">
        <div
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ring-1 ${colors}`}
        >
          {icon}
        </div>
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-white">{title}</h1>
          <p className="text-sm text-zinc-400">{description}</p>
        </div>
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Search
          </Button>
        </Link>
      </Card>
    </main>
  );
}

export default async function RepoPage({ searchParams }: Props) {
  const { owner, name } = parseRepoParams(await searchParams);
  if (!owner || !name) {
    return (
      <ErrorShell
        icon={<AlertCircle className="h-7 w-7" />}
        title="Invalid Repository"
        description="Provide a GitHub repo URL or owner and repository name."
        tone="amber"
      />
    );
  }

  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "DevScan-Dashboard",
    ...(process.env.GITHUB_TOKEN && {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    }),
  };

  try {
    const [
      repo,
      languageEdges,
      commits,
      readme,
      contributorsResponse,
      activityResponse,
    ] = await Promise.all([
      getRepo(owner, name),
      getRepoLanguages(owner, name),
      getCommitHistory(owner, name, 30),
      getRepoReadme(owner, name),
      fetch(
        `https://api.github.com/repos/${owner}/${name}/contributors?per_page=10`,
        {
          headers,
          next: { revalidate: 3600 },
        },
      ),
      fetch(
        `https://api.github.com/repos/${owner}/${name}/stats/commit_activity`,
        {
          headers,
          next: { revalidate: 1800 },
        },
      ),
    ]);

    const [contributorData, activityData] = await Promise.all([
      contributorsResponse.ok ? contributorsResponse.json() : [],
      activityResponse.ok ? activityResponse.json() : [],
    ]);
    const contributors: GitHubContributor[] = Array.isArray(contributorData)
      ? contributorData
      : [];
    const activity: GitHubCommitActivityWeek[] = Array.isArray(activityData)
      ? activityData.slice(-13)
      : [];
    const languages = Object.fromEntries(
      languageEdges.map(({ node, size }) => [node.name, size]),
    );

    return (
      <main className="min-h-screen bg-zinc-950 pb-24 text-zinc-100 antialiased selection:bg-blue-500/30 selection:text-blue-200">
        <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <BackButton />
            <span className="hidden font-mono text-xs text-zinc-500 sm:inline-flex">
              github.com/{owner}/{name}
            </span>
          </div>
        </header>

        <div className="mx-auto max-w-5xl space-y-8 px-4 pt-8 sm:px-6 lg:px-8">
          <RepoHeader repo={repo} />
          <RepoStats repo={repo} />
          <CommitActivity activity={activity} />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <LanguagePie languages={languages} />
            <div className="lg:col-span-2">
              <ContributorsList contributors={contributors} />
            </div>
          </div>
          <CommitTimeline commits={commits} owner={owner} repoName={name} />
          <ReadmeViewer
            content={readme ?? ""}
            owner={owner}
            repoName={name}
            branch={repo.defaultBranchRef?.name}
          />
          <footer className="border-t border-zinc-900/80 pt-12 text-center text-xs text-zinc-600">
            Repository dashboard generated from public GitHub data.
          </footer>
        </div>
      </main>
    );
  } catch (error) {
    if (error instanceof NotFoundError) {
      return (
        <ErrorShell
          icon={<UserX className="h-7 w-7" />}
          title="Repository Not Found"
          description={`${owner}/${name} is private or does not exist.`}
        />
      );
    }
    if (error instanceof RateLimitError) {
      return (
        <ErrorShell
          icon={<AlertCircle className="h-7 w-7" />}
          title="API Rate Limit Reached"
          description="GitHub's API rate limit was reached. Please try again later."
          tone="amber"
        />
      );
    }
    return (
      <ErrorShell
        icon={<AlertCircle className="h-7 w-7" />}
        title="Unable to Fetch Repository"
        description="GitHub data could not be loaded. Please try again."
      />
    );
  }
}
