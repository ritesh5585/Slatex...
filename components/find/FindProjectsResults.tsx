"use client";

import React, { useMemo, useState } from "react";
import type { FindProjectsResult, ScoredProject } from "@/lib/api/opensource/types";
import { ProfileSummary } from "./ProfileSummary";
import { SignalChips } from "./SignalChips";
import { FilterBar, type DifficultyFilter, type SortOption } from "./FilterBar";
import { ProjectCard } from "./ProjectCard";

interface FindProjectsResultsProps {
  result: FindProjectsResult;
}

// ── sort comparators ──────────────────────────────────────────────────────────

function sortProjects(
  projects: ScoredProject[],
  sort: SortOption,
): ScoredProject[] {
  const copy = [...projects];
  if (sort === "best") return copy.sort((a, b) => b.score - a.score);
  if (sort === "stars") return copy.sort((a, b) => b.stars - a.stars);
  if (sort === "recent")
    return copy.sort(
      (a, b) => new Date(b.pushedAt).getTime() - new Date(a.pushedAt).getTime(),
    );
  if (sort === "issues")
    return copy.sort((a, b) => b.beginnerIssues - a.beginnerIssues);
  return copy;
}

// ── Main Component ────────────────────────────────────────────────────────────

export function FindProjectsResults({ result }: FindProjectsResultsProps) {
  const [activeSignals, setActiveSignals] = useState<Set<string>>(
    new Set(),
  );
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("any");
  const [sort, setSort] = useState<SortOption>("best");

  if (result.status !== "ok") return null;

  const { userSignals, projects } = result;

  const handleToggle = (id: string) => {
    setActiveSignals((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = useMemo(() => {
    let list = projects;

    // Filter by active signals (if any selected)
    if (activeSignals.size > 0) {
      list = list.filter((p) => {
        const lang = p.language ?? "";
        return activeSignals.has(lang) ||
          [...activeSignals].some(
            (sig) =>
              p.reasons.some((r) => r.toLowerCase().includes(sig.toLowerCase())),
          );
      });
    }

    // Filter by difficulty
    if (difficulty !== "any") {
      list = list.filter((p) => p.difficulty === difficulty);
    }

    return sortProjects(list, sort);
  }, [projects, activeSignals, difficulty, sort]);

  return (
    <div className="flex flex-col gap-4">
      {/* Profile row */}
      <ProfileSummary
        avatarUrl={userSignals.avatarUrl}
        username={userSignals.username}
        summaryText={userSignals.summaryText}
      />

      {/* Signal chips */}
      {userSignals.signals.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <p
            className="text-[12px]"
            style={{ color: "var(--text-tertiary)" }}
          >
            Matching on
          </p>
          <SignalChips
            signals={userSignals.signals}
            active={activeSignals}
            onToggle={handleToggle}
          />
        </div>
      )}

      {/* Filter bar */}
      <FilterBar
        count={filtered.length}
        difficulty={difficulty}
        sort={sort}
        onDifficultyChange={setDifficulty}
        onSortChange={setSort}
      />

      {/* Zero-results message */}
      {filtered.length === 0 && (
        <div
          className="rounded-[12px] border py-10 px-4 text-center"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <p
            className="text-sm font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            No projects match the current filters.
          </p>
          <p
            className="text-[13px] mt-1"
            style={{ color: "var(--text-secondary)" }}
          >
            Try clearing a chip filter or changing the difficulty.
          </p>
        </div>
      )}

      {/* Cards grid */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-1 min-[860px]:grid-cols-2 gap-4">
          {filtered.map((p) => (
            <ProjectCard key={p.fullName} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}
