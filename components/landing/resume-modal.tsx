"use client";

import React, { useRef, useState } from "react";
import { ArrowRight, CheckCircle2, FileText, Upload, X } from "lucide-react";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setFileName(file.name);
  };

  const handleSubscribe = (event: React.FormEvent) => {
    event.preventDefault();
    if (email.trim()) setSubscribed(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-[#0d0f17] p-4 sm:p-6 shadow-2xl text-left max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-zinc-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">Resume Analyzer</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 font-semibold">Coming soon</span>
              </div>
              <p className="text-xs text-zinc-400">Turn your resume into a stronger, ATS-ready application.</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shrink-0 cursor-pointer" aria-label="Close dialog">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full rounded-xl border border-dashed border-zinc-700 bg-[#121522] p-5 text-center hover:border-indigo-500/60 hover:bg-indigo-500/5 transition-colors cursor-pointer">
            <Upload className="w-5 h-5 mx-auto mb-2 text-indigo-400" />
            <span className="block text-sm font-semibold text-white">{fileName || "Upload your resume"}</span>
            <span className="block mt-1 text-[11px] text-zinc-500">PDF or DOCX · Analysis launches soon</span>
          </button>
          <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {["Extract skills & experience", "Highlight ATS keywords", "Get improvement points"].map((item) => (
              <div key={item} className="rounded-lg border border-zinc-800 bg-[#121522] p-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mb-1.5" />
                <p className="text-[11px] leading-snug text-zinc-300">{item}</p>
              </div>
            ))}
          </div>

          <button type="button" disabled className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600/50 text-white/70 text-xs font-semibold cursor-not-allowed">
            Analyze resume <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <form onSubmit={handleSubscribe} className="mt-4 pt-3 border-t border-zinc-800/80 space-y-2">
          <span className="text-[11px] text-zinc-400 block font-medium">Get notified when Resume Analyzer launches:</span>
          <div className="flex flex-col sm:flex-row gap-2">
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@email.com" className="flex-1 rounded-xl border border-zinc-800 bg-[#121522] px-3 py-2 text-xs sm:text-sm text-white placeholder-zinc-500 outline-none focus:border-indigo-500/60" />
            <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer">{subscribed ? "Subscribed!" : "Notify Me"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
