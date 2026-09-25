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

  if (!topLanguages || topLanguages.length === 0) return null;

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
      <Card className="overflow-hidden border-zinc-800/80 bg-zinc-900/50 backdrop-blur-md">
        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-3 border-b border-zinc-800/60 p-4 sm:p-5">
          <div className="flex items-start gap-3 min-w-0">
            <div className="inline-flex shrink-0 rounded-xl bg-blue-500/10 p-2 text-blue-400 ring-1 ring-blue-500/20">
              <Code2 className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-semibold tracking-tight text-white flex flex-wrap items-center gap-x-2">
                Top Languages
                <span className="text-[11px] font-normal text-zinc-500">
                  Constellation
                </span>
              </h2>
              <p className="mt-0.5 text-[11px] sm:text-xs text-zinc-400 leading-snug">
                Dominant technologies across repositories
              </p>
            </div>
          </div>

          <Badge
            variant="muted"
            className="hidden sm:inline-flex shrink-0 items-center gap-1 text-[11px] text-zinc-400"
          >
            <Sparkles className="h-3 w-3 text-blue-400" />
            <span>{totalCount} projects</span>
          </Badge>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          {/* ── Mobile count badge (below header on small screens) ── */}
          <div className="sm:hidden">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800/80 bg-zinc-900/60 px-2.5 py-1 text-[11px] text-zinc-400">
              <Sparkles className="h-3 w-3 text-blue-400" />
              {totalCount} counted projects
            </span>
          </div>

          {/* ── Stacked Bar ── */}
          <div className="space-y-2">
            <div className="relative flex h-2.5 w-full gap-[2px] overflow-hidden rounded-full bg-zinc-800/60 ring-1 ring-zinc-700/40 p-[2px]">
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
                          {lang.name}: <strong>{lang.count}</strong> repos (
                          {lang.percent})
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
                      className="h-full rounded-full cursor-pointer transition-opacity duration-200"
                      style={{
                        backgroundColor: lang.color,
                        opacity: isDimmed ? 0.3 : 1,
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
          </div>

          {/* ── Legend: full-width rows on mobile, grid on desktop ── */}
          <ul className="flex flex-col gap-1.5 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-2">
            {languageData.map((lang) => {
              const isHovered = hoveredLanguage === lang.name;
              return (
                <li
                  key={lang.name}
                  onMouseEnter={() => setHoveredLanguage(lang.name)}
                  onMouseLeave={() => setHoveredLanguage(null)}
                  className={`group flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-all duration-200 cursor-pointer ${
                    isHovered
                      ? "border-zinc-700 bg-zinc-800/80"
                      : "border-zinc-800/60 bg-zinc-900/40 hover:border-zinc-700/80 hover:bg-zinc-800/50"
                  }`}
                >
                  {/* Color dot */}
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{
                      backgroundColor: lang.color,
                      boxShadow: `0 0 8px ${lang.color}80`,
                    }}
                  />

                  {/* Name (flex-grow) */}
                  <span className="flex-1 min-w-0 truncate text-sm font-medium text-zinc-100">
                    {lang.name}
                  </span>

                  {/* Repo count */}
                  <span className="hidden xs:inline text-[11px] text-zinc-500 tabular-nums shrink-0">
                    {lang.count} {lang.count === 1 ? "repo" : "repos"}
                  </span>

                  {/* Percent */}
                  <span className="w-12 text-right text-xs font-semibold text-zinc-300 tabular-nums shrink-0">
                    {lang.percent}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </Card>
    </motion.section>
  );
}
