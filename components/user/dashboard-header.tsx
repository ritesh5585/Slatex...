"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  ExternalLink,
  Menu,
  X,
  LayoutDashboard,
  BookOpen,
  BarChart2,
} from "lucide-react";
import { DashboardSidebar } from "./dashboard-sidebar";

interface DashboardHeaderProps {
  username: string;
  userUrl?: string;
  activeTab?: string;
  recentlyViewed?: { label: string; href: string }[];
}

export function DashboardHeader({
  username,
  userUrl,
  activeTab = "overview",
  recentlyViewed = [],
}: DashboardHeaderProps) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState(username);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cleanUser = username.trim().replace(/^@/, "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchValue.trim().replace(/^@/, "");
    if (query) {
      router.push(`/profiles?username=${encodeURIComponent(query)}`);
    }
  };

  const mobileNavItems = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
      href: `/profiles?username=${encodeURIComponent(cleanUser)}`,
    },
    {
      id: "repos",
      label: "Repositories",
      icon: BookOpen,
      href: `/profiles/repos?username=${encodeURIComponent(cleanUser)}`,
    },
    {
      id: "commits",
      label: "Commits",
      icon: BarChart2,
      href: `/profiles/commits?username=${encodeURIComponent(cleanUser)}`,
    },
  ];

  return (
    <>
      <header className="shrink-0 h-14 flex items-center justify-between gap-3 px-3 sm:px-6 border-b border-zinc-800/60 bg-[#0d0e17] z-20">
        {/* Mobile Hamburger & Logo */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Search input form */}
        <form onSubmit={handleSearch} className="flex-1 max-w-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search user or repository..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full rounded-lg bg-zinc-900/80 border border-zinc-800/80 pl-8 pr-8 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/70 focus:ring-1 focus:ring-indigo-500/30 transition-all"
            />
            {searchValue && (
              <button
                type="submit"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-medium text-indigo-400 hover:text-indigo-300"
              >
                ↵
              </button>
            )}
          </div>
        </form>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {userUrl && (
            <a
              href={userUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-700/20 whitespace-nowrap"
            >
              <ExternalLink className="h-3 w-3" />
              <span className="hidden sm:inline">View on GitHub</span>
              <span className="sm:hidden">GitHub</span>
            </a>
          )}
        </div>
      </header>

      {/* Mobile Quick Navigation Tabs */}
      <div className="md:hidden flex items-center gap-1.5 px-3 py-2 border-b border-zinc-800/60 bg-[#0d0e17]/95 backdrop-blur-sm overflow-x-auto no-scrollbar z-10">
        {mobileNavItems.map(({ id, label, icon: Icon, href }) => {
          const isActive = activeTab === id;
          return (
            <Link
              key={id}
              href={href}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
                  : "text-zinc-400 bg-zinc-900/80 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800/60"
              }`}
            >
              <Icon className="h-3 w-3" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-64 max-w-[80vw] h-full bg-[#0d0e17] z-10 shadow-2xl flex flex-col">
            <DashboardSidebar
              username={cleanUser}
              activeTab={activeTab}
              recentlyViewed={recentlyViewed}
              onItemClick={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
