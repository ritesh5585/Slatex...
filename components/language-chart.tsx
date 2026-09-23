"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Code2, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";
import { getLanguageColor } from "@/lib/language-colors";

interface LanguageChartProps {
  topLanguages: [string, number][];
}

export function LanguageChart({ topLanguages }: LanguageChartProps) {
  const [hoveredLanguage, setHoveredLanguage] = useState<string | null>(null);

  if (!topLanguages || topLanguages.length === 0) {
    return null;
  }

  const totalCount = topLanguages.reduce((acc, [, count]) => acc + count, 0);

  const languageData = topLanguages.map(([name, count]) => {
    const rawPercent = totalCount > 0 ? (count / totalCount) * 100 : 0;
    const percent = Math.round(rawPercent);
    const color = getLanguageColor(name);
    return {
      name,
      count,
      percent: percent === 0 && count > 0 ? "<1" : `${percent}%`,
      rawPercent,
      color,
    };
  });

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="w-full"
    >
      <Card className="overflow-hidden p-5 sm:p-7 border-zinc-800/80 bg-zinc-900/50 backdrop-blur-md">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5">
          <div className="flex items-center gap-2.5">
            <div className="inline-flex rounded-xl bg-blue-500/10 p-2 text-blue-400 ring-1 ring-blue-500/20">
              <Code2 className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold tracking-tight text-white flex items-center gap-2">
                Top Languages
                <span className="text-xs font-normal text-zinc-500">
                  (Constellation)
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Breakdown of dominant technologies across repositories
              </p>
            </div>
          </div>
          <Badge variant="muted" className="self-start sm:self-auto gap-1 text-[11px] text-zinc-400">
            <Sparkles className="h-3 w-3 text-blue-400" />
            <span>{totalCount} counted projects</span>
          </Badge>
        </div>

        {/* ── Stacked Bar Visualization ── */}
        <div className="space-y-3">
          <div className="relative h-3.5 w-full overflow-hidden rounded-full bg-zinc-800/90 p-[2px] ring-1 ring-zinc-700/50 flex gap-[2px]">
            {languageData.map((lang, index) => {
              const isDimmed =
                hoveredLanguage !== null && hoveredLanguage !== lang.name;
              return (
                <Tooltip
                  key={lang.name}
                  content={
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: lang.color }}
                      />
                      <span>
                        {lang.name}: <strong>{lang.count}</strong> repos ({lang.percent})
                      </span>
                    </div>
                  }
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${lang.rawPercent}%` }}
                    transition={{
                      duration: 0.8,
                      delay: 0.1 + index * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    onMouseEnter={() => setHoveredLanguage(lang.name)}
                    onMouseLeave={() => setHoveredLanguage(null)}
                    className="h-full rounded-full transition-all duration-200 cursor-pointer first:rounded-l-full last:rounded-r-full"
                    style={{
                      backgroundColor: lang.color,
                      opacity: isDimmed ? 0.3 : 1,
                      transform: isDimmed ? "scaleY(0.85)" : "scaleY(1)",
                      boxShadow:
                        hoveredLanguage === lang.name
                          ? `0 0 12px ${lang.color}`
                          : "none",
                    }}
                  />
                </Tooltip>
              );
            })}
          </div>

          {/* ── Legend Grid ── */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 pt-3">
            {languageData.map((lang) => {
              const isHovered = hoveredLanguage === lang.name;
              return (
                <div
                  key={lang.name}
                  onMouseEnter={() => setHoveredLanguage(lang.name)}
                  onMouseLeave={() => setHoveredLanguage(null)}
                  className={`flex items-center justify-between gap-2 rounded-xl border p-2.5 transition-all duration-200 cursor-pointer ${
                    isHovered
                      ? "border-zinc-700 bg-zinc-800/90 shadow-md -translate-y-0.5"
                      : "border-zinc-800/60 bg-zinc-900/40 hover:border-zinc-700/80 hover:bg-zinc-800/50"
                  }`}
                >
                  {/* Left: Dot & Name & Repos */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0 shadow-sm"
                      style={{
                        backgroundColor: lang.color,
                        boxShadow: `0 0 6px ${lang.color}80`,
                      }}
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs sm:text-sm font-medium text-zinc-200 truncate">
                        {lang.name}
                      </span>
                      <span className="text-[11px] text-zinc-500 tabular-nums">
                        {lang.count} {lang.count === 1 ? "repo" : "repos"}
                      </span>
                    </div>
                  </div>

                  {/* Right: Percentage Badge */}
                  <span className="rounded-md border border-zinc-700/60 bg-zinc-800/80 px-1.5 py-0.5 text-[11px] font-semibold text-zinc-300 tabular-nums shrink-0">
                    {lang.percent}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </motion.section>
  );
}
