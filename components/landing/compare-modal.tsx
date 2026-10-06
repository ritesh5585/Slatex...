"use client";

import React, { useState } from "react";
import { X, ArrowRight, GitCompare, Sparkles, Loader2, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CompareModal({ isOpen, onClose }: CompareModalProps) {
  const router = useRouter();
  const [dev1, setDev1] = useState("");
  const [dev2, setDev2] = useState("");
  const [loading, setLoading] = useState(false);
  const [comparisonData, setComparisonData] = useState<{
    user1: any;
    user2: any;
    verdict?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const clean1 = dev1.trim().replace(/^@/, "");
  const clean2 = dev2.trim().replace(/^@/, "");

  // Direct navigation to the new compare page
  const handleCompareNow = () => {
    if (!clean1 || !clean2) return;
    onClose();
    router.push(`/compare?user1=${encodeURIComponent(clean1)}&user2=${encodeURIComponent(clean2)}`);
  };

  // Preview using GraphQL API route
  const handleFetchPreview = async () => {
    if (!clean1 || !clean2) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/github/compare?user1=${encodeURIComponent(clean1)}&user2=${encodeURIComponent(clean2)}`,
      );
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to compare users with GraphQL API");
      }

      setComparisonData(json);
    } catch (err: any) {
      setError(err?.message || "Failed to compare users via GraphQL");
    } finally {
      setLoading(false);
    }
  };

  const handlePreset = (u1: string, u2: string) => {
    setDev1(u1);
    setDev2(u2);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-zinc-800 bg-[#0d0f17] p-6 sm:p-8 shadow-2xl text-left overflow-y-auto max-h-[90vh] ring-1 ring-white/10">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
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
                GraphQL Powered
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
                onKeyDown={(e) => {
                  if (e.key === "Enter" && clean1 && clean2) handleCompareNow();
                }}
                placeholder="e.g. ritesh5585"
                className="w-full rounded-xl border border-zinc-800 bg-[#121522] px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/50 transition-colors"
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
                onKeyDown={(e) => {
                  if (e.key === "Enter" && clean1 && clean2) handleCompareNow();
                }}
                placeholder="e.g ateeksh soni"
                className="w-full rounded-xl border border-zinc-800 bg-[#121522] px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/50 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-zinc-500">
          <span>Presets:</span>
          <button
            type="button"
            onClick={() => handlePreset("ritesh5585", "ateekshsoni")}
            className="text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
          >
            ritesh5585 vs ateekshsoni
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => handlePreset("callmegautam", "ankurdotio")}
            className="text-zinc-400 hover:text-white underline cursor-pointer"
          >
            Gautam Sutar vs Ankur Prajapati
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

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-zinc-800/80">
          <button
            type="button"
            onClick={handleFetchPreview}
            disabled={loading || !clean1 || !clean2}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800/60 hover:bg-zinc-800 hover:text-white disabled:opacity-50 text-zinc-300 text-sm font-medium transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Querying GraphQL...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-purple-400" />
                Quick Preview
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleCompareNow}
            disabled={!clean1 || !clean2}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white text-sm font-semibold transition-all cursor-pointer shadow-lg shadow-indigo-600/30 active:scale-95"
          >
            <GitCompare className="w-4 h-4" />
            Compare Now
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            {error}
          </div>
        )}

        {/* Comparison Data Preview */}
        {comparisonData && (
          <div className="mt-6 pt-5 border-t border-zinc-800/80 space-y-4">
            {comparisonData.verdict && (
              <p className="text-xs text-indigo-300 bg-indigo-950/40 border border-indigo-800/50 p-2.5 rounded-xl text-center">
                {comparisonData.verdict}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Dev 1 Card */}
              <div className="rounded-xl border border-indigo-900/40 bg-[#121522] p-4 text-center ring-1 ring-indigo-500/20">
                <div className="w-12 h-12 rounded-full overflow-hidden mx-auto bg-zinc-800 mb-2 ring-2 ring-indigo-500/40">
                  {comparisonData.user1.avatarUrl ? (
                    <img
                      src={comparisonData.user1.avatarUrl}
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
                <p className="text-xs text-indigo-400">@{comparisonData.user1.login}</p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-left text-xs">
                  <div className="p-2 rounded bg-zinc-900/60 border border-zinc-800/60">
                    <div className="text-zinc-500 text-[11px]">Followers</div>
                    <div className="font-bold text-white text-sm">
                      {typeof comparisonData.user1.followers === "number"
                        ? comparisonData.user1.followers.toLocaleString()
                        : comparisonData.user1.followers?.totalCount?.toLocaleString?.() || 0}
                    </div>
                  </div>
                  <div className="p-2 rounded bg-zinc-900/60 border border-zinc-800/60">
                    <div className="text-zinc-500 text-[11px]">Public Repos</div>
                    <div className="font-bold text-white text-sm">
                      {typeof comparisonData.user1.publicRepos === "number"
                        ? comparisonData.user1.publicRepos.toLocaleString()
                        : comparisonData.user1.publicRepos?.totalCount?.toLocaleString?.() || 0}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dev 2 Card */}
              <div className="rounded-xl border border-amber-900/40 bg-[#121522] p-4 text-center ring-1 ring-amber-500/20">
                <div className="w-12 h-12 rounded-full overflow-hidden mx-auto bg-zinc-800 mb-2 ring-2 ring-amber-500/40">
                  {comparisonData.user2.avatarUrl ? (
                    <img
                      src={comparisonData.user2.avatarUrl}
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
                <p className="text-xs text-amber-400">@{comparisonData.user2.login}</p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-left text-xs">
                  <div className="p-2 rounded bg-zinc-900/60 border border-zinc-800/60">
                    <div className="text-zinc-500 text-[11px]">Followers</div>
                    <div className="font-bold text-white text-sm">
                      {typeof comparisonData.user2.followers === "number"
                        ? comparisonData.user2.followers.toLocaleString()
                        : comparisonData.user2.followers?.totalCount?.toLocaleString?.() || 0}
                    </div>
                  </div>
                  <div className="p-2 rounded bg-zinc-900/60 border border-zinc-800/60">
                    <div className="text-zinc-500 text-[11px]">Public Repos</div>
                    <div className="font-bold text-white text-sm">
                      {typeof comparisonData.user2.publicRepos === "number"
                        ? comparisonData.user2.publicRepos.toLocaleString()
                        : comparisonData.user2.publicRepos?.totalCount?.toLocaleString?.() || 0}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Launch Full View Button */}
            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={handleCompareNow}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
              >
                <span>Open Full Comparison Page</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
