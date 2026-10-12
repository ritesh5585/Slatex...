"use client";

import React from "react";

interface CtaBannerProps {
  onAnalyzeProfile: () => void;
}

export function CtaBanner({ onAnalyzeProfile }: CtaBannerProps) {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 py-8 sm:py-10 px-4 sm:px-8 flex flex-col items-center justify-center text-center shadow-lg">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Analyze your own GitHub profile
        </h3>
        <p className="text-indigo-100 text-xs sm:text-sm max-w-md mt-1.5 leading-relaxed">
          See your language breakdown, commit frequency, and top projects in one clean dashboard.
        </p>

        <button
          type="button"
          onClick={onAnalyzeProfile}
          className="mt-4 px-5 py-2 sm:px-6 sm:py-2.5 rounded-lg bg-white text-zinc-950 font-bold text-xs sm:text-sm hover:bg-zinc-100 active:scale-95 transition-all cursor-pointer shadow-sm"
        >
          Analyze my profile
        </button>
      </div>
    </section>
  );
}
