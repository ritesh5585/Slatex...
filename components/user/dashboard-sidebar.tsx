"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  BarChart2,
  GitCompare,
  Search,
  X,
  ArrowRight,
  Sparkles,
  User,
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
  const router = useRouter();
  const cleanUser = username ? username.trim().replace(/^@/, "") : "";
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [secondUser, setSecondUser] = useState("");
  const [inputError, setInputError] = useState("");

  const handleCompareClick = (e: React.MouseEvent) => {
    if (cleanUser) {
      e.preventDefault();
      setShowPromptModal(true);
    } else {
      onItemClick?.();
    }
  };

  const handleStartComparison = (e?: React.FormEvent) => {
    e?.preventDefault();
    const clean2 = secondUser.trim().replace(/^@/, "");
    if (!clean2) {
      setInputError("Please enter a second GitHub username");
      return;
    }
    if (clean2.toLowerCase() === cleanUser.toLowerCase()) {
      setInputError("Please enter a different developer to compare with");
      return;
    }
    setShowPromptModal(false);
    onItemClick?.();
    router.push(
      `/compare?user1=${encodeURIComponent(cleanUser)}&user2=${encodeURIComponent(clean2)}`,
    );
  };

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
      isCompare: true,
    },
  ];

  return (
    <>
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
          {navItems.map(({ id, label, icon: Icon, badge, href, isCompare }) => {
            const isActive = activeTab === id;
            return (
              <Link
                key={id}
                href={href}
                onClick={(e) => {
                  if (isCompare && cleanUser) {
                    handleCompareClick(e);
                  } else {
                    onItemClick?.();
                  }
                }}
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

      {/* Compare Second User Prompt Modal */}
      {showPromptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-[#0d0f17] p-6 shadow-2xl text-left ring-1 ring-white/10">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                setShowPromptModal(false);
                setInputError("");
              }}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <GitCompare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Compare developer
                </h3>
                <p className="text-xs text-zinc-400">
                  Select a second developer to compare against @{cleanUser}
                </p>
              </div>
            </div>

            {/* Current Developer Chip */}
            <div className="p-3 rounded-xl bg-[#121522] border border-zinc-800 flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-xs font-bold">
                  {cleanUser[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <div className="text-xs text-zinc-500 font-medium">Developer 1</div>
                  <div className="text-sm font-semibold text-white">@{cleanUser}</div>
                </div>
              </div>
              <span className="text-[11px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                Selected
              </span>
            </div>

            {/* Second Developer Form */}
            <form onSubmit={handleStartComparison} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Developer 2 (Username)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    autoFocus
                    value={secondUser}
                    onChange={(e) => {
                      setSecondUser(e.target.value);
                      setInputError("");
                    }}
                    placeholder="e.g. Gautam"
                    className="w-full rounded-xl border border-zinc-800 bg-[#121522] px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/50 transition-colors"
                  />
                </div>
                {inputError && (
                  <p className="mt-1.5 text-xs text-rose-400">{inputError}</p>
                )}
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-zinc-500">
                <span className="text-zinc-500">Quick picks:</span>
                {["callmegautam", "gourijadhav08"].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setSecondUser(p);
                      setInputError("");
                    }}
                    className="px-2 py-0.5 rounded-md bg-zinc-800/70 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer text-xs"
                  >
                    {p}
                  </button>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPromptModal(false);
                    setInputError("");
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Compare Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
