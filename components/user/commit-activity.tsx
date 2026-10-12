"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

interface ContributionDay {
  date: string;
  count: number;
}

interface CommitActivityProps {
  contributions: ContributionDay[];
}

export function CommitActivity({ contributions = [] }: CommitActivityProps) {
  const weeks = useMemo(() => {
    if (!contributions || contributions.length === 0) return [];

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const totalDays = contributions.length;
    const recent = contributions.slice(Math.max(0, totalDays - 84));

    const result: { label: string; total: number; days: number[] }[] = [];

    // Split into 7-day chunks
    for (let i = 0; i < recent.length; i += 7) {
      const chunk = recent.slice(i, i + 7);
      const total = chunk.reduce((sum, d) => sum + (d.count || 0), 0);
      const days = chunk.map((d) => d.count || 0);

      // Extract month name from the middle of the week
      const midDay = chunk[Math.floor(chunk.length / 2)]?.date || chunk[0]?.date;
      let label = "";
      if (midDay) {
        const parts = midDay.split("-");
        if (parts.length >= 2) {
          const m = parseInt(parts[1], 10) - 1;
          label = monthNames[m] || "";
        }
      }

      result.push({ label, total, days });
    }

    // Ensure we have exactly 12 weeks padded if profile is young
    while (result.length < 12) {
      result.unshift({ label: "", total: 0, days: [0, 0, 0, 0, 0, 0, 0] });
    }

    return result.slice(-12);
  }, [contributions]);

  const maxTotal = useMemo(() => {
    return Math.max(...weeks.map((w) => w.total), 1);
  }, [weeks]);

  const totalCommitsInPeriod = useMemo(() => {
    return weeks.reduce((sum, w) => sum + w.total, 0);
  }, [weeks]);

  return (
    <div className="w-full">
      {/* Bars container */}
      <div className="flex items-end gap-1.5 sm:gap-2 h-28 sm:h-32 pt-2">
        {weeks.map((week, i) => {
          const heightPercent = week.total > 0 ? Math.max((week.total / maxTotal) * 100, 8) : 3;
          const hasActivity = week.total > 0;

          return (
            <div
              key={i}
              className="group relative flex-1 flex flex-col justify-end h-full cursor-pointer"
              title={`${week.label}: ${week.total} commits`}
            >
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${heightPercent}%` }}
                transition={{ duration: 0.4, delay: i * 0.02, ease: "easeOut" }}
                className={`w-full rounded-sm transition-all duration-150 ${
                  hasActivity
                    ? "bg-indigo-500 hover:bg-indigo-400 shadow-[0_0_6px_rgba(99,102,241,0.3)]"
                    : "bg-zinc-800/80 hover:bg-zinc-700"
                }`}
                style={{ minHeight: hasActivity ? 6 : 3 }}
              />

              {/* Tooltip */}
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block z-20 pointer-events-none">
                <span className="whitespace-nowrap rounded-md bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-lg">
                  {week.total} {week.total === 1 ? "commit" : "commits"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* X-axis labels */}
      <div className="flex gap-1.5 sm:gap-2 mt-2 pt-1 border-t border-zinc-800/60">
        {weeks.map((week, i) => (
          <div key={i} className="flex-1 text-center">
            {i % 3 === 0 && week.label && (
              <span className="text-[10px] text-zinc-500 font-medium">{week.label}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
