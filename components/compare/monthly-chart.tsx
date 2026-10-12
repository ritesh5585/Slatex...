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
    <div className="rounded-lg border border-zinc-700/80 bg-[#0d0f17]/95 px-2.5 py-1.5 shadow-xl backdrop-blur-md text-[11px] z-50">
      <p className="text-zinc-400 font-semibold mb-1">{label}</p>
      <div className="space-y-0.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-xs bg-blue-500 shrink-0" />
          <span className="text-zinc-300 truncate max-w-[90px]">@{u1Name}:</span>
          <span className="font-bold text-white tabular-nums">
            {payload[0]?.value?.toLocaleString()} commits
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-xs bg-amber-500 shrink-0" />
          <span className="text-zinc-300 truncate max-w-[90px]">@{u2Name}:</span>
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
    <div className="w-full h-56 sm:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 0, left: -24, bottom: 0 }}
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
            fontSize={10}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#71717a"
            fontSize={10}
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
            radius={[2, 2, 0, 0]}
            maxBarSize={16}
          />
          <Bar
            dataKey="u2"
            name={u2Name}
            fill="#f59e0b"
            radius={[2, 2, 0, 0]}
            maxBarSize={16}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
