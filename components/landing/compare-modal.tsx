"use client";

import React, { useState } from "react";
import { X, ArrowRight, GitCompare, Sparkles, Loader2, User } from "lucide-react";
import Link from "next/link";

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CompareModal({ isOpen, onClose }: CompareModalProps) {
  const [dev1, setDev1] = useState("");
  const [dev2, setDev2] = useState("");
  const [loading, setLoading] = useState(false);
  const [comparisonData, setComparisonData] = useState<{
    user1: any;
    user2: any;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCompare = async () => {
    if (!dev1.trim() || !dev2.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const [res1, res2] = await Promise.all([
        fetch(`/api/github/user/${encodeURIComponent(dev1.trim().replace(/^@/, ""))}`),
        fetch(`/api/github/user/${encodeURIComponent(dev2.trim().replace(/^@/, ""))}`),
      ]);

      if (!res1.ok || !res2.ok) {
        throw new Error("One or both GitHub profiles could not be found.");
      }

      const [data1, data2] = await Promise.all([res1.json(), res2.json()]);
      setComparisonData({ user1: data1, user2: data2 });
    } catch (err: any) {
      setError(err?.message || "Failed to compare users");
    } finally {
      setLoading(false);
    }
  };

  const handlePreset = (u1: string, u2: string) => {
    setDev1(u1);
    setDev2(u2);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-2xl border border-zinc-800 bg-[#0d0f17] p-6 sm:p-8 shadow-2xl text-left overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <GitCompare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Compare developers
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 font-medium">
                Beta
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400">
              Put two GitHub profiles side-by-side to compare stats, languages & impact.
            </p>
          </div>
        </div>

        {/* Comparison Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Developer 1
            </label>
            <div className="relative">
              <input
                type="text"
                value={dev1}
                onChange={(e) => setDev1(e.target.value)}
                placeholder="e.g. shadcn"
                className="w-full rounded-xl border border-zinc-800 bg-[#121522] px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-purple-500/60 transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Developer 2
            </label>
            <div className="relative">
              <input
                type="text"
                value={dev2}
                onChange={(e) => setDev2(e.target.value)}
                placeholder="e.g. leerob"
                className="w-full rounded-xl border border-zinc-800 bg-[#121522] px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-purple-500/60 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2 mt-3 text-xs text-zinc-500">
          <span>Presets:</span>
          <button
            type="button"
            onClick={() => handlePreset("shadcn", "leerob")}
            className="text-zinc-400 hover:text-white underline cursor-pointer"
          >
            shadcn vs leerob
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => handlePreset("torvalds", "antirez")}
            className="text-zinc-400 hover:text-white underline cursor-pointer"
          >
            torvalds vs antirez
          </button>
        </div>

        {/* Action Button */}
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={handleCompare}
            disabled={loading || !dev1.trim() || !dev2.trim()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-sm font-semibold transition-all cursor-pointer shadow-lg shadow-purple-600/20 active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Comparing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Compare Side-by-Side
              </>
            )}
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            {error}
          </div>
        )}

        {/* Comparison Result */}
        {comparisonData && (
          <div className="mt-6 pt-6 border-t border-zinc-800/80 grid grid-cols-2 gap-4">
            {/* Dev 1 Card */}
            <div className="rounded-xl border border-zinc-800 bg-[#121522] p-4 text-center">
              <div className="w-12 h-12 rounded-full overflow-hidden mx-auto bg-zinc-800 mb-2">
                {comparisonData.user1.avatar_url ? (
                  <img
                    src={comparisonData.user1.avatar_url}
                    alt={comparisonData.user1.login}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 m-3 text-zinc-500" />
                )}
              </div>
              <h4 className="font-bold text-white text-base">
                {comparisonData.user1.name || comparisonData.user1.login}
              </h4>
              <p className="text-xs text-zinc-400">@{comparisonData.user1.login}</p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-left text-xs">
                <div className="p-2 rounded bg-zinc-900/60 border border-zinc-800/60">
                  <div className="text-zinc-500">Followers</div>
                  <div className="font-bold text-white text-sm">
                    {comparisonData.user1.followers?.toLocaleString() || 0}
                  </div>
                </div>
                <div className="p-2 rounded bg-zinc-900/60 border border-zinc-800/60">
                  <div className="text-zinc-500">Public Repos</div>
                  <div className="font-bold text-white text-sm">
                    {comparisonData.user1.public_repos?.toLocaleString() || 0}
                  </div>
                </div>
              </div>
              <Link
                href={`/profiles?username=${comparisonData.user1.login}`}
                className="mt-4 inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                View full profile <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Dev 2 Card */}
            <div className="rounded-xl border border-zinc-800 bg-[#121522] p-4 text-center">
              <div className="w-12 h-12 rounded-full overflow-hidden mx-auto bg-zinc-800 mb-2">
                {comparisonData.user2.avatar_url ? (
                  <img
                    src={comparisonData.user2.avatar_url}
                    alt={comparisonData.user2.login}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 m-3 text-zinc-500" />
                )}
              </div>
              <h4 className="font-bold text-white text-base">
                {comparisonData.user2.name || comparisonData.user2.login}
              </h4>
              <p className="text-xs text-zinc-400">@{comparisonData.user2.login}</p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-left text-xs">
                <div className="p-2 rounded bg-zinc-900/60 border border-zinc-800/60">
                  <div className="text-zinc-500">Followers</div>
                  <div className="font-bold text-white text-sm">
                    {comparisonData.user2.followers?.toLocaleString() || 0}
                  </div>
                </div>
                <div className="p-2 rounded bg-zinc-900/60 border border-zinc-800/60">
                  <div className="text-zinc-500">Public Repos</div>
                  <div className="font-bold text-white text-sm">
                    {comparisonData.user2.public_repos?.toLocaleString() || 0}
                  </div>
                </div>
              </div>
              <Link
                href={`/profiles?username=${comparisonData.user2.login}`}
                className="mt-4 inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 font-medium"
              >
                View full profile <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
