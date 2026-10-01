import { Star, GitFork, AlertCircle, GitPullRequest, Users2 } from "lucide-react";
import type { GitHubRepoGQL } from "@/lib/api/github";

interface Props {
  repo: GitHubRepoGQL;
  contributorCount?: number;
  pullRequestCount?: number;
}

function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toLocaleString();
}

export function RepoStats({ repo, contributorCount = 0, pullRequestCount = 0 }: Props) {
  const stats = [
    {
      label: "Stars",
      value: repo.stargazerCount,
      icon: Star,
      color: "text-amber-400",
      iconBg: "bg-amber-500/10 ring-amber-500/20",
    },
    {
      label: "Forks",
      value: repo.forkCount,
      icon: GitFork,
      color: "text-blue-400",
      iconBg: "bg-blue-500/10 ring-blue-500/20",
    },
    {
      label: "Open issues",
      value: repo.issues.totalCount,
      icon: AlertCircle,
      color: "text-rose-400",
      iconBg: "bg-rose-500/10 ring-rose-500/20",
    },
    {
      label: "Pull requests",
      value: pullRequestCount || repo.pullRequests?.totalCount || 0,
      icon: GitPullRequest,
      color: "text-purple-400",
      iconBg: "bg-purple-500/10 ring-purple-500/20",
    },
    {
      label: "Contributors",
      value: contributorCount,
      icon: Users2,
      color: "text-emerald-400",
      iconBg: "bg-emerald-500/10 ring-emerald-500/20",
    },
  ];

  return (
    <section className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-md overflow-hidden repo-card-anim">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 divide-x-0 sm:divide-x divide-zinc-800/60">
        {stats.map(({ label, value, icon: Icon, color, iconBg }, idx) => (
          <div
            key={label}
            className={`flex flex-col gap-1 p-5 sm:p-6 group hover:bg-zinc-800/20 transition-colors ${
              idx >= 2 && idx < 4 ? "sm:border-t-0 border-t border-zinc-800/60" : ""
            } ${idx === 4 ? "col-span-2 sm:col-span-1" : ""}`}
          >
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ring-1 ${iconBg} mb-1`}>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <div className="text-2xl sm:text-3xl font-bold tabular-nums text-white tracking-tight group-hover:scale-105 transition-transform origin-left glow-text-on-hover">
              {formatCompact(value)}
            </div>
            <div className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
              {label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
