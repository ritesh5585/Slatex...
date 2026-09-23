"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "@/components/ui/card";
import { Code2 } from "lucide-react";

const COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
  "#ef4444",
  "#84cc16",
];

interface Props {
  languages: Record<string, number>;
}

export function LanguagePie({ languages }: Props) {
  const entries = Object.entries(languages);
  const total = entries.reduce((sum, [, v]) => sum + v, 0);

  if (entries.length === 0) {
    return (
      <Card className="p-6 h-full flex flex-col items-center justify-center text-center">
        <Code2 className="h-8 w-8 text-zinc-600" />
        <p className="mt-2 text-sm text-zinc-500">No language data</p>
      </Card>
    );
  }

  const data = entries
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, bytes]) => ({
      name,
      value: bytes,
      percent: ((bytes / total) * 100).toFixed(1),
    }));

  return (
    <Card className="p-6 h-full">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="inline-flex rounded-xl bg-purple-500/10 p-2 text-purple-400 ring-1 ring-purple-500/20">
          <Code2 className="h-4 w-4" />
        </div>
        <h2 className="text-lg font-semibold text-white">Tech Stack</h2>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={45}
              outerRadius={75}
              paddingAngle={2}
              stroke="none"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#18181b",
                border: "1px solid #27272a",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value, name) => [
                `${((Number(value) / total) * 100).toFixed(1)}%`,
                name,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 space-y-2">
        {data.map((d, i) => (
          <div
            key={d.name}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: COLORS[i % COLORS.length] }}
              />
              <span className="text-zinc-300">{d.name}</span>
            </div>
            <span className="text-zinc-500 text-xs tabular-nums">
              {d.percent}%
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
