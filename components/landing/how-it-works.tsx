"use client";

import React from "react";
import { Search, Cpu, BarChart3, ArrowRight } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      num: "1",
      title: "Search Target",
      desc: "Enter any developer username or repository link. Zero signup needed.",
      icon: <Search className="w-4 h-4 text-indigo-400" suppressHydrationWarning />,
    },
    {
      num: "2",
      title: "GraphQL Fetch",
      desc: "Consolidates multi-branch commits, language bytes, and Redis caches.",
      icon: <Cpu className="w-4 h-4 text-purple-400" suppressHydrationWarning />,
    },
    {
      num: "3",
      title: "Instant Intel",
      desc: "Get language percentages, streak metrics, or side-by-side comparison.",
      icon: <BarChart3 className="w-4 h-4 text-emerald-400" suppressHydrationWarning />,
    },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12 space-y-1">
        <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-400">
          How It Works
        </span>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Three simple steps to developer intelligence
        </h2>
      </div>

      {/* Modern Pipeline Stepper - No Bulky Cards */}
      <div className="relative">
        {/* Desktop Connecting Line */}
        <div className="hidden md:block absolute top-7 left-16 right-16 h-0.5 bg-gradient-to-r from-indigo-500/40 via-purple-500/40 to-emerald-500/40 -z-0" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative z-10">
          {steps.map((step, idx) => (
            <div
              key={step.num}
              className="flex md:flex-col items-start md:items-center text-left md:text-center gap-4 md:gap-3 group"
            >
              {/* Stepper Node */}
              <div className="relative shrink-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#0e111c] border-2 border-zinc-800 group-hover:border-indigo-500/60 flex items-center justify-center transition-all shadow-md group-hover:shadow-indigo-500/20">
                  {step.icon}
                </div>
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-indigo-600 text-[10px] font-bold text-white flex items-center justify-center shadow-sm">
                  {step.num}
                </span>
              </div>

              {/* Text content */}
              <div className="flex-1">
                <div className="flex items-center md:justify-center gap-1.5">
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {step.title}
                  </h3>
                  {idx < steps.length - 1 && (
                    <ArrowRight className="hidden md:inline-block w-3.5 h-3.5 text-zinc-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" suppressHydrationWarning />
                  )}
                </div>
                <p className="text-zinc-400 text-xs sm:text-sm mt-1 leading-relaxed max-w-xs md:mx-auto">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
