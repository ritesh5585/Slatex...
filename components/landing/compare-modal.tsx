"use client";

import React, { useState } from "react";
import { X, ArrowRight, GitCompare, Sparkles, Loader2 } from "lucide-react";
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

  const handleCompareNow = () => {
    if (!clean1 || !clean2) return;
    onClose();
    router.push(`/compare?user1=${encodeURIComponent(clean1)}&user2=${encodeURIComponent(clean2)}`);
  };

  const handleFetchPreview = async () => {
    if (!clean1 || !clean2) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/github/compare?user1=${encodeURIComponent(clean1)}&user2=${encodeURIComponent(clean2)}`
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

  const presets = [
    { label: "ritesh5585 vs ateekshsoni", u1: "ritesh5585", u2: "ateekshsoni" },
    { label: "callmegautam vs ankurdotio", u1: "callmegautam", u2: "ankurdotio" },
    { label: "torvalds vs antirez", u1: "torvalds", u2: "antirez" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-[#0d0f17] p-4 sm:p-6 shadow-2xl text-left max-h-[90vh] overflow-y-auto">
        {/* Header - Flex row prevents ANY overlap between badge and close button */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-zinc-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <GitCompare className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Compare developers
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 font-semibold">
                  GraphQL
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Compare two developers side by side.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shrink-0 cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Comparison Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <div>
            <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              Developer 1
            </label>
            <input
              type="text"
              value={dev1}
              onChange={(e) => setDev1(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && clean1 && clean2) handleCompareNow();
              }}
              placeholder="e.g. ritesh5585"
              className="w-full rounded-xl border border-zinc-800 bg-[#121522] px-3 py-2 text-xs sm:text-sm text-white placeholder-zinc-500 outline-none focus:border-indigo-500/60 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              Developer 2
            </label>
            <input
              type="text"
              value={dev2}
              onChange={(e) => setDev2(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && clean1 && clean2) handleCompareNow();
              }}
              placeholder="e.g. ateekshsoni"
              className="w-full rounded-xl border border-zinc-800 bg-[#121522] px-3 py-2 text-xs sm:text-sm text-white placeholder-zinc-500 outline-none focus:border-indigo-500/60 transition-colors"
            />
          </div>
        </div>

        {/* Presets as clean pills */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2">
          <span className="text-[11px] text-zinc-500 font-medium">Presets:</span>
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => {
                setDev1(p.u1);
                setDev2(p.u2);
                setError(null);
              }}
              className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-[10px] font-mono transition-colors cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-3 border-t border-zinc-800/80">
          <button
            type="button"
            onClick={handleFetchPreview}
            disabled={loading || !clean1 || !clean2}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-zinc-700 bg-zinc-800/60 hover:bg-zinc-800 disabled:opacity-50 text-zinc-300 text-xs font-medium transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Querying...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Quick Preview
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleCompareNow}
            disabled={!clean1 || !clean2}
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold transition-all cursor-pointer active:scale-95 shadow-md shadow-indigo-600/30"
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Compare Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-3 p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            {error}
          </div>
        )}

        {/* Preview Results if loaded */}
        {comparisonData && (
          <div className="mt-4 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2 text-xs">
            <div className="flex justify-between items-center font-bold text-white">
              <span>{comparisonData.user1?.login}</span>
              <span className="text-zinc-500">VS</span>
              <span>{comparisonData.user2?.login}</span>
            </div>
            {comparisonData.verdict && (
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                {comparisonData.verdict}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
