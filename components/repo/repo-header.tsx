import Link from "next/link";
import { Star, GitFork, Triangle, ExternalLink } from "lucide-react";
import type { GitHubRepoGQL } from "@/lib/api/github";

interface Props {
  repo: GitHubRepoGQL;
}

function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toLocaleString();
}

export function RepoHeader({ repo }: Props) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-md p-4 sm:p-6 repo-card-anim">
      {/* Background gradient blob */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-blue-500/8 blur-3xl" />

      <div className="relative flex flex-col gap-3.5 sm:flex-row sm:items-start sm:gap-5">
        {/* Repo icon box */}
        <div className="flex h-11 w-11 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl bg-zinc-800 ring-1 ring-zinc-700/60 shadow-lg">
          <Triangle className="h-5 w-5 sm:h-6 sm:w-6 text-white fill-white" strokeWidth={0} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Owner / Name */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
            <Link
              href={`/profiles?username=${encodeURIComponent(repo.owner.login)}`}
              className="text-xs sm:text-sm text-zinc-400 hover:text-indigo-400 transition-colors"
            >
              {repo.owner.login} /
            </Link>
            <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-white break-words">
              {repo.name}
            </h1>
            <span className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-800/60 px-2 py-0.5 text-[10px] font-medium text-zinc-400">
              {repo.isPrivate ? "Private" : "Public"}
            </span>
            {repo.isArchived && (
              <span className="inline-flex items-center rounded-full border border-amber-700/50 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400">
                Archived
              </span>
            )}
          </div>

          {/* Description */}
          {repo.description && (
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed mb-3">
              {repo.description}
            </p>
          )}

          {/* Topics */}
          {repo.repositoryTopics.nodes.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {repo.repositoryTopics.nodes.slice(0, 8).map(({ topic }) => (
                <span
                  key={topic.name}
                  className="inline-flex items-center rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-[11px] font-medium text-indigo-300"
                >
                  {topic.name}
                </span>
              ))}
            </div>
          )}

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs text-zinc-400">
            {repo.primaryLanguage && (
              <span className="flex items-center gap-1.5 text-zinc-300">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: repo.primaryLanguage.color || "#64748b" }}
                />
                <span className="text-xs font-medium">{repo.primaryLanguage.name}</span>
              </span>
            )}
            {repo.licenseInfo?.spdxId && (
              <span className="text-zinc-500">{repo.licenseInfo.spdxId}</span>
            )}
            <span className="text-zinc-500">
              Updated{" "}
              {new Date(repo.updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Action buttons - Mobile friendly */}
        <div className="flex flex-row sm:flex-col gap-2 shrink-0 pt-1 sm:pt-0">
          <a
            href={repo.url}
            target="_blank"
            rel="noreferrer"
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800/70 px-3 py-1.5 sm:py-2 text-xs font-semibold text-white hover:border-amber-500/50 hover:bg-amber-500/10 hover:text-amber-300 transition-all active:scale-95"
          >
            <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
            <span>Star</span>
            <span className="ml-1 rounded-md bg-zinc-700/80 px-1.5 py-0.5 text-[10px] tabular-nums text-zinc-300">
              {formatCompact(repo.stargazerCount)}
            </span>
          </a>
          <a
            href={`${repo.url}/fork`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800/70 px-3 py-1.5 sm:py-2 text-xs font-semibold text-white hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-300 transition-all active:scale-95"
          >
            <GitFork className="h-3.5 w-3.5 text-indigo-400" />
            <span>Fork</span>
            <span className="ml-1 rounded-md bg-zinc-700/80 px-1.5 py-0.5 text-[10px] tabular-nums text-zinc-300">
              {formatCompact(repo.forkCount)}
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
