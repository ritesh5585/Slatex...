import { Card } from "@/components/ui/card";
import { Activity, ArrowUpRight } from "lucide-react";
import type { GitHubCommitActivityWeek } from "@/lib/github";

interface Props {
  activity: GitHubCommitActivityWeek[];
}

export function CommitActivity({ activity }: Props) {
  const weeks = activity.slice(-26);
  const total = weeks.reduce((sum, week) => sum + week.total, 0);
  const maxDay = Math.max(...weeks.flatMap((week) => week.days), 0);
  const average = weeks.length ? (total / weeks.length).toFixed(1) : "0.0";
  const latestWeek = weeks.at(-1)?.total ?? 0;
  const previousWeek = weeks.at(-2)?.total ?? 0;
  const trend = latestWeek - previousWeek;
  const startDate = weeks[0] ? new Date(weeks[0].week * 1000) : null;
  const endDate = weeks.at(-1) ? new Date(weeks.at(-1)!.week * 1000) : null;

  const intensity = (count: number) => {
    if (!count) return "bg-zinc-800/80";
    if (count <= Math.max(1, maxDay * 0.25)) return "bg-emerald-950";
    if (count <= Math.max(1, maxDay * 0.5)) return "bg-emerald-700";
    if (count <= Math.max(1, maxDay * 0.75)) return "bg-emerald-500";
    return "bg-emerald-300";
  };

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
            <p className="text-xs text-zinc-500">Last 6 months</p>
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

      <div className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <div className="rounded-lg bg-zinc-900/60 px-3 py-2 border border-zinc-800">
          <div className="text-[10px] uppercase tracking-wider text-zinc-500">
            Avg/week
          </div>
          <div className="text-sm font-semibold text-zinc-200 tabular-nums">
            {average}
          </div>
        </div>
        <div className="rounded-lg bg-zinc-900/60 px-3 py-2 border border-zinc-800">
          <div className="text-[10px] uppercase tracking-wider text-zinc-500">
            Peak
          </div>
          <div className="text-sm font-semibold text-blue-400 tabular-nums">
            {maxDay}
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
            <ArrowUpRight
              className={`h-3 w-3 ${trend < 0 ? "rotate-90" : ""}`}
            />
            {trend > 0 ? `+${trend}` : trend} / week
          </div>
        </div>
      </div>

      {weeks.length ? (
        <div className="overflow-x-auto pb-2">
          <div className="min-w-155">
            <div className="mb-2 ml-8 flex justify-between text-[10px] text-zinc-500">
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
            <div className="flex gap-2 ">
              <div className="grid grid-rows-7 gap-1 text-[10px] text-zinc-600">
                <span>Mon</span>
                <span />
                <span>Wed</span>
                <span />
                <span>Fri</span>
                <span />
                <span />
              </div>
              <div className=" grid auto-cols-3 grid-flow-col grid-rows-7 gap-1">
                {weeks.flatMap((week) =>
                  week.days.map((count, day) => (
                    <span
                      key={`${week.week}-${day}`}
                      title={`${count} commit${count === 1 ? "" : "s"} on ${new Date(week.week * 1000 + day * 86400000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`}
                      className={`h-3 w-3 rounded-[3px] ring-1 ring-inset ring-white/5 ${intensity(count)}`}
                    />
                  )),
                )}
              </div>
            </div>
            <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-zinc-500">
              Less <span className="h-3 w-3 rounded-[3px] bg-zinc-800/80" />
              <span className="h-3 w-3 rounded-[3px] bg-emerald-950" />
              <span className="h-3 w-3 rounded-[3px] bg-emerald-700" />
              <span className="h-3 w-3 rounded-[3px] bg-emerald-500" />
              <span className="h-3 w-3 rounded-[3px] bg-emerald-300" /> More
            </div>
          </div>
        </div>
      ) : (
        <div className="flex min-h-32 items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-950/40 px-6 text-center text-sm text-zinc-500">
          GitHub is still preparing contribution statistics for this repository.
        </div>
      )}

      {/* ── Footer ── */}
      <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
        <span>
          {startDate?.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          }) ?? "No activity"}{" "}
          →{" "}
          {endDate?.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          }) ?? ""}
        </span>
        <span>
          Peak day:{" "}
          <span className="font-semibold text-emerald-400">{maxDay}</span>
        </span>
      </div>
    </Card>
  );
}
