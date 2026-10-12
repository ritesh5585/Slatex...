"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Sparkles, ArrowRight, User } from "lucide-react";

interface ProfilePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfilePromptModal({
  isOpen,
  onClose,
}: ProfilePromptModalProps) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = username.trim().replace(/^@/, "");
    if (!cleanUser) return;
    setLoading(true);
    onClose();
    router.push(`/profiles?username=${encodeURIComponent(cleanUser)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-[#0d0f17] p-4 sm:p-6 shadow-2xl text-left">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-zinc-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Analyze your GitHub story
              </h3>
              <p className="text-xs text-zinc-400">
                Enter your username to generate your developer report.
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

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
              GitHub Username
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-3 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. ritesh5585"
                autoFocus
                className="w-full rounded-xl border border-zinc-800 bg-[#121522] pl-9 pr-3 py-2 text-xs sm:text-sm text-white placeholder-zinc-500 outline-none focus:border-indigo-500/60"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !username.trim()}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-md shadow-indigo-600/30"
          >
            <span>Generate Report</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
