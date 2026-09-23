import Image from "next/image";
import { GitCommit, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Props {
  commits: any[];
  owner: string;
  repoName: string;
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(date).toLocaleDateString("en-IN", { month: "short", day: "numeric" });
}

export function CommitTimeline({ commits, owner, repoName }: Props) {
  if (!commits?.length) return null;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="inline-flex rounded-xl bg-blue-500/10 p-2 text-blue-400 ring-1 ring-blue-500/20">
          <GitCommit className="h-4 w-4" />
        </div>
        <h2 className="text-lg font-semibold text-white">Recent Commits</h2>
      </div>

      <div className="relative space-y-1">
        {/* Vertical line */}
        <div className="absolute left-[18px] top-2 bottom-2 w-px bg-zinc-800" />

        {commits.slice(0, 8).map((c) => {
          const msg = c.commit.message.split("\n")[0];
          return (
            <a
              key={c.sha}
              href={`https://github.com/${owner}/${repoName}/commit/${c.sha}`}
              target="_blank"
              rel="noreferrer"
              className="relative flex items-start gap-4 py-3 pl-0 pr-2 rounded-lg hover:bg-zinc-900/60 transition-colors"
            >
              <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-900 ring-2 ring-zinc-800">
                {c.author?.avatar_url ? (
                  <Image
                    src={c.author.avatar_url}
                    alt={c.commit.author.name}
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full"
                  />
                ) : (
                  <GitCommit className="h-4 w-4 text-zinc-500" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-zinc-200 line-clamp-1 font-medium">
                  {msg}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                    {c.sha.slice(0, 7)}
                  </span>
                  <span>{c.commit.author.name}</span>
                  <span>•</span>
                  <span>{timeAgo(c.commit.author.date)}</span>
                </div>
              </div>

              <ExternalLink className="h-3.5 w-3.5 text-zinc-600 shrink-0 mt-1" />
            </a>
          );
        })}
      </div>
    </Card>
  );
}