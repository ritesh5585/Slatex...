"use client";

import React, { useState } from "react";
import { X, GitFork, Star, ArrowRight, Sparkles, Loader2, CheckCircle2, User } from "lucide-react";
import Link from "next/link";

interface OpenSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OpenSourceModal({ isOpen, onClose }: OpenSourceModalProps) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any | null>(null);

  if (!isOpen) return null;

  const defaultRepos = [
    {
      owner: "facebook",
      name: "react",
      description: "The library for web and native user interfaces.",
      stars: "230k",
      language: "JavaScript",
      tag: "Top Rated",
    },
    {
      owner: "shadcn-ui",
      name: "ui",
      description: "Beautifully designed components that you can copy and paste into your apps.",
      stars: "75k",
      language: "TypeScript",
      tag: "Beginner Friendly",
    },
    {
      owner: "vercel",
      name: "next.js",
      description: "The React Framework for the Web.",
      stars: "128k",
      language: "JavaScript",
      tag: "Popular",
    },
    {
      owner: "tailwindlabs",
      name: "tailwindcss",
      description: "A utility-first CSS framework for rapid UI development.",
      stars: "85k",
      language: "TypeScript",
      tag: "Good First Issues",
    },
  ];

  const handleMatchProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = username.trim().replace(/^@/, "");
    if (!clean) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/github/user/${encodeURIComponent(clean)}`); 
      if (res.ok) {
        const data = await res.json();
        setUserProfile(data);
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-2xl border border-zinc-800 bg-[#0d0f17] p-6 sm:p-8 shadow-2xl text-left max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <GitFork className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Find Open Source
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-medium">
                Live Explorer
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400">
              Discover beginner-friendly projects tailored to your skills and profile.
            </p>
          </div>
        </div>

        {/* Match per profile input */}
        <div className="my-5 p-4 rounded-xl border border-indigo-500/30 bg-[#121626]">
          <form onSubmit={handleMatchProfile} className="space-y-2">
            <label className="text-xs font-semibold text-indigo-300 uppercase tracking-wider block flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Match repos to your GitHub profile
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username (e.g. shadcn)"
                className="w-full rounded-xl border border-zinc-700 bg-[#0e111c] px-3.5 py-2 text-xs sm:text-sm text-white placeholder-zinc-500 outline-none focus:border-indigo-400"
              />
              <button
                type="submit"
                disabled={loading || !username.trim()}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shrink-0 cursor-pointer transition-colors flex items-center gap-1"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Match"}
              </button>
            </div>
          </form>

          {userProfile && (
            <div className="mt-3 pt-3 border-t border-indigo-500/20 text-xs text-zinc-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>
                  Matched with <strong>@{userProfile.login}</strong> ({userProfile.public_repos} repos)
                </span>
              </div>
              <Link
                href={`/profiles?username=${userProfile.login}`}
                className="text-indigo-400 hover:text-indigo-300 underline font-medium"
              >
                View full stats
              </Link>
            </div>
          )}
        </div>

        {/* Featured Curated Repos */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Curated Repositories
          </p>

          {defaultRepos.map((repo) => (
            <div
              key={`${repo.owner}/${repo.name}`}
              className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-800 bg-[#121522] hover:border-indigo-500/40 hover:bg-[#151929] transition-all"
            >
              <div className="space-y-1 pr-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">
                    {repo.owner}/{repo.name}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/60 font-medium">
                    {repo.tag}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 line-clamp-1">
                  {repo.description}
                </p>
                <div className="flex items-center gap-3 text-xs text-zinc-500 pt-0.5">
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400" /> {repo.stars}
                  </span>
                  <span>•</span>
                  <span className="text-zinc-400">{repo.language}</span>
                </div>
              </div>

              <Link
                href={`/repo?owner=${repo.owner}&repo=${repo.name}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-semibold transition-all shrink-0 cursor-pointer"
              >
                Analyze <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
