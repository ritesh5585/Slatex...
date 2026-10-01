import { GitCommit, ExternalLink, ArrowRight } from "lucide-react";
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

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  feat: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
  fix: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20" },
  chore: { bg: "bg-zinc-500/10", text: "text-zinc-400", border: "border-zinc-500/20" },
  docs: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  refactor: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
  test: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
  style: { bg: "bg-pink-500/10", text: "text-pink-400", border: "border-pink-500/20" },
  perf: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/20" },
};

const DEFAULT_TYPE = { bg: "bg-zinc-500/10", text: "text-zinc-400", border: "border-zinc-500/20" };

export function CommitTimeline({ commits, owner, repoName }: Props) {
  if (!commits?.length) return null;

  return (
    <Card className="overflow-hidden border-zinc-800/60 bg-zinc-900/40 backdrop-blur-md repo-card-anim">
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/60">
        <div className="flex items-center gap-2.5">
          <div className="inline-flex rounded-xl bg-blue-500/10 p-2 text-blue-400 ring-1 ring-blue-500/20">
            <GitCommit className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Recent Commits</h2>
            <p className="text-[11px] text-zinc-500">{commits.length} most recent</p>
          </div>
        </div>
        <a
          href={`https://github.com/${owner}/${repoName}/commits`}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
        >
          View all <ArrowRight className="h-3 w-3" />
        </a>
      </div>

      <div className="p-5">
        <div className="relative space-y-0">
          {/* Timeline vertical line */}
          <div className="absolute left-[18px] top-3 bottom-3 w-px bg-gradient-to-b from-blue-500/40 via-zinc-800 to-transparent" />

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
                className="relative flex items-start gap-4 rounded-xl py-3 pr-2 pl-1 hover:bg-zinc-800/30 transition-colors group"
              >
                {/* Timeline dot */}
                <div className="relative z-10 mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-900 ring-1 ring-zinc-700 group-hover:ring-blue-500/50 transition-all">
                  <div className="h-2 w-2 rounded-full bg-blue-500 group-hover:bg-blue-400 transition-colors" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 flex-wrap mb-1">
                    {type && typeStyle && (
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border uppercase tracking-wider shrink-0 ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}
                      >
                        {type}
                      </span>
                    )}
                    <p className="text-sm text-zinc-200 line-clamp-1 font-medium leading-snug group-hover:text-white transition-colors">
                      {type ? msg.replace(/^[\w-]+(\(.+\))?:\s*/, "") : msg}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-400 border border-zinc-700/40">
                      {shortOid}
                    </span>
                    <span className="text-zinc-400">{author}</span>
                    <span>·</span>
                    <span>{timeAgo(commit.committedDate)}</span>
                  </div>
                </div>

                <ExternalLink className="h-3.5 w-3.5 text-zinc-600 shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
