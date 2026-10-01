"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Sparkles, Loader2, User } from "lucide-react";

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
    router.push(`/profiles?username=${encodeURIComponent(cleanUser)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-[#0d0f17] p-6 sm:p-8 shadow-2xl text-left">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              See your GitHub story
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400">
              Enter your username to generate your developer report.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              GitHub Username
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-zinc-500">@</span>
              <input
                type="text"
                autoFocus
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your-username"
                className="w-full rounded-xl border border-zinc-800 bg-[#121522] pl-8 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-indigo-500/60"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !username.trim()}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#5850ec] hover:bg-[#4b43db] disabled:opacity-50 transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "View My Story"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
