import Image from "next/image";
import { Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { GitHubContributor } from "@/lib/github";

interface Props {
  contributors: GitHubContributor[];
}

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-emerald-500",
  "bg-orange-500",
  "bg-rose-500",
  "bg-cyan-500",
];

export function ContributorsList({ contributors }: Props) {
  if (!contributors?.length) return null;

  const top = contributors.slice(0, 6);
  const maxCommits = top[0]?.contributions ?? 1;

  return (
    <Card className="p-5 h-full border-zinc-800/60 bg-zinc-900/40 backdrop-blur-md repo-card-anim">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="inline-flex rounded-xl bg-emerald-500/10 p-2 text-emerald-400 ring-1 ring-emerald-500/20">
            <Users className="h-4 w-4" />
          </div>
          <h2 className="text-base font-semibold text-white">Top Contributors</h2>
        </div>
        <a
          href={`https://github.com/${top[0]?.login ? "" : ""}`}
          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          View all
        </a>
      </div>

      <div className="space-y-3">
        {top.map((c, idx) => {
          const pct = Math.round((c.contributions / maxCommits) * 100);
          const initials = c.login.slice(0, 1).toUpperCase();
          const colorClass = AVATAR_COLORS[idx % AVATAR_COLORS.length];

          return (
            <a
              key={c.id}
              href={c.html_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 group rounded-xl hover:bg-zinc-800/40 -mx-1 px-1 py-1.5 transition-colors"
            >
              {/* Avatar */}
              <div className="relative h-9 w-9 shrink-0">
                {c.avatar_url ? (
                  <Image
                    src={c.avatar_url}
                    alt={c.login}
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full ring-2 ring-zinc-800 group-hover:ring-indigo-500/40 transition-all"
                  />
                ) : (
                  <div className={`h-9 w-9 rounded-full ${colorClass} flex items-center justify-center text-white text-sm font-bold`}>
                    {initials}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-medium text-zinc-200 truncate group-hover:text-white transition-colors">
                    {c.login}
                  </span>
                  <span className="text-[10px] tabular-nums text-zinc-500 shrink-0">
                    {c.contributions.toLocaleString()} commits
                  </span>
                </div>
                <div className="h-1 w-full rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-indigo-500 transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </Card>
  );
}
