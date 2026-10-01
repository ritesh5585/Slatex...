import { Skeleton } from "@/components/ui/skeleton";

export default function CommitsLoading() {
  return (
    <div className="h-screen bg-[#08090f] text-zinc-100 flex overflow-hidden">
      {/* Sidebar skeleton */}
      <div className="hidden md:flex w-52 shrink-0 border-r border-zinc-800/60 p-4 flex-col gap-4 bg-[#0d0e17]">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-8 w-8 rounded-lg bg-zinc-800" />
          <Skeleton className="h-4 w-24 bg-zinc-800" />
        </div>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-9 w-full rounded-lg bg-zinc-800/60" />
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-14 border-b border-zinc-800/60 bg-[#0d0e17] px-6 flex items-center justify-between">
          <Skeleton className="h-8 w-64 rounded-lg bg-zinc-800/60" />
          <Skeleton className="h-8 w-28 rounded-lg bg-zinc-800/60" />
        </div>

        <div className="flex-1 p-6 space-y-6 max-w-6xl mx-auto w-full overflow-y-auto">
          <Skeleton className="h-24 w-full rounded-2xl bg-zinc-900/60" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 rounded-xl bg-zinc-900/60" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-40 rounded-2xl bg-zinc-900/60" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
