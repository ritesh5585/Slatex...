import { GitCommit, ArrowRight, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { CommitNode } from "@/lib/api/github";

interface Props {
  commits: CommitNode[];
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
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getCommitType(msg: string) {
  const match = msg.match(/^([\w-]+)(\(.+\))?:/);
  return match ? match[1] : null;
}

const TYPE_COLORS: Record<string, { bg: string; text?: string }> = {
  feat: { bg: "bg-blue-950/40 text-blue-400 border border-blue-900/40" },
  fix: { bg: "bg-rose-950/40 text-rose-400 border border-rose-900/40" },
  chore: { bg: "bg-zinc-800 text-zinc-400 border border-zinc-700/50" },
  docs: { bg: "bg-emerald-950/40 text-emerald-400 border border-emerald-900/40" },
  refactor: { bg: "bg-purple-950/40 text-purple-400 border border-purple-900/40" },
  test: { bg: "bg-amber-950/40 text-amber-400 border border-amber-900/40" },
  style: { bg: "bg-pink-950/40 text-pink-400 border border-pink-900/40" },
  perf: { bg: "bg-cyan-950/40 text-cyan-400 border border-cyan-900/40" },
};

const DEFAULT_TYPE: { bg: string; text?: string } = { bg: "bg-zinc-800 text-zinc-400 border border-zinc-700/50" };

export function CommitTimeline({ commits, owner, repoName }: Props) {
  if (!commits?.length) return null;

  return (
    <Card className="overflow-hidden border border-[var(--border)] bg-[var(--surface)]">
      <div className="flex items-center justify-between px-4 py-3 sm:px-5 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <GitCommit className="h-4 w-4 text-[var(--accent)]" />
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-white">Recent Commits</h2>
            <p className="text-[11px] text-[var(--text-tertiary)]">{commits.length} recent entries</p>
          </div>
        </div>
        <a
          href={`https://github.com/${owner}/${repoName}/commits`}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-[var(--accent)] hover:underline flex items-center gap-1"
        >
          View all <ArrowRight className="h-3 w-3" />
        </a>
      </div>

      <div className="p-4 sm:p-5">
        <div className="relative space-y-0">
          <div className="absolute left-[13px] top-3 bottom-3 w-px bg-[var(--border-subtle)]" />

          {commits.slice(0, 8).map((commit) => {
            const msg = commit.message.split("\n")[0];
            const type = getCommitType(msg);
            const typeStyle = type
              ? TYPE_COLORS[type] ?? DEFAULT_TYPE
              : null;
            const author = commit.author?.name ?? commit.author?.user?.login ?? "Unknown";
            const shortOid = commit.oid.slice(0, 7);

            return (
              <a
                key={commit.oid}
                href={`https://github.com/${owner}/${repoName}/commit/${commit.oid}`}
                target="_blank"
                rel="noreferrer"
                className="relative flex items-start gap-3 rounded-[6px] py-2 px-1 hover:bg-[var(--surface-canvas)] transition-colors group"
              >
                {/* Timeline dot */}
                <div className="relative z-10 mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--surface-sunken)] border border-[var(--border-strong)]">
                  <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-1.5 flex-wrap mb-0.5">
                    {type && typeStyle && (
                      <span
                        className={`text-[10px] font-medium px-1.5 py-0.2 rounded-[4px] uppercase tracking-wider shrink-0 ${typeStyle.bg}`}
                      >
                        {type}
                      </span>
                    )}
                    <p className="text-xs text-[var(--text-primary)] line-clamp-1 font-medium leading-snug group-hover:text-white transition-colors">
                      {type ? msg.replace(/^[\w-]+(\(.+\))?:\s*/, "") : msg}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-[var(--text-tertiary)]">
                    <span className="font-mono text-[10px] px-1 py-0.2 rounded-[4px] bg-[var(--surface-canvas)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                      {shortOid}
                    </span>
                    <span className="text-[var(--text-secondary)]">{author}</span>
                    <span>·</span>
                    <span>{timeAgo(commit.committedDate)}</span>
                  </div>
                </div>

                <ExternalLink className="h-3.5 w-3.5 text-[var(--text-tertiary)] shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
