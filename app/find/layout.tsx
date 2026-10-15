import type { Metadata } from "next";
import { DashboardSidebar } from "@/components/user/dashboard-sidebar";
import { DashboardHeader } from "@/components/user/dashboard-header";

export const metadata: Metadata = {
  title: "Find projects — Slatex",
  description:
    "Enter a GitHub username and get personalized open source project recommendations.",
};

export default function FindLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      className="h-screen antialiased flex overflow-hidden"
      style={{ background: "var(--bg)", color: "var(--text-primary)" }}
    >
      {/* ── Left Sidebar ─────────────────────────────────────────────────── */}
      <div className="hidden md:flex w-52 shrink-0 flex-col h-full">
        <DashboardSidebar activeTab="find" />
      </div>

      {/* ── Main Content Area ─────────────────────────────────────────────── */}
      <div className="relative flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader activeTab="find" />

        {/* Scrollable */}
        <div className="relative flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 py-6 max-w-5xl mx-auto">{children}</div>
        </div>
      </div>
    </main>
  );
}
