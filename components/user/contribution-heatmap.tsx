"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

interface ContributionDay {
  date: string;
  count: number;
}

interface HeatmapProps {
  contributions: ContributionDay[];
}

const LEVELS = [
  { max: 0, color: "#161b22" },
  { max: 3, color: "#0e4429" },
  { max: 6, color: "#006d32" },
  { max: 9, color: "#26a641" },
  { max: Infinity, color: "#39d353" },
];

function getLevel(count: number) {
  if (count === 0) return LEVELS[0];
  if (count <= 3) return LEVELS[1];
  if (count <= 6) return LEVELS[2];
  if (count <= 9) return LEVELS[3];
  return LEVELS[4];
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["", "Mon", "", "Wed", "", "Fri", ""];

export function ContributionHeatmap({ contributions }: HeatmapProps) {
  const { weeks, monthLabels } = useMemo(() => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setFullYear(today.getFullYear() - 1);
    // Align to Sunday
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const contribMap = new Map(contributions.map((d) => [d.date, d.count]));

    const weeks: { date: string; count: number }[][] = [];
    const monthLabels: { month: string; col: number }[] = [];

    let current = new Date(startDate);
    let weekIndex = 0;
    let lastMonth = -1;

    while (current <= today) {
      const week: { date: string; count: number }[] = [];
      for (let d = 0; d < 7; d++) {
        const dateStr = current.toISOString().slice(0, 10);
        const count = contribMap.get(dateStr) ?? 0;
        const month = current.getMonth();
        if (month !== lastMonth && d === 0) {
          monthLabels.push({ month: MONTHS[month], col: weekIndex });
          lastMonth = month;
        }
        week.push({ date: dateStr, count });
        current.setDate(current.getDate() + 1);
      }
      weeks.push(week);
      weekIndex++;
    }

    return { weeks, monthLabels };
  }, [contributions]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full overflow-x-auto"
    >
      {/* Month labels */}
      <div className="relative" style={{ paddingLeft: 28 }}>
        <div className="flex gap-[3px] mb-1 text-[10px] text-zinc-500">
          {monthLabels.map(({ month, col }, i) => (
            <span
              key={`${month}-${i}`}
              style={{ position: "absolute", left: 28 + col * 13, fontSize: 10 }}
            >
              {month}
            </span>
          ))}
        </div>
        <div style={{ height: 16 }} />

        {/* Grid */}
        <div className="flex gap-[3px]">
          {/* Day labels */}
          <div className="flex flex-col gap-[3px] mr-1">
            {DAYS.map((day, i) => (
              <span key={i} className="text-[9px] text-zinc-600 leading-none" style={{ height: 10, lineHeight: "10px" }}>
                {day}
              </span>
            ))}
          </div>

          {/* Weeks */}
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map(({ date, count }, di) => {
                const level = getLevel(count);
                return (
                  <motion.div
                    key={date}
                    title={`${date}: ${count} contribution${count !== 1 ? "s" : ""}`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: (wi * 7 + di) * 0.0008 }}
                    className="rounded-[2px] cursor-pointer transition-all duration-100 hover:ring-1 hover:ring-white/30"
                    style={{
                      width: 10,
                      height: 10,
                      backgroundColor: level.color,
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 mt-3">
          <span className="text-[10px] text-zinc-500">Less</span>
          {LEVELS.map((lvl, i) => (
            <div
              key={i}
              className="rounded-[2px]"
              style={{ width: 10, height: 10, backgroundColor: lvl.color }}
            />
          ))}
          <span className="text-[10px] text-zinc-500">More</span>
        </div>
      </div>
    </motion.div>
  );
}
