"use client";

import { useState, useMemo } from "react";
import { Search, Filter, ArrowUpDown, X, BookOpen, Star, GitFork } from "lucide-react";
import { RepoCard, type GitHubRepo } from "@/components/user/repo-card";
import { getLanguageColor } from "@/lib/language-colors";

interface RepoListViewProps {
  repos: GitHubRepo[];
  username: string;
  totalCount?: number;
}

type SortOption = "updated" | "stars" | "forks" | "name";

export function RepoListView({
  repos,
  username,
  totalCount = repos.length,
}: RepoListViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("updated");

  // Extract unique languages with counts
  const languages = useMemo(() => {
    const map = new Map<string, number>();
    repos.forEach((repo) => {
      if (repo.language) {
        map.set(repo.language, (map.get(repo.language) || 0) + 1);
      }
    });
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  }, [repos]);

  // Filter and sort repos
  const filteredRepos = useMemo(() => {
    let result = repos.filter((repo) => {
      const matchesSearch =
        searchQuery === "" ||
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (repo.description &&
          repo.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (repo.topics &&
          repo.topics.some((t) =>
            t.toLowerCase().includes(searchQuery.toLowerCase()),
          ));

      const matchesLang =
        selectedLanguage === "all" ||
        repo.language?.toLowerCase() === selectedLanguage.toLowerCase();

      return matchesSearch && matchesLang;
    });

    result.sort((a, b) => {
      if (sortBy === "stars") {
        return b.stargazers_count - a.stargazers_count;
      }
      if (sortBy === "forks") {
        return b.forks_count - a.forks_count;
      }
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      // "updated" default
      return (
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    });

    return result;
  }, [repos, searchQuery, selectedLanguage, sortBy]);

  const hasActiveFilters = searchQuery !== "" || selectedLanguage !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedLanguage("all");
    setSortBy("updated");
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Controls */}
      <div className="flex flex-col gap-3 rounded-2xl bg-zinc-900/50 border border-zinc-800/70 p-4 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Find a repository by name, topic, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl bg-zinc-950/70 border border-zinc-800 pl-10 pr-9 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500/70 focus:ring-1 focus:ring-indigo-500/30 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <ArrowUpDown className="h-4 w-4 text-zinc-500 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-xl bg-zinc-950/70 border border-zinc-800 px-3 py-2 text-xs font-medium text-zinc-300 focus:outline-none focus:border-indigo-500/70 transition-all cursor-pointer"
            >
              <option value="updated">Recently Updated</option>
              <option value="stars">Most Stars</option>
              <option value="forks">Most Forks</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Language Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 no-scrollbar">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mr-1 shrink-0 flex items-center gap-1">
            <Filter className="h-3 w-3" /> Lang:
          </span>

          <button
            type="button"
            onClick={() => setSelectedLanguage("all")}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${selectedLanguage === "all"
                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 font-semibold"
                : "bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-700/40"
              }`}
          >
            All ({repos.length})
          </button>

          {languages.map(({ name, count }) => {
            const isSelected =
              selectedLanguage.toLowerCase() === name.toLowerCase();
            const color = getLanguageColor(name);
            return (
              <button
                key={name}
                type="button"
                onClick={() => setSelectedLanguage(isSelected ? "all" : name)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${isSelected
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 font-semibold ring-1 ring-indigo-400/40"
                    : "bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-700/40"
                  }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span>{name}</span>
                <span className="text-[10px] opacity-70">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Stats & Reset */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs text-zinc-400 font-medium">
          Showing <span className="text-white font-semibold">{filteredRepos.length}</span>{" "}
          of <span className="text-white font-semibold">{totalCount}</span> repositories
          {selectedLanguage !== "all" && (
            <span> in <span className="text-indigo-400 font-medium">{selectedLanguage}</span></span>
          )}
        </p>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer transition-colors"
          >
            <X className="h-3 w-3" /> Clear filters
          </button>
        )}
      </div>

      {/* Repos Cards Grid */}
      {filteredRepos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRepos.map((repo, index) => (
            <RepoCard key={repo.id} repo={repo} index={index} />
          ))}
        </div>
      ) : (
        /* Empty Filter State */
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-zinc-800/70 bg-zinc-900/30">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-800/70 border border-zinc-700/50 text-zinc-400 mb-3">
            <BookOpen className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-white mb-1">
            No repositories found
          </h3>
          <p className="text-xs text-zinc-400 max-w-sm mb-4">
            No repositories match your current search query or language filter.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="px-4 py-2 rounded-xl text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            Reset all filters
          </button>
        </div>
      )}
    </div>
  );
}
