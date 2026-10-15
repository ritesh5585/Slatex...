"use client";

export type DifficultyFilter = "any" | "Beginner" | "Intermediate";
export type SortOption = "best" | "stars" | "recent" | "issues";

interface FilterBarProps {
  count: number;
  difficulty: DifficultyFilter;
  sort: SortOption;
  onDifficultyChange: (v: DifficultyFilter) => void;
  onSortChange: (v: SortOption) => void;
}

const selectClass =
  "rounded-[8px] border px-2.5 py-1.5 text-[13px] font-medium transition-colors duration-[120ms] focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer min-h-[44px] sm:min-h-[36px]";

/**
 * Filter bar: count text on left, two selects on right.
 * Stacks on mobile.
 */
export function FilterBar({
  count,
  difficulty,
  sort,
  onDifficultyChange,
  onSortChange,
}: FilterBarProps) {
  const style = {
    background: "var(--surface)",
    color: "var(--text-secondary)",
    borderColor: "var(--border)",
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3">
      {/* Count */}
      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
        <span className="font-medium" style={{ color: "var(--text-primary)" }}>
          {count}
        </span>{" "}
        {count === 1 ? "project" : "projects"} match
      </p>

      {/* Selects */}
      <div className="flex items-center gap-2">
        <select
          id="find-difficulty-select"
          value={difficulty}
          onChange={(e) => onDifficultyChange(e.target.value as DifficultyFilter)}
          className={selectClass}
          style={style}
          aria-label="Filter by difficulty"
        >
          <option value="any">Any difficulty</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
        </select>

        <select
          id="find-sort-select"
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className={selectClass}
          style={style}
          aria-label="Sort projects"
        >
          <option value="best">Best fit</option>
          <option value="stars">Most stars</option>
          <option value="recent">Most recent</option>
          <option value="issues">Most issues</option>
        </select>
      </div>
    </div>
  );
}
