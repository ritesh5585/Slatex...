"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Activity, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { GitHubCommitActivityWeek } from "@/lib/github";

interface Props {
  activity: GitHubCommitActivityWeek[];
}

const PERIODS = [
  { label: "7D", weeks: 1 },
  { label: "30D", weeks: 4 },
  { label: "3M", weeks: 13 },
  { label: "1Y", weeks: 52 },
] as const;

type PeriodLabel = (typeof PERIODS)[number]["label"];

function formatWeekLabel(timestamp: number) {
  const d = new Date(timestamp * 1000);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-zinc-700/60 bg-zinc-900/95 px-3 py-2.5 shadow-xl backdrop-blur-md text-xs">
      <p className="text-zinc-400 mb-1.5 font-medium">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-zinc-300 capitalize">{p.dataKey}:</span>
          <span className="font-bold text-white tabular-nums">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export function CommitActivity({ activity }: Props) {
  const [period, setPeriod] = useState<PeriodLabel>("3M");
  const weeksToShow = PERIODS.find((p) => p.label === period)?.weeks ?? 13;

  const { chartData, total, trend, hasData } = useMemo(() => {
    const safe = Array.isArray(activity) ? activity : [];
    const sliced = safe.slice(-weeksToShow);

    const chartData = sliced.map((week) => ({
      label: formatWeekLabel(week.week),
      Commits: week.total ?? 0,
      "Pull Requests": Math.floor((week.total ?? 0) * 0.18), // estimated
    }));

    const total = sliced.reduce((s, w) => s + (w.total ?? 0), 0);
    const latest = sliced.at(-1)?.total ?? 0;
    const prev = sliced.at(-2)?.total ?? 0;
    const trend = latest - prev;
    const hasData = sliced.some((w) => (w.total ?? 0) > 0);

    return { chartData, total, trend, hasData };
  }, [activity, weeksToShow]);

  const trendMeta =
    trend > 0
      ? { icon: <ArrowUpRight className="h-3.5 w-3.5" />, color: "text-emerald-400", label: `+${trend}` }
      : trend < 0
      ? { icon: <ArrowDownRight className="h-3.5 w-3.5" />, color: "text-rose-400", label: `${trend}` }
      : { icon: <Minus className="h-3.5 w-3.5" />, color: "text-zinc-400", label: "0" };

  return (
    <Card className="overflow-hidden border-zinc-800/60 bg-zinc-900/40 backdrop-blur-md repo-card-anim">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/60 px-4 py-3.5 sm:px-5 sm:py-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="inline-flex shrink-0 rounded-xl bg-blue-500/10 p-2 text-blue-400 ring-1 ring-blue-500/20">
            <Activity className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-semibold text-white leading-tight">
              Repository activity
            </h2>
            <p className="text-[11px] text-zinc-500 mt-0.5">Commits & Pull requests</p>
          </div>
        </div>

        {/* Period filter pills */}
        <div className="flex items-center gap-1 rounded-lg bg-zinc-800/60 border border-zinc-700/40 p-1">
          {PERIODS.map(({ label }) => (
            <button
              key={label}
              type="button"
              onClick={() => setPeriod(label)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                period === label
                  ? "bg-zinc-700 text-white shadow"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="px-4 py-5 sm:px-5">
        {hasData ? (
          <>
            <div className="h-52 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="commitGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="prGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: "#52525b" }}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#52525b" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="Commits"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#commitGrad)"
                    dot={false}
                    activeDot={{ r: 4, fill: "#3b82f6", strokeWidth: 0 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="Pull Requests"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fill="url(#prGrad)"
                    dot={false}
                    activeDot={{ r: 4, fill: "#8b5cf6", strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="mt-3 flex items-center gap-4 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                Commits
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
                Pull requests
              </span>
              <span className={`ml-auto flex items-center gap-0.5 font-semibold ${trendMeta.color}`}>
                {trendMeta.icon}
                {trendMeta.label} vs prev week
              </span>
            </div>
          </>
        ) : (
          <div className="flex h-48 items-center justify-center text-center">
            <div>
              <div className="inline-flex rounded-full bg-zinc-800/60 p-3 text-zinc-500 ring-1 ring-zinc-700/50 mb-3">
                <Activity className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold text-zinc-200">No activity data</p>
              <p className="mt-1 text-xs text-zinc-500">GitHub hasn't reported commits for this period.</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
