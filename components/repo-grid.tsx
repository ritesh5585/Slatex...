"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitBranch, ChevronDown } from "lucide-react";
import { RepoCard, type GitHubRepo } from "@/components/repo-card";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface RepoGridProps {
  repos: GitHubRepo[];
}

const INITIAL_DISPLAY_COUNT = 6;

export function RepoGrid({ repos }: RepoGridProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!repos || repos.length === 0) {
    return (
      <section className="w-full space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="inline-flex rounded-xl bg-blue-500/10 p-2 text-blue-300 ring-1 ring-blue-500/20">
              <GitBranch className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-semibold tracking-tight text-white">
              Recent Repositories
            </h2>
          </div>
        </div>
        <EmptyState />
      </section>
    );
  }

  const visibleRepos = isExpanded
    ? repos
    : repos.slice(0, INITIAL_DISPLAY_COUNT);
  const hasMore = repos.length > INITIAL_DISPLAY_COUNT;

  return (
    <section className="w-full space-y-5">
      {/* Section Header */}
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-2.5">
          <div className="inline-flex rounded-xl bg-blue-500/10 p-2 text-blue-300 ring-1 ring-blue-500/20">
            <GitBranch className="h-4 w-4" />
          </div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-semibold tracking-tight text-white">
              Recent Repositories
            </h2>
            <Badge
              variant="secondary"
              className="px-2 py-0.5 text-xs font-semibold tabular-nums"
            >
              {repos.length}
            </Badge>
          </div>
        </div>

        {hasMore && (
          <span className="hidden sm:inline-block text-xs text-zinc-500 font-medium">
            Showing {visibleRepos.length} of {repos.length}
          </span>
        )}
      </div>

      {/* Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 "
      >
        <AnimatePresence>
          {visibleRepos.map((repo, index) => (
            <RepoCard key={repo.id} repo={repo} index={index} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* "Show more" Button */}
      {hasMore && (
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full sm:w-auto px-6 py-2.5 gap-2 border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-800/80 transition-all text-sm font-medium"
          >
            <span>
              {isExpanded
                ? "Show fewer repositories"
                : `Show all ${repos.length} repositories`}
            </span>
            <ChevronDown
              className={`h-4 w-4 text-zinc-400 transition-transform duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </Button>
        </div>
      )}
    </section>
  );
}
