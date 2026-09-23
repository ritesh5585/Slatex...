import Link from "next/link";
import { ArrowLeft, AlertCircle, UserX, GitFork } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RepoHeader } from "@/components/repo/repo-header";
import { RepoStats } from "@/components/repo/repo-stats";
import { LanguagePie } from "@/components/repo/language-pie";
import { ContributorsList } from "@/components/repo/contributors-list";
import { CommitTimeline } from "@/components/repo/commit-timeline";
import { ReadmeViewer } from "@/components/repo/readme-viewer";

interface Props {
  searchParams: Promise<{ owner?: string; name?: string; url?: string }>;
}

const GH_HEADERS = {
  Accept: "application/vnd.github.v3+json",
  "User-Agent": "DevScan-Dashboard",
};

export default async function RepoPage({ searchParams }: Props) {
  const params = await searchParams;

  // URL se owner/name parse karo, ya direct params lo
  let owner = params.owner;
  let repoName = params.name;

  if (params.url && !owner) {
    const match = params.url.match(/github\.com\/([^/]+)\/([^/.]+)/);
    if (match) {
      owner = match[1];
      repoName = match[2];
    }
  }

  if (!owner || !repoName) {
    return (
      <main className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center border-zinc-800 bg-zinc-900/60 space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20">
            <AlertCircle className="h-7 w-7" />
          </div>
          <h1 className="text-xl font-bold text-white">Invalid Repository</h1>
          <p className="text-sm text-zinc-400">
            Provide a GitHub repo URL or owner + name.
          </p>
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Search
            </Button>
          </Link>
        </Card>
      </main>
    );
  }

  // ── Parallel Fetch — all 5 endpoints ──
  const [repoRes, langRes, contribRes, commitRes, readmeRes] =
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
        {
          next: { revalidate: 3600 },
          headers: GH_HEADERS,
        },
      ),
      fetch(
        `https://api.github.com/repos/${owner}/${repoName}/commits?per_page=10`,
        {
          next: { revalidate: 300 },
          headers: GH_HEADERS,
        },
      ),
      fetch(`https://api.github.com/repos/${owner}/${repoName}/readme`, {
        next: { revalidate: 3600 },
        headers: GH_HEADERS,
      }),
    ]);

  if (repoRes.status === 404) {
    return (
      <main className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center border-zinc-800 bg-zinc-900/60 space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 ring-1 ring-red-500/20">
            <UserX className="h-7 w-7" />
          </div>
          <h1 className="text-xl font-bold text-white">Repository Not Found</h1>
          <p className="text-sm text-zinc-400">
            <span className="text-zinc-200 font-semibold">
              {owner}/{repoName}
            </span>{" "}
            is private or does not exist.
          </p>
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Search
            </Button>
          </Link>
        </Card>
      </main>
    );
  }

  const repo = await repoRes.json();
  const languages: Record<string, number> = langRes.ok
    ? await langRes.json()
    : {};
  const contributors = contribRes.ok ? await contribRes.json() : [];
  const commits = commitRes.ok ? await commitRes.json() : [];

  // README — base64 decode
  let readmeContent = "";
  if (readmeRes.ok) {
    const readmeData = await readmeRes.json();
    readmeContent = readmeData.content
      ? Buffer.from(readmeData.content, "base64").toString("utf-8")
      : "";
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 antialiased pb-24 selection:bg-blue-500/30 selection:text-blue-200">
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />{" "}
            <span>Search Another Developer</span>
          </Link>
          <span className="hidden sm:inline-flex text-xs text-zinc-500 font-mono">
            github.com/{owner}/{repoName}
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        <RepoHeader repo={repo} owner={owner} />
        <RepoStats repo={repo} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <LanguagePie languages={languages} />
          </div>
          <div className="lg:col-span-2">
            <ContributorsList contributors={contributors} />
          </div>
        </div>

        <CommitTimeline commits={commits} owner={owner} repoName={repoName} />
        <ReadmeViewer content={readmeContent} />
      </div>
    </main>
  );
}
