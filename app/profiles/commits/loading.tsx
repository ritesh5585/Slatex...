import { DashboardHeader } from "@/components/user/dashboard-header";
import { DashboardSidebar } from "@/components/user/dashboard-sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export default function CommitsLoading() {
  return (
    <main className="h-screen bg-[#08090f] text-zinc-100 antialiased flex overflow-hidden">
      <div className="hidden md:flex w-52 shrink-0 flex-col h-full">
        <DashboardSidebar activeTab="commits" />
      </div>

      <div className="relative flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="hero-glow" />
        <div className="hero-grid absolute inset-0 opacity-[0.06] pointer-events-none" />
        <DashboardHeader activeTab="commits" />

        <div className="relative z-10 flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 py-6 space-y-6 max-w-6xl mx-auto">
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
    </main>
  );
}
