"use client";
import type { Signal } from "@/lib/api/opensource/types";

interface SignalChipsProps {
  signals: Signal[];
  active: Set<string>;
  onToggle: (id: string) => void;
}

/**
 * Horizontally-scrollable toggle chips.
 * Active chip: inverted bg (accent) + white text.
 * Inactive: surface border.
 */
export function SignalChips({ signals, active, onToggle }: SignalChipsProps) {
  return (
    <div
      className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1"
      role="group"
      aria-label="Filter by signal"
    >
      {signals.map((s) => {
        const isOn = active.has(s.id);
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onToggle(s.id)}
            aria-pressed={isOn}
            className="shrink-0 px-3 py-1.5 rounded-[8px] text-[13px] font-medium border transition-colors duration-[120ms] focus-visible:outline-2 focus-visible:outline-offset-2 min-h-[44px] sm:min-h-0"
            style={
              isOn
                ? {
                  background: "var(--accent)",
                  color: "#fff",
                  borderColor: "var(--accent)",
                }
                : {
                  background: "var(--surface)",
                  color: "var(--text-secondary)",
                  borderColor: "var(--border)",
                }
            }
          >
            {s.id}
          </button>
        );
      })}
    </div>
  );
}
