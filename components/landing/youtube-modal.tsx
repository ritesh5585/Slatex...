"use client";

import React, { useState } from "react";
import { X, PlaySquare, ArrowRight } from "lucide-react";

interface YouTubeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function YouTubeModal({ isOpen, onClose }: YouTubeModalProps) {
  const [channelUrl, setChannelUrl] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-[#0d0f17] p-4 sm:p-6 shadow-2xl text-left max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-zinc-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
              <PlaySquare className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  YouTube Insights
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 font-semibold">
                  Coming soon
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Analyze developer creator activity & video analytics.
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

        {/* Channel Preview */}
        <div className="space-y-3 mt-4">
          <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
            Channel URL
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={channelUrl}
              onChange={(e) => setChannelUrl(e.target.value)}
              placeholder="youtube.com/@channel"
              className="flex-1 rounded-xl border border-zinc-800 bg-[#121522] px-3 py-2 text-xs sm:text-sm text-white placeholder-zinc-500 outline-none focus:border-red-500/60"
            />
            <button
              type="button"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold cursor-pointer"
            >
              <span>Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Notify me */}
        <form onSubmit={handleSubscribe} className="mt-4 pt-3 border-t border-zinc-800/80 space-y-2">
          <span className="text-[11px] text-zinc-400 block font-medium">
            Get notified when this launches:
          </span>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="flex-1 rounded-xl border border-zinc-800 bg-[#121522] px-3 py-2 text-xs sm:text-sm text-white placeholder-zinc-500 outline-none focus:border-indigo-500/60"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer"
            >
              {subscribed ? "Subscribed!" : "Notify Me"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
