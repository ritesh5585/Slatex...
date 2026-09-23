import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 antialiased pb-20 selection:bg-blue-500/30 selection:text-blue-200">
      {/* ── 1. Hero Cover Skeleton ── */}
      <div className="relative w-full overflow-hidden">
        {/* Banner Skeleton */}
        <div className="h-[220px] sm:h-[260px] md:h-[280px] w-full bg-zinc-900/60 animate-pulse border-b border-zinc-800/40" />

        {/* Profile Details Container */}
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-16 sm:-mt-20 md:-mt-24 pb-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              {/* Left Column: Avatar + Profile Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 sm:gap-6">
                {/* Avatar Skeleton */}
                <Skeleton className="h-24 w-24 sm:h-28 sm:w-28 md:h-[120px] md:w-[120px] rounded-full ring-4 ring-zinc-950 shrink-0" />

                {/* Name, Username & Bio Skeletons */}
                <div className="flex flex-col space-y-3 w-full sm:w-80">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-48 rounded-lg" />
                    <Skeleton className="h-6 w-24 rounded-lg" />
                  </div>
                  <Skeleton className="h-4 w-full rounded-md" />
                  <Skeleton className="h-4 w-3/4 rounded-md" />
                </div>
              </div>

              {/* Right Column: Button Skeleton */}
              <div className="shrink-0 self-start md:self-end">
                <Skeleton className="h-9 w-36 rounded-xl" />
              </div>
            </div>

            {/* Badges Row Skeleton */}
            <div className="mt-5 flex flex-wrap items-center gap-2 sm:gap-3">
              <Skeleton className="h-6 w-28 rounded-full" />
              <Skeleton className="h-6 w-32 rounded-full" />
              <Skeleton className="h-6 w-36 rounded-full" />
              <Skeleton className="h-6 w-28 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Content Container Skeleton ── */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <Skeleton className="h-3 w-16 rounded-md" />
              </div>
              <div className="space-y-1.5">
                <Skeleton className="h-8 w-24 rounded-lg" />
                <Skeleton className="h-4 w-32 rounded-md" />
              </div>
            </div>
          ))}
        </div>

        {/* Top Languages Constellation Skeleton */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-xl" />
              <div className="space-y-1">
                <Skeleton className="h-5 w-36 rounded-md" />
                <Skeleton className="h-3.5 w-56 rounded-md" />
              </div>
            </div>
            <Skeleton className="h-6 w-28 rounded-full" />
          </div>

          {/* Bar Skeleton */}
          <Skeleton className="h-3.5 w-full rounded-full" />

          {/* Legend Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        </div>

        {/* Recent Repos Grid Skeleton */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-xl" />
              <Skeleton className="h-6 w-44 rounded-lg" />
            </div>
            <Skeleton className="h-4 w-28 rounded-md" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex flex-col justify-between h-48 rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-5 space-y-4"
              >
                <div className="space-y-2.5">
                  <Skeleton className="h-5 w-3/4 rounded-md" />
                  <Skeleton className="h-3.5 w-full rounded-md" />
                  <Skeleton className="h-3.5 w-2/3 rounded-md" />
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-zinc-800/60">
                  <Skeleton className="h-4 w-20 rounded-md" />
                  <Skeleton className="h-4 w-24 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
