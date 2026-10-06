"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Activity,
  GitCommit,
  Users,
  Tag,
  BookOpen,
  ExternalLink,
  Calendar,
  Scale,
  GitBranch,
  Share2,
} from "lucide-react";

interface RepoSidebarProps {
  owner: string;
  repoName: string;
  repoUrl: string;
  homepage?: string | null;
  description?: string | null;
  license?: string | null;
  createdAt?: string | null;
  pushedAt?: string | null;
  defaultBranch?: string | null;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "commits", label: "Commits", icon: GitCommit },
  { id: "people", label: "Contributors", icon: Users },
  { id: "releases", label: "Releases", icon: Tag },
  { id: "readme", label: "README", icon: BookOpen },
];

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function RepoSidebar({
  owner,
  repoName,
  repoUrl,
  homepage,
  description,
  license,
  createdAt,
  pushedAt,
  defaultBranch,
  activeSection = "overview",
  onSectionChange,
}: RepoSidebarProps) {
  return (
    <aside className="flex flex-col h-full w-full bg-[#0d0e17] border-r border-zinc-800/60 py-5 px-2 select-none overflow-y-auto">
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-2.5 px-3 mb-7 group cursor-pointer transition-opacity hover:opacity-90"
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

      {/* Nav */}
      <nav className="flex flex-col gap-1">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = activeSection === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSectionChange?.(id)}
              className={`group w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 cursor-pointer text-left ${isActive
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
            </button>
          );
        })}
      </nav>

      {/* About */}
      <div className="mt-7 px-2">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
          About
        </p>
        {description && (
          <p className="text-xs text-zinc-400 leading-relaxed mb-3">
            {description}
          </p>
        )}
        {homepage && (
          <a
            href={homepage}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 mb-1.5 truncate"
          >
            <ExternalLink className="h-3 w-3 shrink-0" />
            <span className="truncate">{homepage.replace(/^https?:\/\//, "")}</span>
          </a>
        )}
        <a
          href={repoUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 mb-4 truncate"
        >
          <ExternalLink className="h-3 w-3 shrink-0" />
          <span className="truncate">github.com/{owner}/{repoName}</span>
        </a>

        <div className="space-y-2.5 text-xs">
          {license && (
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-zinc-500">
                <Scale className="h-3 w-3" /> License
              </span>
              <span className="text-zinc-300 font-medium">{license}</span>
            </div>
          )}
          {createdAt && (
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-zinc-500">
                <Calendar className="h-3 w-3" /> Created
              </span>
              <span className="text-zinc-300 font-medium">{formatDate(createdAt)}</span>
            </div>
          )}
          {pushedAt && (
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-zinc-500">
                <Activity className="h-3 w-3" /> Last pushed
              </span>
              <span className="text-zinc-300 font-medium">{formatDate(pushedAt)}</span>
            </div>
          )}
          {defaultBranch && (
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-zinc-500">
                <GitBranch className="h-3 w-3" /> Default branch
              </span>
              <span className="text-zinc-300 font-medium font-mono text-[10px]">{defaultBranch}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom share */}
      <div className="mt-auto pt-6 px-1 flex flex-col gap-2">
        <a
          href={repoUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 border border-transparent hover:border-zinc-800 transition-all"
        >
          <Share2 className="h-3.5 w-3.5 text-zinc-500" />
          <span>View on GitHub</span>
        </a>
      </div>
    </aside>
  );
}
