import { Star, GitFork, Eye, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { GitHubRepoGQL } from "@/lib/api/github";

interface Props {
  repo: GitHubRepoGQL;
}

export function RepoStats({ repo }: Props) {
  const stats = [
    {
      label: "Stars",
      value: repo.stargazerCount,
      icon: Star,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      ring: "ring-amber-500/20",
    },
    {
      label: "Forks",
      value: repo.forkCount,
      icon: GitFork,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      ring: "ring-blue-500/20",
    },
    {
      label: "Watchers",
      value: repo.watchers.totalCount,
      icon: Eye,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      ring: "ring-emerald-500/20",
    },
    {
      label: "Issues",
      value: repo.issues.totalCount,
      icon: AlertCircle,
      color: "text-rose-400",
      bg: "bg-rose-500/10",
      ring: "ring-rose-500/20",
    },
  ];

  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
      {stats.map(({ label, value, icon: Icon, color, bg, ring }) => (
        <Card key={label} className="p-5">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg} ring-1 ${ring}`}
          >
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
          <div className="mt-3 text-3xl font-bold tabular-nums text-white">
            {value.toLocaleString()}
          </div>
          <div className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            {label}
          </div>
        </Card>
      ))}
    </section>
  );
}
