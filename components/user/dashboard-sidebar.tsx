"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  BookOpen,
  BarChart2,
  GitCompare,
  Search,
} from "lucide-react";

interface SidebarProps {
  username?: string;
  activeTab?: string;
  recentlyViewed?: { label: string; href: string }[];
  onItemClick?: () => void;
}

export function DashboardSidebar({
  username = "",
  activeTab = "overview",
  recentlyViewed = [],
  onItemClick,
}: SidebarProps) {
  const cleanUser = username ? username.trim().replace(/^@/, "") : "";

  const navItems = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
      href: cleanUser
        ? `/profiles?username=${encodeURIComponent(cleanUser)}`
        : "/profiles",
    },
    {
      id: "repos",
      label: "Repositories",
      icon: BookOpen,
      href: cleanUser
        ? `/profiles/repos?username=${encodeURIComponent(cleanUser)}`
        : "/profiles",
    },
    {
      id: "commits",
      label: "Commits",
      icon: BarChart2,
      href: cleanUser
        ? `/profiles/commits?username=${encodeURIComponent(cleanUser)}`
        : "/profiles",
    },
    {
      id: "compare",
      label: "Compare",
      icon: GitCompare,
      badge: "Beta",
      href: cleanUser
        ? `/compare?user1=${encodeURIComponent(cleanUser)}`
        : "/compare",
    },
  ];

  return (
    <aside className="flex flex-col h-full w-full bg-[#0d0e17] border-r border-zinc-800/60 py-5 px-2 select-none">
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-2.5 px-3 mb-7 group cursor-pointer transition-opacity hover:opacity-90"
        onClick={onItemClick}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-500/30 font-bold text-white text-sm shrink-0 group-hover:scale-105 transition-transform">
          S
        </div>
        <div className="flex flex-col">
          <span className="text-[15px] font-bold text-white tracking-tight leading-none">
            Slatex...
          </span>
        </div>
      </Link>

      {/* Nav Items */}
      <nav className="flex flex-col gap-1">
        {navItems.map(({ id, label, icon: Icon, badge, href }) => {
          const isActive = activeTab === id;
          return (
            <Link
              key={id}
              href={href}
              onClick={onItemClick}
              className={`group w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 cursor-pointer ${isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-700/25 ring-1 ring-indigo-400/30"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60"
                }`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 transition-colors ${isActive
                    ? "text-white"
                    : "text-zinc-500 group-hover:text-zinc-300"
                  }`}
              />
              <span className="flex-1 text-left truncate">{label}</span>
              {badge && (
                <span
                  className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none ${isActive
                      ? "bg-white/20 text-white"
                      : "bg-indigo-500/20 border border-indigo-500/30 text-indigo-400"
                    }`}
                >
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Recently viewed */}
      {recentlyViewed.length > 0 && (
        <div className="mt-7">
          <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            Recently viewed
          </p>
          <div className="flex flex-col gap-0.5">
            {recentlyViewed.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                onClick={onItemClick}
                className="px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-800/50 transition-all duration-150 truncate flex items-center gap-1.5 group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 group-hover:bg-indigo-400 transition-colors shrink-0" />
                <span className="truncate">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="mt-auto pt-6 px-1 flex flex-col gap-2">
        <Link
          href="/"
          onClick={onItemClick}
          className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 border border-transparent hover:border-zinc-800 transition-all"
        >
          <Search className="h-3.5 w-3.5 text-zinc-500" />
          <span>New Search</span>
        </Link>
      </div>
    </aside>
  );
}
