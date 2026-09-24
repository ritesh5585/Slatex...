"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Activity, TrendingUp } from "lucide-react";

interface Props {
  commits: any[];
}

export function CommitActivity({ commits }: Props) {
  // ── Last 7 days build karo ──
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const data = days.map((day) => {
    const dayStr = day.toISOString().slice(0, 10);
    const count = commits.filter((c) =>
      c.commit.author.date.startsWith(dayStr),
    ).length;
    return {
      day: day.toLocaleDateString("en-IN", { weekday: "short" }),
      date: day.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      }),
      count,
    };
  });

  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const avg = (total / 7).toFixed(1);
  const todayCount = data[data.length - 1]?.count ?? 0;
  const yesterdayCount = data[data.length - 2]?.count ?? 0;
  const trend = todayCount - yesterdayCount;

  return (
    <Card className="p-6">
      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="inline-flex rounded-xl bg-emerald-500/10 p-2 text-emerald-400 ring-1 ring-emerald-500/20">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              Commit Activity
            </h2>
            <p className="text-xs text-zinc-500">Last 7 days</p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-white tabular-nums">
            {total}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-zinc-500">
            commits
          </div>
        </div>
      </div>

      {/* ── Mini stat row ── */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="rounded-lg bg-zinc-900/60 px-3 py-2 border border-zinc-800">
          <div className="text-[10px] uppercase tracking-wider text-zinc-500">
            Avg/day
          </div>
          <div className="text-sm font-semibold text-zinc-200 tabular-nums">
            {avg}
          </div>
        </div>
        <div className="rounded-lg bg-zinc-900/60 px-3 py-2 border border-zinc-800">
          <div className="text-[10px] uppercase tracking-wider text-zinc-500">
            Peak
          </div>
          <div className="text-sm font-semibold text-blue-400 tabular-nums">
            {maxCount}
          </div>
        </div>
        <div className="rounded-lg bg-zinc-900/60 px-3 py-2 border border-zinc-800">
          <div className="text-[10px] uppercase tracking-wider text-zinc-500">
            Trend
          </div>
          <div
            className={`text-sm font-semibold tabular-nums flex items-center gap-1 ${
              trend > 0
                ? "text-emerald-400"
                : trend < 0
                  ? "text-rose-400"
                  : "text-zinc-400"
            }`}
          >
            <TrendingUp
              className={`h-3 w-3 ${trend < 0 ? "rotate-180" : ""}`}
            />
            {trend > 0 ? `+${trend}` : trend}
          </div>
        </div>
      </div>

      {/* ── Bar Chart ── */}
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
          >
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#71717a", fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#71717a", fontSize: 11 }}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: "rgba(59, 130, 246, 0.05)" }}
              contentStyle={{
                background: "#18181b",
                border: "1px solid #27272a",
                borderRadius: "8px",
                fontSize: "12px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
              }}
              labelStyle={{ color: "#a1a1aa", marginBottom: "4px" }}
              formatter={(value) => [
                `${value} commit${Number(value) !== 1 ? "s" : ""}`,
                "",
              ]}
              labelFormatter={(label, payload) => {
                const item = payload?.[0]?.payload;
                return item ? `${item.date}` : String(label ?? "");
              }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={40}>
              {data.map((entry, i) => (
                <Cell
                  key={i}
                  fill={
                    entry.count === maxCount && entry.count > 0
                      ? "#3b82f6"
                      : entry.count > 0
                        ? "#60a5fa"
                        : "#27272a"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Footer ── */}
      <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
        <span>
          {data[0].date} → {data[data.length - 1].date}
        </span>
        <span>
          Peak: <span className="text-blue-400 font-semibold">{maxCount}</span>
        </span>
      </div>
    </Card>
  );
}
