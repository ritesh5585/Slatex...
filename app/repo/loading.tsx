import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="h-screen bg-[#08090f] text-zinc-100 antialiased flex overflow-hidden">
      {/* Sidebar skeleton */}
      <aside className="hidden md:flex h-full w-52 shrink-0 flex-col border-r border-zinc-800/60 bg-[#0d0e17] p-4">
        <div className="mb-7 flex items-center gap-2.5 px-2">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-4 w-20 rounded-md" />
        </div>
        <div className="space-y-2">
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <Skeleton key={item} className="h-9 w-full rounded-lg" />
          ))}
        </div>
        <div className="mt-auto space-y-3 px-2">
          <Skeleton className="h-3 w-12 rounded-md" />
          <Skeleton className="h-3 w-full rounded-md" />
          <Skeleton className="h-3 w-3/4 rounded-md" />
          <Skeleton className="h-3 w-2/3 rounded-md" />
        </div>
      </aside>

      {/* Main */}
      <section className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-[#08090f]">
        <div className="hero-glow" />
        <div className="hero-grid pointer-events-none absolute inset-0 opacity-[0.06]" />

        {/* Header skeleton */}
        <div className="shrink-0 h-14 flex items-center justify-between gap-3 px-3 sm:px-6 border-b border-zinc-800/60 bg-[#0d0e17]">
          <Skeleton className="h-5 w-48 rounded-md" />
          <Skeleton className="h-8 w-32 rounded-lg" />
        </div>

        {/* Content skeleton */}
        <div className="relative z-10 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-5xl space-y-5 px-4 py-6 sm:px-6">
            {/* Repo header card */}
            <section className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-5 backdrop-blur-md">
              <div className="flex items-start gap-4">
                <Skeleton className="h-14 w-14 shrink-0 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-16 rounded-md" />
                    <Skeleton className="h-6 w-36 rounded-md" />
                    <Skeleton className="h-5 w-14 rounded-full" />
                  </div>
                  <Skeleton className="h-3 w-full max-w-lg rounded-md" />
                  <div className="flex gap-1.5">
                    {[0, 1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-5 w-16 rounded-full" />
                    ))}
                  </div>
                </div>
                <div className="hidden sm:flex flex-col gap-2">
                  <Skeleton className="h-8 w-20 rounded-lg" />
                  <Skeleton className="h-8 w-20 rounded-lg" />
                </div>
              </div>
            </section>

            {/* Stats row */}
            <section className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-md overflow-hidden">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-zinc-800/60">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className={`p-5 space-y-2 ${i === 4 ? "col-span-2 sm:col-span-1" : ""}`}>
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-7 w-16 rounded-md" />
                    <Skeleton className="h-3 w-20 rounded-md" />
                  </div>
                ))}
              </div>
            </section>

            {/* Activity chart */}
            <section className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-5 backdrop-blur-md">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-xl" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-36 rounded-md" />
                    <Skeleton className="h-3 w-24 rounded-md" />
                  </div>
                </div>
                <Skeleton className="h-8 w-36 rounded-lg" />
              </div>
              <Skeleton className="h-52 w-full rounded-xl" />
            </section>

            {/* Commits + People */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
              <section className="lg:col-span-3 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-5 backdrop-blur-md space-y-3">
                <Skeleton className="h-4 w-32 rounded-md" />
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3 w-24 rounded-md" />
                      <Skeleton className="h-1.5 w-full rounded-full" />
                    </div>
                  </div>
                ))}
              </section>
              <section className="lg:col-span-2 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-5 backdrop-blur-md space-y-3">
                <Skeleton className="h-4 w-28 rounded-md" />
                <Skeleton className="h-2 w-full rounded-full" />
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-2.5 w-2.5 rounded-full shrink-0" />
                    <Skeleton className="h-3 flex-1 rounded-md" />
                    <Skeleton className="h-1.5 w-20 rounded-full" />
                    <Skeleton className="h-3 w-9 rounded-md" />
                  </div>
                ))}
              </section>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
