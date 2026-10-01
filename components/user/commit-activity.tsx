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

export function CommitActivity({ contributions }: CommitActivityProps) {
  const weeks = useMemo(() => {
    // Build last 12 weeks of daily data grouped by week
    const today = new Date();
    const result: { label: string; total: number; days: number[] }[] = [];

    for (let w = 11; w >= 0; w--) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - w * 7 - today.getDay());
      const days: number[] = [];
      let total = 0;

      for (let d = 0; d < 7; d++) {
        const day = new Date(weekStart);
        day.setDate(weekStart.getDate() + d);
        const dateStr = day.toISOString().slice(0, 10);
        const found = contributions.find((c) => c.date === dateStr);
        const count = found?.count ?? 0;
        days.push(count);
        total += count;
      }

      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      result.push({
        label: monthNames[weekStart.getMonth()],
        total,
        days,
      });
    }

    return result;
  }, [contributions]);

  const maxTotal = Math.max(...weeks.map((w) => w.total), 1);

  return (
    <div className="w-full">
      {/* Bars */}
      <div className="flex items-end gap-[3px] h-32">
        {weeks.map((week, i) => {
          const heightPercent = (week.total / maxTotal) * 100;
          return (
            <div
              key={i}
              className="group relative flex-1 flex flex-col justify-end cursor-pointer"
              title={`${week.label}: ${week.total} commits`}
            >
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(heightPercent, 2)}%` }}
                transition={{ duration: 0.6, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                className="w-full rounded-[3px] bg-indigo-500/70 group-hover:bg-indigo-400 transition-colors duration-150"
                style={{ minHeight: week.total > 0 ? 3 : 1 }}
              />
              {/* Tooltip */}
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block z-10 pointer-events-none">
                <span className="whitespace-nowrap rounded bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 text-[10px] text-zinc-200 shadow">
                  {week.total}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* X-axis labels (every 3rd) */}
      <div className="flex gap-[3px] mt-1">
        {weeks.map((week, i) => (
          <div key={i} className="flex-1 text-center">
            {i % 3 === 0 && (
              <span className="text-[9px] text-zinc-600">{week.label}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
