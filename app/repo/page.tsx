import Link from "next/link";
import { ArrowLeft, AlertCircle, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RepoHeader } from "@/components/repo/repo-header";
import { RepoStats } from "@/components/repo/repo-stats";
import { LanguagePie } from "@/components/repo/language-pie";
import { ContributorsList } from "@/components/repo/contributors-list";
import { CommitActivity } from "@/components/repo/commit-activity";
import { CommitTimeline } from "@/components/repo/commit-timeline";
import { ReadmeViewer } from "@/components/repo/readme-viewer";
import type {
  GitHubCommit,
  GitHubCommitActivityWeek,
  GitHubContributor,
  GitHubRepository,
} from "@/lib/github";
import { BackButton } from "@/components/back-button";

interface Props {
  searchParams: Promise<{ owner?: string; repo?: string; url?: string }>;
}

const GH_HEADERS = {
  Accept: "application/vnd.github.v3+json",
  "User-Agent": "DevScan-Dashboard",
};

// ─── Helpers ───────────────────────────────────────────────
function parseRepoParams(params: {
  owner?: string;
  repo?: string;
  url?: string;
}): { owner?: string; repoName?: string } {
  let owner = params.owner?.trim();
  let repoName = params.repo?.trim();

  // Agar URL diya hai aur owner/repo nahi — URL se parse karo
  if (params.url && (!owner || !repoName)) {
    try {
      const cleanUrl = params.url.startsWith("http")
        ? params.url
        : `https://${params.url}`;
      const u = new URL(cleanUrl);
      const parts = u.pathname.replace(/^\//, "").split("/");
      owner = parts[0];
      repoName = parts[1]?.replace(/\.git$/, "");
    } catch {
      // Invalid URL — silent fail, niche validation handle karegi
    }
  }

  return { owner, repoName };
}

// ─── Reusable Error Shell ──────────────────────────────────
function ErrorShell({
  icon,
  iconClass,
  ringClass,
  bgClass,
  title,
  description,
  ctaLabel = "Back to Search",
}: {
  icon: React.ReactNode;
  iconClass: string;
  ringClass: string;
  bgClass: string;
  title: string;
  description: React.ReactNode;
  ctaLabel?: string;
}) {
  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center border-zinc-800 bg-zinc-900/60 space-y-4">
        <div
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${bgClass} ${iconClass} ring-1 ${ringClass}`}
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
            {ctaLabel}
          </Button>
        </Link>
      </Card>
    </main>
  );
}

// ─── Page ──────────────────────────────────────────────────
export default async function RepoPage({ searchParams }: Props) {
  const params = await searchParams;
  const { owner, repoName } = parseRepoParams(params);

  // Validation
  if (!owner || !repoName) {
    return (
      <ErrorShell
        icon={<AlertCircle className="h-7 w-7" />}
        iconClass="text-amber-400"
        ringClass="ring-amber-500/20"
        bgClass="bg-amber-500/10"
        title="Invalid Repository"
        description="Provide a GitHub repo URL or owner + name."
      />
    );
  }

  // ── Parallel Fetch ──
  const [repoRes, langRes, contribRes, commitRes, activityRes, readmeRes] =
    await Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${repoName}`, {
        next: { revalidate: 3600 },
        headers: GH_HEADERS,
      }),
      fetch(`https://api.github.com/repos/${owner}/${repoName}/languages`, {
        next: { revalidate: 3600 },
        headers: GH_HEADERS,
      }),
      fetch(
        `https://api.github.com/repos/${owner}/${repoName}/contributors?per_page=10`,
        { next: { revalidate: 3600 }, headers: GH_HEADERS },
      ),
      fetch(
        `https://api.github.com/repos/${owner}/${repoName}/commits?per_page=100`,
        { next: { revalidate: 300 }, headers: GH_HEADERS },
      ),
      fetch(
        `https://api.github.com/repos/${owner}/${repoName}/stats/commit_activity`,
        { next: { revalidate: 1800 }, headers: GH_HEADERS },
      ),
      fetch(`https://api.github.com/repos/${owner}/${repoName}/readme`, {
        next: { revalidate: 3600 },
        headers: GH_HEADERS,
      }),
    ]);

  // ── Error Handling ──
  if (repoRes.status === 404) {
    return (
      <ErrorShell
        icon={<UserX className="h-7 w-7" />}
        iconClass="text-red-400"
        ringClass="ring-red-500/20"
        bgClass="bg-red-500/10"
        title="Repository Not Found"
        description={
          <>
            <span className="text-zinc-200 font-semibold">
              {owner}/{repoName}
            </span>{" "}
            is private or does not exist.
          </>
        }
      />
    );
  }

  if (repoRes.status === 403) {
    return (
      <ErrorShell
        icon={<AlertCircle className="h-7 w-7" />}
        iconClass="text-amber-400"
        ringClass="ring-amber-500/20"
        bgClass="bg-amber-500/10"
        title="API Rate Limit Reached"
        description="GitHub API hourly limit reached. Please wait a minute and reload."
      />
    );
  }

  if (!repoRes.ok) {
    return (
      <ErrorShell
        icon={<AlertCircle className="h-7 w-7" />}
        iconClass="text-red-400"
        ringClass="ring-red-500/20"
        bgClass="bg-red-500/10"
        title="Unable to Fetch Repository"
        description="An error occurred while fetching repo details. Please try again."
      />
    );
  }
  

  // ── Parse Data ──
  const repo: GitHubRepository = await repoRes.json();
  const languages: Record<string, number> = langRes.ok
    ? await langRes.json()
    : {};
  const contributors: GitHubContributor[] = contribRes.ok
    ? await contribRes.json()
    : [];
  const commits: GitHubCommit[] = commitRes.ok ? await commitRes.json() : [];

  const rawActivity = activityRes.ok ? await activityRes.json() : [];
  const activity: GitHubCommitActivityWeek[] = Array.isArray(rawActivity)
    ? rawActivity.slice(-26)
    : [];

  let readmeContent = "";
  if (readmeRes.ok) {
    const readmeData = await readmeRes.json();
    readmeContent = readmeData.content
      ? Buffer.from(readmeData.content, "base64").toString("utf-8")
      : "";
  }

  // ── Render ──
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 antialiased pb-24 selection:bg-blue-500/30 selection:text-blue-200">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <BackButton />
          <span className="hidden sm:inline-flex text-xs text-zinc-500 font-mono">
            github.com/{owner}/{repoName}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* 1. Header */}
        <RepoHeader repo={repo} owner={owner} />

        {/* 2. Stats */}
        <RepoStats repo={repo} />

        {/* 3. Contribution grid (six months) */}
        <CommitActivity activity={activity} />

        {/* 4. Languages + Contributors (side by side on desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <LanguagePie languages={languages} />
          </div>
          <div className="lg:col-span-2">
            <ContributorsList contributors={contributors} />
          </div>
        </div>

        {/* 5. Recent Commits Timeline */}
        <CommitTimeline commits={commits} owner={owner} repoName={repoName} />

        {/* 6. README */}
        <ReadmeViewer
          content={readmeContent}
          owner={owner}
          repoName={repoName}
        />

        {/* Footer */}
        <footer className="pt-12 text-center text-xs text-zinc-600 border-t border-zinc-900/80">
          <p>
            Repository dashboard generated from public GitHub data • Inspired by
            Linear & Vercel
          </p>
        </footer>
      </div>
    </main>
  );
}
