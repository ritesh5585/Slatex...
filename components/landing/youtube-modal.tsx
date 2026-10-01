"use client";

import React, { useState } from "react";
import { X, Bell, CheckCircle2, ArrowRight } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-[#0d0f17] p-6 sm:p-8 shadow-2xl text-left">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              YouTube Insights
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 font-medium">
                Coming soon
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400">
              Paste a developer channel to analyze creator activity & video analytics.
            </p>
          </div>
        </div>

        {/* Demo preview input */}
        <div className="space-y-3 mt-5">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
            Test Channel Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={channelUrl}
              onChange={(e) => setChannelUrl(e.target.value)}
              placeholder="e.g. youtube.com/@Fireship"
              className="w-full rounded-xl border border-zinc-800 bg-[#121522] px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-red-500/50"
            />
          </div>
          <p className="text-xs text-zinc-500">
            Preview feature in active development. Supported metrics will include subscriber growth, tech stack frequency, and code demo engagement.
          </p>
        </div>

        {/* Email Notification Box */}
        <div className="mt-6 pt-5 border-t border-zinc-800/80">
          <div className="flex items-center gap-2 text-emerald-400 text-xs sm:text-sm bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>You're on the early access list! We'll notify you when YouTube insights launches.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
