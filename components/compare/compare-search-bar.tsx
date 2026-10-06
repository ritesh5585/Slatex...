"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftRight, Loader2, Sparkles } from "lucide-react";

interface CompareSearchBarProps {
  initialU1?: string;
  initialU2?: string;
}

export function CompareSearchBar({
  initialU1 = "",
  initialU2 = "",
}: CompareSearchBarProps) {
  const router = useRouter();
  const [u1, setU1] = useState(initialU1);
  const [u2, setU2] = useState(initialU2);
  const [loading, setLoading] = useState(false);

  const handleCompare = (e?: React.FormEvent) => {
    e?.preventDefault();
    const c1 = u1.trim().replace(/^@/, "");
    const c2 = u2.trim().replace(/^@/, "");
    if (!c1 || !c2) return;
    setLoading(true);
    router.push(`/compare?user1=${encodeURIComponent(c1)}&user2=${encodeURIComponent(c2)}`);
  };

  const handleSwap = () => {
    const next1 = u2;
    const next2 = u1;
    setU1(next1);
    setU2(next2);
    if (next1 && next2) {
      setLoading(true);
      router.push(`/compare?user1=${encodeURIComponent(next1)}&user2=${encodeURIComponent(next2)}`);
    }
  };

  const handlePreset = (p1: string, p2: string) => {
    setU1(p1);
    setU2(p2);
    setLoading(true);
    router.push(`/compare?user1=${encodeURIComponent(p1)}&user2=${encodeURIComponent(p2)}`);
  };

  return (
    <div className="space-y-2.5 w-full">
      <form onSubmit={handleCompare} className="flex flex-col sm:flex-row items-center gap-2.5 w-full">
        <div className="flex items-center flex-1 w-full gap-2 rounded-xl border border-zinc-800 bg-[#0e111c] px-3 py-1.5 focus-within:border-zinc-700 transition-colors">
          {/* User 1 */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50 shrink-0" />
            <input
              type="text"
              value={u1}
              onChange={(e) => setU1(e.target.value)}
              placeholder="Developer 1 (e.g. ritesh5585)"
              className="w-full bg-transparent text-sm text-white placeholder-zinc-500 outline-none font-medium truncate"
            />
          </div>

          {/* Swap */}
          <button
            type="button"
            onClick={handleSwap}
            title="Swap developers"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors shrink-0 cursor-pointer"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>

          {/* User 2 */}
          <div className="flex items-center gap-2 flex-1 min-w-0 border-l border-zinc-800 pl-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50 shrink-0" />
            <input
              type="text"
              value={u2}
              onChange={(e) => setU2(e.target.value)}
              placeholder="Developer 2 (e.g. softwaredeveloper111)"
              className="w-full bg-transparent text-sm text-white placeholder-zinc-500 outline-none font-medium truncate"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !u1.trim() || !u2.trim()}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
              <span>Comparing...</span>
            </>
          ) : (
            <span>Compare</span>
          )}
        </button>
      </form>

      {/* Presets */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
        <span>Presets:</span>
        {[
          ["torvalds", "antirez"],
        ].map(([p1, p2]) => (
          <button
            key={`${p1}-${p2}`}
            type="button"
            onClick={() => handlePreset(p1, p2)}
            className="text-zinc-400 hover:text-white hover:underline cursor-pointer"
          >
            {p1} vs {p2}
          </button>
        ))}
      </div>
    </div>
  );
}
