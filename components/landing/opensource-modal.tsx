"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { X, GitFork, ArrowRight } from "lucide-react";

interface OpenSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OpenSourceModal({ isOpen, onClose }: OpenSourceModalProps) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleMatchProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = username.trim().replace(/^@/, "");
    if (!clean) return;
    setLoading(true);
    onClose();
    router.push(`/find/${encodeURIComponent(clean)}` as any);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-[#0d0f17] p-4 sm:p-6 shadow-2xl text-left max-h-[90vh] overflow-y-auto">
        {/* Collision-free flex header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-zinc-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <GitFork className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Find Open Source
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-semibold">
                  Live Explorer
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Discover beginner-friendly projects tailored to your tech stack.
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

        {/* Input */}
        <form onSubmit={handleMatchProfile} className="mt-4 space-y-3">
          <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            Match by GitHub profile
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. ritesh5585"
              className="flex-1 rounded-xl border border-zinc-800 bg-[#121522] px-3 py-2 text-xs sm:text-sm text-white placeholder-zinc-500 outline-none focus:border-indigo-500/60"
              aria-label="GitHub username"
            />
            <button
              type="submit"
              disabled={loading || !username.trim()}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold cursor-pointer"
            >
              <span>Find projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
