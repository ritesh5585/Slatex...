"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ContributionDay {
  date: string;
  count: number;
}

interface Props {
  contributions: ContributionDay[];
  totalContributions?: number;
}

interface StreakStats {
  total: number;
  current: number;
  longest: number;
  currentStart: Date | null;
  currentEnd: Date | null;
  longestStart: Date | null;
  longestEnd: Date | null;
  firstDate: Date | null;
  lastDate: Date | null;
}

function computeStreaks(days: ContributionDay[]): StreakStats {
  const empty: StreakStats = {
    total: 0,
    current: 0,
    longest: 0,
    currentStart: null,
    currentEnd: null,
    longestStart: null,
    longestEnd: null,
    firstDate: null,
    lastDate: null,
  };

  if (!days?.length) return empty;

  const sorted = [...days]
    .map((e) => ({ ...e, dateObj: new Date(e.date) }))
    .filter((e) => !isNaN(e.dateObj.getTime()))
    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

  if (!sorted.length) return empty;

  const total = sorted.reduce((sum, e) => sum + (e.count || 0), 0);

  let longest = 0;
  let longestStart: Date | null = null;
  let longestEnd: Date | null = null;

  let current = 0;
  let currentStart: Date | null = null;
  let currentEnd: Date | null = null;

  let runLength = 0;
  let runStart: Date | null = null;

  for (let i = 0; i < sorted.length; i++) {
    const { count, dateObj } = sorted[i];

    if (count > 0) {
      if (runLength === 0) runStart = dateObj;
      runLength++;

      if (runLength > longest) {
        longest = runLength;
        longestStart = runStart;
        longestEnd = dateObj;
      }
    } else {
      runLength = 0;
      runStart = null;
    }
  }

  // Current streak: count backwards from the last day
  // Only counts if the last day OR the day before has activity (grace for today)
  const last = sorted[sorted.length - 1];
  const secondLast = sorted[sorted.length - 2];

  const lastHasActivity = (last?.count ?? 0) > 0;
  const secondLastHasActivity = (secondLast?.count ?? 0) > 0;

  if (lastHasActivity || secondLastHasActivity) {
    let streak = 0;
    let start: Date | null = null;
    let end: Date | null = null;

    for (let i = sorted.length - 1; i >= 0; i--) {
      if (sorted[i].count > 0) {
        if (!end) end = sorted[i].dateObj;
        start = sorted[i].dateObj;
        streak++;
      } else {
        if (i === sorted.length - 1) continue;
        break;
      }
    }

    current = streak;
    currentStart = start;
    currentEnd = end;
  }

  return {
    total,
    current,
    longest,
    currentStart,
    currentEnd,
    longestStart,
    longestEnd,
    firstDate: sorted[0].dateObj,
    lastDate: sorted[sorted.length - 1].dateObj,
  };
}

// ─── Date formatting ───
function fmtShort(d: Date | null) {
  if (!d) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function fmtMonthYear(d: Date | null) {
  if (!d) return "Present";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ContributionStreaks({
  contributions,
  totalContributions,
}: Props) {
  const stats = useMemo(() => computeStreaks(contributions), [contributions]);
  const total = totalContributions ?? stats.total;

  const currentRange =
    stats.current > 0
      ? `${fmtShort(stats.currentStart)} – ${fmtShort(stats.currentEnd)}`
      : "No active streak";

  const longestRange =
    stats.longest > 0
      ? `${fmtShort(stats.longestStart)} – ${fmtShort(stats.longestEnd)}`
      : "No streak yet";

  const totalRange = `${fmtMonthYear(stats.firstDate)} – Present`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="w-full"
    >
      <Card className="overflow-hidden border-zinc-800/80 bg-zinc-900/50 backdrop-blur-md">
        <div className="grid grid-cols-1 divide-y divide-zinc-800/60 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {/* ── Total Contributions ── */}
          <Stat
            value={total}
            label="Total Contributions"
            sub={totalRange}
            delay={0.05}
          />

          {/* ── Current Streak (featured) ── */}
          <CurrentStreakStat
            value={stats.current}
            range={currentRange}
            delay={0.15}
          />

          {/* ── Longest Streak ── */}
          <Stat
            value={stats.longest}
            label="Longest Streak"
            sub={longestRange}
            delay={0.25}
          />
        </div>
      </Card>
    </motion.div>
  );
}

// ─── Simple stat cell ───
function Stat({
  value,
  label,
  sub,
  delay,
}: {
  value: number;
  label: string;
  sub: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center gap-1.5 px-6 py-6 sm:py-8"
    >
      <div className="text-3xl sm:text-4xl font-bold text-white tabular-nums leading-none">
        {value.toLocaleString()}
      </div>
      <div className="text-[13px] sm:text-sm font-medium text-zinc-400">
        {label}
      </div>
      <div className="text-[11px] sm:text-xs text-zinc-600 tabular-nums">
        {sub}
      </div>
    </motion.div>
  );
}

function CurrentStreakStat({
  value,
  range,
  delay,
}: {
  value: number;
  range: string;
  delay: number;
}) {
  const RING_SIZE = 92;
  const STROKE = 4;
  const RADIUS = (RING_SIZE - STROKE) / 2;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  const progress = Math.min(1, Math.max(0.15, value / 100));
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col items-center justify-center gap-2 px-6 py-6 sm:py-8"
    >
      {/* Ring + flame + number */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: RING_SIZE, height: RING_SIZE }}
      >
        {/* Flame badge */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 ring-1 ring-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.4)]">
          <Flame className="h-3.5 w-3.5 text-emerald-400" fill="currentColor" />
        </div>

        {/* SVG ring */}
        <svg
          width={RING_SIZE}
          height={RING_SIZE}
          viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
          className="-rotate-90"
        >
          {/* Track */}
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="rgb(39 39 42)" // zinc-800
            strokeWidth={STROKE}
          />
          {/* Progress */}
          <motion.circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="rgb(16 185 129)" // emerald-500
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{
              duration: 1.1,
              delay: delay + 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              filter: "drop-shadow(0 0 6px rgba(16,185,129,0.5))",
            }}
          />
        </svg>

        {/* Number inside ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
            {value}
          </span>
        </div>
      </div>

      {/* Label */}
      <div className="mt-1 text-[13px] sm:text-sm font-semibold text-emerald-400">
        Current Streak
      </div>

      {/* Date range */}
      <div className="text-[11px] sm:text-xs text-zinc-500 tabular-nums">
        {range}
      </div>
    </motion.div>
  );
}
