import Link from "next/link";
import { AlertCircle, ArrowLeft, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RepoPageClient } from "@/components/repo/repo-page-client";
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
    const [parsedOwner = "", parsedName = ""] = parsed.pathname.split("/").filter(Boolean);
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
    <main className="flex min-h-screen items-center justify-center bg-[#08090f] p-4">
      <Card className="w-full max-w-md space-y-4 border-zinc-800 bg-zinc-900/60 p-8 text-center backdrop-blur-md">
        <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ring-1 ${colors}`}>
          {icon}
        </div>
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-white">{title}</h1>
          <p className="text-sm text-zinc-400">{description}</p>
        </div>
        <Link href="/">
          <Button variant="outline" className="gap-2 mt-2">
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
    "User-Agent": "DevLens-Dashboard",
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
        { headers, next: { revalidate: 3600 } }
      ),
      fetch(
        `https://api.github.com/repos/${owner}/${name}/stats/commit_activity`,
        { headers, next: { revalidate: 1800 } }
      ),
    ]);

    const [contributorData, activityData] = await Promise.all([
      contributorsResponse.ok ? contributorsResponse.json() : [],
      activityResponse.ok ? activityResponse.json() : [],
    ]);

    const contributors: GitHubContributor[] = Array.isArray(contributorData) ? contributorData : [];
    const activity: GitHubCommitActivityWeek[] = Array.isArray(activityData) ? activityData.slice(-13) : [];
    const languages = Object.fromEntries(
      languageEdges.map(({ node, size }) => [node.name, size])
    );

    return (
      <RepoPageClient
        owner={owner}
        repoName={name}
        repoUrl={repo.url}
        homepage={repo.homepageUrl}
        description={repo.description}
        license={repo.licenseInfo?.spdxId ?? null}
        createdAt={repo.createdAt}
        pushedAt={repo.pushedAt}
        defaultBranch={repo.defaultBranchRef?.name ?? null}
      >
        <div className="px-4 sm:px-6 py-6 space-y-5 max-w-5xl mx-auto">

          {/* ── Overview ─────────────────────────────────────────────────── */}
          <section id="repo-section-overview" className="space-y-5 scroll-mt-20">
            <RepoHeader repo={repo} />
            <RepoStats
              repo={repo}
              contributorCount={contributors.length}
              pullRequestCount={repo.pullRequests?.totalCount}
            />
          </section>

          {/* ── Activity ─────────────────────────────────────────────────── */}
          <section id="repo-section-activity" className="scroll-mt-20">
            <CommitActivity activity={activity} />
          </section>

          {/* ── Commits ──────────────────────────────────────────────────── */}
          <section id="repo-section-commits" className="scroll-mt-20">
            <CommitTimeline commits={commits} owner={owner} repoName={name} />
          </section>

          {/* ── People ───────────────────────────────────────────────────── */}
          <section id="repo-section-people" className="scroll-mt-20">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
              <div className="lg:col-span-3">
                <ContributorsList contributors={contributors} />
              </div>
              <div className="lg:col-span-2">
                <LanguagePie languages={languages} />
              </div>
            </div>
          </section>

          {/* ── Releases placeholder ─────────────────────────────────────── */}
          <section id="repo-section-releases" className="scroll-mt-20">
            <Card className="p-5 border-zinc-800/60 bg-zinc-900/40 backdrop-blur-md repo-card-anim">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-white">Releases</h2>
                <a
                  href={`${repo.url}/releases`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  View all
                </a>
              </div>
              <a
                href={`${repo.url}/releases`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl border border-zinc-800/60 hover:bg-zinc-800/30 transition-colors group"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 ring-1 ring-indigo-500/20">
                  <span className="text-indigo-400 text-lg">🏷</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
                    View all releases on GitHub
                  </p>
                  <p className="text-xs text-zinc-500">{owner}/{name}</p>
                </div>
              </a>
            </Card>
          </section>

          {/* ── README ───────────────────────────────────────────────────── */}
          <section id="repo-section-readme" className="scroll-mt-20 pb-8">
            <ReadmeViewer
              content={readme ?? ""}
              owner={owner}
              repoName={name}
              branch={repo.defaultBranchRef?.name}
            />
          </section>

          {/* Footer */}
          <footer className="pb-6 text-center text-xs text-zinc-700">
            Repository dashboard generated from public GitHub data · DevLens
          </footer>
        </div>
      </RepoPageClient>
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
