"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  CalendarDays,
} from "lucide-react";
import type { GitHubCommitActivityWeek } from "@/lib/github";

interface Props {
  activity: GitHubCommitActivityWeek[];
}

const WEEKDAYS = ["", "Mon", "", "Wed", "", "Fri", ""];
const WEEKS_TO_SHOW = 13;

export function CommitActivity({ activity }: Props) {
  const [hovered, setHovered] = useState<{
    count: number;
    date: Date;
  } | null>(null);

  // ── Normalize + memoize data ──
  const {
    weeks,
    total,
    maxDay,
    average,
    trend,
    startDate,
    endDate,
    hasData,
  } = useMemo(() => {
    const safe = Array.isArray(activity) ? activity : [];
    const sliced = safe.slice(-WEEKS_TO_SHOW);

    // Guarantee every week has exactly 7 days
    const normalized = sliced.map((week) => {
      const days = Array.isArray(week?.days) ? week.days : [];
      const padded = Array.from({ length: 7 }, (_, i) => days[i] ?? 0);
      return { week: week.week, days: padded, total: week.total ?? 0 };
    });

    const total = normalized.reduce((sum, w) => sum + w.total, 0);
    const allDays = normalized.flatMap((w) => w.days);
    const maxDay = allDays.length ? Math.max(...allDays) : 0;
    const average = normalized.length
      ? (total / normalized.length).toFixed(1)
      : "0.0";
    const latest = normalized.at(-1)?.total ?? 0;
    const prev = normalized.at(-2)?.total ?? 0;
    const trend = latest - prev;
    const startDate = normalized[0]
      ? new Date(normalized[0].week * 1000)
      : null;
    const endDate = normalized.at(-1)
      ? new Date(normalized.at(-1)!.week * 1000)
      : null;
    const hasData = normalized.some((w) => w.total > 0);

    return {
      weeks: normalized,
      total,
      maxDay,
      average,
      trend,
      startDate,
      endDate,
      hasData,
    };
  }, [activity]);

  const intensity = (count: number) => {
    if (!count) return "bg-zinc-800/60";
    if (count <= Math.max(1, maxDay * 0.25)) return "bg-emerald-900";
    if (count <= Math.max(1, maxDay * 0.5)) return "bg-emerald-700";
    if (count <= Math.max(1, maxDay * 0.75)) return "bg-emerald-500";
    return "bg-emerald-300";
  };

  const trendMeta =
    trend > 0
      ? {
          icon: <ArrowUpRight className="h-3.5 w-3.5" />,
          color: "text-emerald-400",
          bg: "bg-emerald-500/10 ring-emerald-500/20",
          label: `+${trend}`,
        }
      : trend < 0
        ? {
            icon: <ArrowDownRight className="h-3.5 w-3.5" />,
            color: "text-rose-400",
            bg: "bg-rose-500/10 ring-rose-500/20",
            label: `${trend}`,
          }
        : {
            icon: <Minus className="h-3.5 w-3.5" />,
            color: "text-zinc-400",
            bg: "bg-zinc-500/10 ring-zinc-500/20",
            label: "0",
          };

  return (
    <Card className="overflow-hidden border-zinc-800/80 bg-zinc-900/50 backdrop-blur-md">
      {/* ══ Header ══ */}
      <div className="flex items-center justify-between gap-3 border-b border-zinc-800/60 px-4 py-3.5 sm:px-5 sm:py-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="inline-flex shrink-0 rounded-xl bg-emerald-500/10 p-2 text-emerald-400 ring-1 ring-emerald-500/20">
            <Activity className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-semibold text-white leading-tight">
              Commit Activity
            </h2>
            <p className="text-[11px] text-zinc-500 leading-tight mt-0.5">
              Last 3 months
            </p>
          </div>
        </div>

        {/* Hero number */}
        <div className="text-right shrink-0">
          <div className="text-xl sm:text-2xl font-bold text-white tabular-nums leading-none">
            {total}
          </div>
          <div className="mt-1 text-[10px] uppercase tracking-wider text-zinc-500">
            commits
          </div>
        </div>
      </div>

      {/* ══ Body ══ */}
      <div className="p-4 sm:p-5 space-y-5">
        {/* ── Stat cards ── */}
        <div className="grid grid-cols-3 gap-2">
          <StatCard
            label="Avg"
            sub="/ week"
            value={average}
            accent="text-zinc-100"
          />
          <StatCard
            label="Peak"
            sub="per day"
            value={maxDay}
            accent="text-blue-400"
          />
          <StatCard
            label="Trend"
            sub="/ week"
            value={trendMeta.label}
            accent={trendMeta.color}
            icon={trendMeta.icon}
          />
        </div>

        {/* ── Graph or empty ── */}
        {hasData ? (
          <div className="space-y-3">
            {/* Month axis */}
            <div className="flex items-center justify-between pl-8 pr-1 text-[10px] font-medium text-zinc-500">
              <span>
                {startDate?.toLocaleDateString("en-IN", { month: "short" })}
              </span>
              <span>
                {endDate?.toLocaleDateString("en-IN", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>

            {/* Heatmap scroll area */}
            <div className="relative">
              <div className="overflow-x-auto pb-1 scrollbar-thin">
                <div className="flex gap-1.5 min-w-max sm:gap-2">
                  {/* Weekday labels */}
                  <div className="grid grid-rows-7 gap-[3px] text-[9px] text-zinc-600 pt-[1px] w-6">
                    {WEEKDAYS.map((d, i) => (
                      <span key={i} className="leading-[12px]">
                        {d}
                      </span>
                    ))}
                  </div>

                  {/* Cells */}
                  <div className="grid auto-cols-[12px] grid-flow-col grid-rows-7 gap-1">
                    {weeks.flatMap((week, wi) =>
                      week.days.map((count, day) => {
                        const date = new Date(
                          week.week * 1000 + day * 86400000,
                        );
                        const isHovered =
                          hovered?.date.getTime() === date.getTime();
                        return (
                          <button
                            key={`${wi}-${day}`}
                            type="button"
                            onMouseEnter={() =>
                              setHovered({ count, date })
                            }
                            onMouseLeave={() => setHovered(null)}
                            onFocus={() => setHovered({ count, date })}
                            onBlur={() => setHovered(null)}
                            aria-label={`${count} commits on ${date.toLocaleDateString()}`}
                            className={`h-3 w-3 rounded-[3px] ring-1 ring-inset ring-white/5 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${intensity(
                              count,
                            )} ${
                              isHovered
                                ? "scale-125 ring-2 ring-emerald-400 z-10"
                                : "hover:scale-110"
                            }`}
                          />
                        );
                      }),
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Legend + live hover */}
            <div className="flex items-center justify-between gap-3 text-[10px] text-zinc-500">
              <div className="min-w-0 truncate">
                {hovered ? (
                  <span className="text-zinc-300">
                    <span className="font-semibold text-white tabular-nums">
                      {hovered.count}
                    </span>{" "}
                    commit{hovered.count === 1 ? "" : "s"} ·{" "}
                    {hovered.date.toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                ) : (
                  <span className="hidden sm:inline">
                    Hover a square for details
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <span>Less</span>
                {[
                  "bg-zinc-800/60",
                  "bg-emerald-900",
                  "bg-emerald-700",
                  "bg-emerald-500",
                  "bg-emerald-300",
                ].map((c) => (
                  <span key={c} className={`h-3 w-3 rounded-[3px] ${c}`} />
                ))}
                <span>More</span>
              </div>
            </div>
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </Card>
  );
}

// ─── Sub-components ───

function StatCard({
  label,
  sub,
  value,
  accent,
  icon,
}: {
  label: string;
  sub?: string;
  value: React.ReactNode;
  accent: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 px-3 py-2.5">
      <div className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
        {icon && <span className={accent}>{icon}</span>}
        <span>{label}</span>
      </div>
      <div className="mt-1 flex items-baseline gap-1">
        <span
          className={`text-base sm:text-lg font-bold tabular-nums ${accent}`}
        >
          {value}
        </span>
        {sub && (
          <span className="text-[10px] font-normal text-zinc-600">{sub}</span>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-zinc-800 bg-zinc-950/40 px-6 py-10 text-center">
      <div className="inline-flex rounded-full bg-zinc-800/60 p-3 text-zinc-500 ring-1 ring-zinc-700/50">
        <CalendarDays className="h-5 w-5" />
      </div>
      <div className="max-w-[260px]">
        <p className="text-sm font-semibold text-zinc-200">
          No activity in the last 3 months
        </p>
        <p className="mt-1 text-xs leading-relaxed text-zinc-500">
          GitHub has not reported any commits for this period yet.
        </p>
      </div>
    </div>
  );
}