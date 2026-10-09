import { DashboardHeader } from "@/components/user/dashboard-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="h-screen overflow-hidden bg-[#08090f] text-zinc-100 antialiased flex">
      <aside className="hidden md:flex h-full w-52 shrink-0 flex-col border-r border-zinc-800/60 bg-[#0d0e17] p-4">
        <div className="mb-7 flex items-center gap-2.5 px-2">
          {/* <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-4 w-20 rounded-md" /> */}
        </div>
        <div className="space-y-2">
          {[0, 1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-9 w-full rounded-lg" />
          ))}
        </div>
        <Skeleton className="mt-auto h-8 w-full rounded-lg" />
      </aside>

      <section className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-[#08090f]">
        <div className="hero-glow" />
        <div className="hero-grid pointer-events-none absolute inset-0 opacity-[0.06]" />
        <DashboardHeader username="" activeTab="overview" />

        <div className="relative z-10 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl space-y-5 px-4 py-6 sm:px-6">
            <section className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-5 backdrop-blur-md">
              <div className="flex items-start gap-4">
                <Skeleton className="h-16 w-16 shrink-0 rounded-full" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Skeleton className="h-6 w-40 max-w-full rounded-md" />
                    <Skeleton className="h-4 w-24 rounded-md" />
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Skeleton className="h-3 w-24 rounded-md" />
                    <Skeleton className="h-3 w-28 rounded-md" />
                    <Skeleton className="h-3 w-36 rounded-md" />
                  </div>
                  <Skeleton className="h-3 w-full max-w-xl rounded-md" />
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-4 border-t border-zinc-800/60 pt-4 sm:grid-cols-4">
                {[0, 1, 2, 3].map((item) => (
                  <div key={item} className="flex flex-col items-center gap-2">
                    <Skeleton className="h-7 w-16 rounded-md" />
                    <Skeleton className="h-3 w-20 max-w-full rounded-md" />
                  </div>
                ))}
              </div>
            </section>

            <section className="grid grid-cols-1 divide-y divide-zinc-800/60 overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-md sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {[0, 1, 2].map((item) => (
                <div key={item} className="space-y-3 p-5">
                  <Skeleton className="h-3 w-28 rounded-md" />
                  <Skeleton className="h-8 w-20 rounded-md" />
                  <Skeleton className="h-3 w-32 max-w-full rounded-md" />
                </div>
              ))}
            </section>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              <section className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-5 backdrop-blur-md lg:col-span-2">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <Skeleton className="h-4 w-28 rounded-md" />
                  <Skeleton className="h-6 w-28 rounded-full" />
                </div>
                <div className="grid auto-cols-2.25 grid-flow-col grid-rows-7 gap-1 overflow-hidden">
                  {Array.from({ length: 91 }, (_, item) => (
                    <Skeleton key={item} className="h-2.25 w-2.25 rounded-sm" />
                  ))}
                </div>
                <div className="mt-4 flex justify-end gap-1.5">
                  {[0, 1, 2, 3, 4].map((item) => (
                    <Skeleton key={item} className="h-2.5 w-2.5 rounded-sm" />
                  ))}
                </div>
              </section>

              <section className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-5 backdrop-blur-md">
                <Skeleton className="mb-5 h-4 w-28 rounded-md" />
                <div className="space-y-4">
                  {[0, 1, 2, 3, 4].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <Skeleton className="h-2 w-2 shrink-0 rounded-full" />
                      <Skeleton className="h-3 w-20 rounded-md" />
                      <Skeleton className="ml-auto h-2 w-20 rounded-full" />
                      <Skeleton className="h-3 w-8 rounded-md" />
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {[0, 1].map((panel) => (
                <section key={panel} className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-5 backdrop-blur-md">
                  <div className="mb-5 flex items-center justify-between">
                    <Skeleton className="h-4 w-32 rounded-md" />
                    <Skeleton className="h-5 w-24 rounded-full" />
                  </div>
                  <div className="flex h-32 items-end gap-2">
                    {[40, 68, 50, 86, 58, 74, 44, 92, 62, 78, 48, 66].map((height, item) => (
                      <Skeleton key={item} className="flex-1 rounded-t-sm rounded-b-none" style={{ height: `${height}%` }} />
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <section className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-5 backdrop-blur-md">
              <div className="mb-5 flex items-center justify-between">
                <Skeleton className="h-4 w-28 rounded-md" />
                <Skeleton className="h-4 w-16 rounded-md" />
              </div>
              <div className="divide-y divide-zinc-800/50">
                {[0, 1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <Skeleton className="h-2 w-2 shrink-0 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3 w-40 max-w-full rounded-md" />
                      <Skeleton className="h-3 w-28 rounded-md" />
                    </div>
                    <Skeleton className="h-3 w-12 rounded-md" />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}