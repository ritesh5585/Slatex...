import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { GitHubRepoGQL } from "@/lib/api/github";

interface Props {
  repo: GitHubRepoGQL;
}

export function RepoHeader({ repo }: Props) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8">
      {/* Subtle gradient blob */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-zinc-500">{repo.owner.login} /</span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white truncate">
              {repo.name}
            </h1>
            {repo.isPrivate && <Badge variant="secondary">Private</Badge>}
            {repo.isArchived && <Badge variant="secondary">Archived</Badge>}
          </div>

          {repo.description && (
            <p className="mt-2 text-sm text-zinc-400 max-w-2xl leading-relaxed">
              {repo.description}
            </p>
          )}

          {/* Topics */}
          {repo.repositoryTopics.nodes.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {repo.repositoryTopics.nodes.slice(0, 8).map(({ topic }) => (
                <Badge key={topic.name} variant="secondary" className="text-xs">
                  {topic.name}
                </Badge>
              ))}
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <span className="h-3 w-3 rounded-full bg-blue-400" />
              {repo.primaryLanguage?.name || "—"}
            </span>
            {repo.licenseInfo?.spdxId && (
              <span className="text-zinc-400">{repo.licenseInfo.spdxId}</span>
            )}
            <span className="text-zinc-500 text-xs">
              Updated{" "}
              {new Date(repo.updatedAt).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
            <a
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              className="ml-auto inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-xs font-medium"
            >
              View on GitHub <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
