"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  GitCommit,
  GitBranch,
  Star,
  GitFork,
  ExternalLink,
  Search,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLanguageColor } from "@/lib/language-colors";
import type { RepoCommitContribution } from "@/lib/api/github/types";

interface CommitRepoCardsProps {
  repoContributions: RepoCommitContribution[];
  username: string;
}

export function CommitRepoCards({
  repoContributions,
  username,
}: CommitRepoCardsProps) {
  const [filterQuery, setFilterQuery] = useState("");

  const filteredRepos = useMemo(() => {
    if (!filterQuery.trim()) return repoContributions;
    const q = filterQuery.toLowerCase();
    return repoContributions.filter(
      (r) =>
        r.repository.name.toLowerCase().includes(q) ||
        r.repository.owner.login.toLowerCase().includes(q) ||
        (r.repository.description &&
          r.repository.description.toLowerCase().includes(q)) ||
        (r.repository.primaryLanguage?.name &&
          r.repository.primaryLanguage.name.toLowerCase().includes(q)),
    );
  }, [repoContributions, filterQuery]);

  if (!repoContributions || repoContributions.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-800/70 bg-zinc-900/30 p-10 text-center">
        <GitCommit className="h-10 w-10 text-zinc-500 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-white">No Commit Activity Recorded</h3>
        <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
          No public commit contributions were found for @{username} in the recent period.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
            <Layers className="h-4 w-4 text-indigo-400" />
            <span>Active Repositories</span>
            <Badge variant="secondary" className="px-2 py-0 text-xs font-semibold bg-zinc-800 text-zinc-300">
              {filteredRepos.length}
            </Badge>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Repositories where @{username} actively pushed commits
          </p>
        </div>

        {/* Filter input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Filter active repos..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full rounded-xl bg-zinc-950/70 border border-zinc-800/80 pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/70 transition-all"
          />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRepos.map((item, idx) => {
          const repo = item.repository;
          const totalCommitsInRepo = item.contributions.totalCount ||
            item.contributions.nodes.reduce((s, n) => s + (n.commitCount || 1), 0);
          const langColor = getLanguageColor(repo.primaryLanguage?.name || null);
          const latestCommit = item.contributions.nodes[0];

          let latestDateLabel = "Recent";
          if (latestCommit?.occurredAt) {
            const date = new Date(latestCommit.occurredAt);
            const daysAgo = Math.round((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
            latestDateLabel = daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : `${daysAgo}d ago`;
          }

          return (
            <Card
              key={repo.id || `${repo.owner.login}/${repo.name}-${idx}`}
              className="flex flex-col justify-between p-5 border-zinc-800/80 bg-zinc-900/50 backdrop-blur-md hover:border-zinc-700/80 transition-all duration-200 group"
            >
              <div>
                {/* Header: Repo info & commit count badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono mb-1 truncate">
                      <img
                        src={repo.owner.avatarUrl || "https://github.com/ghost.png"}
                        alt={repo.owner.login}
                        className="h-4 w-4 rounded-full ring-1 ring-zinc-700 shrink-0"
                      />
                      <span>{repo.owner.login}</span>
                    </div>

                    <Link
                      href={`/repo?owner=${repo.owner.login}&repo=${repo.name}`}
                      className="text-base font-semibold text-white group-hover:text-indigo-400 transition-colors truncate block"
                    >
                      {repo.name}
                    </Link>
                  </div>

                  {/* Commits count badge */}
                  <div className="shrink-0 flex flex-col items-end">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 px-2.5 py-1 text-xs font-bold text-indigo-400 shadow-sm">
                      <GitCommit className="h-3.5 w-3.5" />
                      <span>{totalCommitsInRepo} commit{totalCommitsInRepo !== 1 ? "s" : ""}</span>
                    </span>
                    <span className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1">
                      <Calendar className="h-2.5 w-2.5" /> {latestDateLabel}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="mt-3 text-xs sm:text-sm text-zinc-400 line-clamp-2 min-h-8 leading-relaxed">
                  {repo.description || "No repository description provided."}
                </p>
              </div>

              {/* Bottom Footer */}
              <div className="mt-4 pt-3 border-t border-zinc-800/70 flex items-center justify-between text-xs text-zinc-400">
                {/* Language */}
                <div className="flex items-center gap-2 min-w-0">
                  {repo.primaryLanguage ? (
                    <>
                      <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: langColor }}
                      />
                      <span className="text-zinc-300 font-medium truncate">
                        {repo.primaryLanguage.name}
                      </span>
                    </>
                  ) : (
                    <span className="text-zinc-500">Plain text</span>
                  )}
                </div>

                {/* Actions & Metrics */}
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-zinc-400 tabular-nums">
                    <Star className="h-3 w-3 text-amber-400/80 fill-amber-400/20" />
                    <span>{repo.stargazerCount.toLocaleString()}</span>
                  </span>

                  <Link
                    href={`/repo?owner=${repo.owner.login}&repo=${repo.name}`}
                    className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                  >
                    <span>Inspect</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
