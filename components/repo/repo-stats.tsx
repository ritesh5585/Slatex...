import { Star, GitFork, Eye, HardDrive, GitCommit, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Props {
  repo: any;
}

const STATS = [
  { key: "stargazers_count", label: "Stars", icon: Star, color: "text-amber-400", bg: "bg-amber-500/10", ring: "ring-amber-500/20" },
  { key: "forks_count", label: "Forks", icon: GitFork, color: "text-blue-400", bg: "bg-blue-500/10", ring: "ring-blue-500/20" },
  { key: "watchers_count", label: "Watchers", icon: Eye, color: "text-emerald-400", bg: "bg-emerald-500/10", ring: "ring-emerald-500/20" },
  { key: "open_issues_count", label: "Issues", icon: AlertCircle, color: "text-rose-400", bg: "bg-rose-500/10", ring: "ring-rose-500/20" },
];

export function RepoStats({ repo }: Props) {
  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
      {STATS.map(({ key, label, icon: Icon, color, bg, ring }) => (
        <Card key={key} className="p-5">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg} ring-1 ${ring}`}>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
          <div className="mt-3 text-3xl font-bold tabular-nums text-white">
            {(repo[key] ?? 0).toLocaleString()}
          </div>
          <div className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            {label}
          </div>
        </Card>
      ))}
    </section>
  );
}