"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { MonthlyPoint } from "@/lib/api/github/services/compare";

interface MonthlyChartProps {
  data: MonthlyPoint[];
  u1Name: string;
  u2Name: string;
}

const CustomTooltip = ({ active, payload, label, u1Name, u2Name }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-zinc-700/80 bg-[#0d0f17]/95 px-3 py-2 shadow-2xl backdrop-blur-md text-xs z-50">
      <p className="text-zinc-400 font-semibold mb-1.5">{label}</p>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-sm bg-blue-500" />
          <span className="text-zinc-300">@{u1Name}:</span>
          <span className="font-bold text-white tabular-nums">
            {payload[0]?.value?.toLocaleString()} commits
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-sm bg-amber-500" />
          <span className="text-zinc-300">@{u2Name}:</span>
          <span className="font-bold text-white tabular-nums">
            {payload[1]?.value?.toLocaleString()} commits
          </span>
        </div>
      </div>
    </div>
  );
};

export function MonthlyContributionChart({
  data,
  u1Name,
  u2Name,
}: MonthlyChartProps) {
  return (
    <div className="w-full h-60 sm:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#27272a"
            vertical={false}
            opacity={0.3}
          />
          <XAxis
            dataKey="month"
            stroke="#71717a"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#71717a"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            content={
              <CustomTooltip u1Name={u1Name} u2Name={u2Name} />
            }
            cursor={{ fill: "rgba(255, 255, 255, 0.04)" }}
          />
          <Bar
            dataKey="u1"
            name={u1Name}
            fill="#3b82f6"
            radius={[3, 3, 0, 0]}
            maxBarSize={22}
          />
          <Bar
            dataKey="u2"
            name={u2Name}
            fill="#f59e0b"
            radius={[3, 3, 0, 0]}
            maxBarSize={22}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
