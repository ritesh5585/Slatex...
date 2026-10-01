"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ExternalLink, Menu, X, LayoutDashboard, Activity, GitCommit, Users, Tag, BookOpen } from "lucide-react";
import { RepoSidebar } from "./repo-sidebar";

interface RepoPageHeaderProps {
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

const mobileNavItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "commits", label: "Commits", icon: GitCommit },
  { id: "people", label: "Contributors", icon: Users },
  { id: "releases", label: "Releases", icon: Tag },
  { id: "readme", label: "README", icon: BookOpen },
];

export function RepoPageHeader({
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
}: RepoPageHeaderProps) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchValue.trim();
    if (!query) return;
    if (query.includes("/")) {
      const [o, r] = query.split("/");
      if (o && r) {
        router.push(`/repo?owner=${encodeURIComponent(o)}&repo=${encodeURIComponent(r)}`);
        return;
      }
    }
    router.push(`/profiles?username=${encodeURIComponent(query)}`);
  };

  return (
    <>
      <header className="shrink-0 h-14 flex items-center justify-between gap-3 px-3 sm:px-6 border-b border-zinc-800/60 bg-[#0d0e17] z-20">
        {/* Mobile hamburger */}
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

        {/* Breadcrumb */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-zinc-500 font-mono flex-1">
          <span>Search</span>
          <span>/</span>
          <a
            href={`/profiles?username=${encodeURIComponent(owner)}`}
            className="hover:text-zinc-300 transition-colors"
          >
            {owner}
          </a>
          <span>/</span>
          <span className="text-zinc-200 font-semibold">{repoName}</span>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search a username or repository..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full rounded-lg bg-zinc-900/80 border border-zinc-800/80 pl-8 pr-8 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/70 focus:ring-1 focus:ring-indigo-500/30 transition-all"
            />
          </div>
        </form>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <a
            href={repoUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-700/20 whitespace-nowrap"
          >
            <ExternalLink className="h-3 w-3" />
            <span className="hidden sm:inline">View on GitHub</span>
            <span className="sm:hidden">GitHub</span>
          </a>
        </div>
      </header>

      {/* Mobile nav tabs */}
      <div className="md:hidden flex items-center gap-1.5 px-3 py-2 border-b border-zinc-800/60 bg-[#0d0e17]/95 backdrop-blur-sm overflow-x-auto scrollbar-none z-10">
        {mobileNavItems.map(({ id, label, icon: Icon }) => {
          const isActive = activeSection === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSectionChange?.(id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
                  : "text-zinc-400 bg-zinc-900/80 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800/60"
              }`}
            >
              <Icon className="h-3 w-3" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-64 max-w-[80vw] h-full bg-[#0d0e17] z-10 shadow-2xl flex flex-col">
            <RepoSidebar
              owner={owner}
              repoName={repoName}
              repoUrl={repoUrl}
              homepage={homepage}
              description={description}
              license={license}
              createdAt={createdAt}
              pushedAt={pushedAt}
              defaultBranch={defaultBranch}
              activeSection={activeSection}
              onSectionChange={(s) => { onSectionChange?.(s); setMobileMenuOpen(false); }}
            />
          </div>
        </div>
      )}
    </>
  );
}
