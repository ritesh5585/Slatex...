"use client";

import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { FindProjectsResult, ScoredProject } from "@/lib/api/opensource/types";
import { ProfileSummary } from "./ProfileSummary";
import { SignalChips } from "./SignalChips";
import { FilterBar, type DifficultyFilter, type SortOption } from "./FilterBar";
import { ProjectCard } from "./ProjectCard";
import { Button } from "@/components/ui/button";

interface FindProjectsResultsProps {
  result: FindProjectsResult;
}

const CARDS_PER_PAGE = 8;

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

function getPageNumbers(currentPage: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "...", totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
}

// ── Main Component ────────────────────────────────────────────────────────────

export function FindProjectsResults({ result }: FindProjectsResultsProps) {
  const [activeSignals, setActiveSignals] = useState<Set<string>>(new Set());
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("any");
  const [sort, setSort] = useState<SortOption>("best");
  const [currentPage, setCurrentPage] = useState<number>(1);

  if (result.status !== "ok") return null;

  const { userSignals, projects } = result;

  const handleToggle = (id: string) => {
    setCurrentPage(1);
    setActiveSignals((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDifficultyChange = (d: DifficultyFilter) => {
    setCurrentPage(1);
    setDifficulty(d);
  };

  const handleSortChange = (s: SortOption) => {
    setCurrentPage(1);
    setSort(s);
  };

  const filtered = useMemo(() => {
    let list = projects;

    // Filter by active signals (if any selected)
    if (activeSignals.size > 0) {
      list = list.filter((p) => {
        const lang = p.language ?? "";
        return (
          activeSignals.has(lang) ||
          [...activeSignals].some((sig) =>
            p.reasons.some((r) => r.toLowerCase().includes(sig.toLowerCase())),
          )
        );
      });
    }

    // Filter by difficulty
    if (difficulty !== "any") {
      list = list.filter((p) => p.difficulty === difficulty);
    }

    return sortProjects(list, sort);
  }, [projects, activeSignals, difficulty, sort]);

  const totalPages = Math.ceil(filtered.length / CARDS_PER_PAGE);
  const safeCurrentPage = Math.min(
    Math.max(currentPage, 1),
    Math.max(totalPages, 1),
  );

  const paginated = useMemo(() => {
    const start = (safeCurrentPage - 1) * CARDS_PER_PAGE;
    return filtered.slice(start, start + CARDS_PER_PAGE);
  }, [filtered, safeCurrentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
        onDifficultyChange={handleDifficultyChange}
        onSortChange={handleSortChange}
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

      {/* Cards grid (8 cards per page) */}
      {paginated.length > 0 && (
        <div className="grid grid-cols-1 min-[860px]:grid-cols-2 gap-4">
          {paginated.map((p) => (
            <ProjectCard key={p.fullName} project={p} />
          ))}
        </div>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <nav
          className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t mt-2"
          style={{ borderColor: "var(--border)" }}
          aria-label="Open source project results pagination"
        >
          <p className="text-[12px]" style={{ color: "var(--text-secondary)" }}>
            Showing{" "}
            <span
              className="font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              {(safeCurrentPage - 1) * CARDS_PER_PAGE + 1}–
              {Math.min(safeCurrentPage * CARDS_PER_PAGE, filtered.length)}
            </span>{" "}
            of{" "}
            <span
              className="font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              {filtered.length}
            </span>{" "}
            projects
          </p>

          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(safeCurrentPage - 1)}
              disabled={safeCurrentPage === 1}
              className="h-8 px-2.5 text-xs gap-1 cursor-pointer"
              aria-label="Go to previous page"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </Button>

            <div className="flex items-center gap-1">
              {getPageNumbers(safeCurrentPage, totalPages).map((p, idx) =>
                p === "..." ? (
                  <span
                    key={`ellipsis-${idx}`}
                    className="px-2 text-xs"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={`page-${p}`}
                    type="button"
                    onClick={() => handlePageChange(Number(p))}
                    aria-label={`Go to page ${p}`}
                    aria-current={p === safeCurrentPage ? "page" : undefined}
                    className={`min-w-[32px] h-8 px-2 rounded-[8px] text-xs font-medium transition-colors duration-[120ms] cursor-pointer ${
                      p === safeCurrentPage
                        ? "font-semibold"
                        : "hover:bg-[var(--elevated)]"
                    }`}
                    style={{
                      background:
                        p === safeCurrentPage ? "var(--accent)" : "transparent",
                      color:
                        p === safeCurrentPage
                          ? "#ffffff"
                          : "var(--text-secondary)",
                      border:
                        p === safeCurrentPage
                          ? "none"
                          : "1px solid var(--border)",
                    }}
                  >
                    {p}
                  </button>
                ),
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(safeCurrentPage + 1)}
              disabled={safeCurrentPage === totalPages}
              className="h-8 px-2.5 text-xs gap-1 cursor-pointer"
              aria-label="Go to next page"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </nav>
      )}
    </div>
  );
}
