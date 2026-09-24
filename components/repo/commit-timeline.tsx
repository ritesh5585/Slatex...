import { GitCommit, ExternalLink, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { GitHubCommit } from "@/lib/github";

interface Props {
  commits: GitHubCommit[];
  owner: string;
  repoName: string;
}

function timeAgo(date: string) {
  const diff = Math.max(0, Date.now() - new Date(date).getTime());
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(date).toLocaleDateString("en-IN", { month: "short", day: "numeric" });
}

// Commit type detect — "feat:", "fix:", "chore:", etc.
function getCommitType(msg: string) {
  const match = msg.match(/^([\w-]+)(\(.+\))?:/);
  return match ? match[1] : null;
}

const TYPE_COLORS: Record<string, string> = {
  feat: "bg-blue-500/10 text-blue-400 ring-blue-500/20",
  fix: "bg-rose-500/10 text-rose-400 ring-rose-500/20",
  chore: "bg-zinc-500/10 text-zinc-400 ring-zinc-500/20",
  docs: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
  refactor: "bg-purple-500/10 text-purple-400 ring-purple-500/20",
  test: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
  style: "bg-pink-500/10 text-pink-400 ring-pink-500/20",
};

export function CommitTimeline({ commits, owner, repoName }: Props) {
  if (!commits?.length) return null;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="inline-flex rounded-xl bg-blue-500/10 p-2 text-blue-400 ring-1 ring-blue-500/20">
            <GitCommit className="h-4 w-4" />
          </div>
          <h2 className="text-lg font-semibold text-white">Recent Commits</h2>
          <Badge variant="secondary" className="text-xs">
            {commits.length}
          </Badge>
        </div>
      </div>

      <div className="relative space-y-1">
        {/* Vertical timeline line */}
        <div className="absolute left-[19px] top-3 bottom-3 w-px bg-gradient-to-b from-blue-500/40 via-zinc-800 to-transparent" />

        {commits.slice(0, 8).map((commit) => {
          const msg = commit.commit.message.split("\n")[0];
          const type = getCommitType(msg);
          const typeColor = type ? TYPE_COLORS[type] || TYPE_COLORS.chore : null;

          return (
            <a
              key={commit.sha}
              href={commit.html_url || `https://github.com/${owner}/${repoName}/commit/${commit.sha}`}
              target="_blank"
              rel="noreferrer"
              className="relative flex items-start gap-4 py-3 pr-2 rounded-lg hover:bg-zinc-900/60 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 flex-wrap">
                  {type && typeColor && (
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ring-1 uppercase tracking-wider ${typeColor}`}
                    >
                      {type}
                    </span>
                  )}
                  <p className="text-sm text-zinc-200 line-clamp-2 font-medium leading-snug">
                    {msg}
                  </p>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                    {commit.sha.slice(0, 7)}
                  </span>
                  <span className="text-zinc-400">
                    {commit.commit.author?.name ?? commit.author?.login ?? "Unknown author"}
                  </span>
                  <span>•</span>
                  <span>{commit.commit.author ? timeAgo(commit.commit.author.date) : "Unknown time"}</span>
                </div>
              </div>

              <ExternalLink className="h-3.5 w-3.5 text-zinc-600 shrink-0 mt-1" />
            </a>
          );
        })}
      </div>

      <a
        href={`https://github.com/${owner}/${repoName}/commits`}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium"
      >
        View all commits on GitHub <ArrowRight className="h-3.5 w-3.5" />
      </a>
    </Card>
  );
}