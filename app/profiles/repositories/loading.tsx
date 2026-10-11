import { DashboardHeader } from "@/components/user/dashboard-header";
import { DashboardSidebar } from "@/components/user/dashboard-sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReposLoading() {
  return (
    <main className="h-screen bg-[#08090f] text-zinc-100 antialiased flex overflow-hidden">
      <div className="hidden md:flex w-52 shrink-0 flex-col h-full">
        <DashboardSidebar activeTab="repos" />
      </div>

      <div className="relative flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="hero-glow" />
        <div className="hero-grid absolute inset-0 opacity-[0.06] pointer-events-none" />
        <DashboardHeader activeTab="repos" />

        <div className="relative z-10 flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 py-6 space-y-6 max-w-6xl mx-auto">
            <Skeleton className="h-24 w-full rounded-2xl bg-zinc-900/60" />
            <Skeleton className="h-16 w-full rounded-2xl bg-zinc-900/60" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-48 rounded-2xl bg-zinc-900/60" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
