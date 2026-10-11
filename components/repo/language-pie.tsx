"use client";

import { Card } from "@/components/ui/card";
import { Code2 } from "lucide-react";
import { getLanguageColor as getLangColor } from "@/lib/language-colors";

interface Props {
  languages: Record<string, number>;
}

export function LanguagePie({ languages }: Props) {
  const entries = Object.entries(languages);
  const total = entries.reduce((sum, [, v]) => sum + v, 0);

  if (entries.length === 0) {
    return (
      <Card className="p-6 h-full flex flex-col items-center justify-center text-center border-zinc-800/60 bg-zinc-900/40 backdrop-blur-md repo-card-anim">
        <Code2 className="h-8 w-8 text-zinc-600" />
        <p className="mt-2 text-sm text-zinc-500">No language data</p>
      </Card>
    );
  }

  const data = entries
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, bytes], idx) => ({
      name,
      bytes,
      pct: ((bytes / total) * 100).toFixed(1),
      color: getLangColor(name),
    }));

  return (
    <Card className="p-5 h-full border-zinc-800/60 bg-zinc-900/40 backdrop-blur-md repo-card-anim">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="inline-flex rounded-xl bg-purple-500/10 p-2 text-purple-400 ring-1 ring-purple-500/20">
          <Code2 className="h-4 w-4" />
        </div>
        <h2 className="text-base font-semibold text-white">Top languages</h2>
      </div>

      {/* Segmented bar */}
      <div className="flex h-2 w-full rounded-full overflow-hidden mb-5 gap-px">
        {data.map((d) => (
          <div
            key={d.name}
            className="h-full transition-all duration-700 hover:opacity-80"
            style={{ width: `${d.pct}%`, backgroundColor: d.color }}
            title={`${d.name}: ${d.pct}%`}
          />
        ))}
      </div>

      {/* Language rows */}
      <div className="space-y-3">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-3 group">
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: d.color }}
            />
            <span className="flex-1 text-sm text-zinc-300 group-hover:text-white transition-colors truncate">
              {d.name}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-20 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${d.pct}%`, backgroundColor: d.color }}
                />
              </div>
              <span className="text-xs text-zinc-500 tabular-nums w-9 text-right">
                {d.pct}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
