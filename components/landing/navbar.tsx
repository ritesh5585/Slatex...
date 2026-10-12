"use client";

import React from "react";
import Link from "next/link";

interface NavbarProps {
  onGetStarted?: () => void;
}

export function Navbar({ onGetStarted }: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-[#08090f]/90 backdrop-blur-md border-b border-zinc-800/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm font-bold tracking-tight text-white flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
          Slatex
        </Link>

        {onGetStarted ? (
          <button
            type="button"
            onClick={onGetStarted}
            className="inline-flex items-center justify-center px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all cursor-pointer shadow-sm shadow-indigo-600/30"
          >
            Get started
          </button>
        ) : (
          <Link
            href="/"
            className="inline-flex items-center justify-center px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all cursor-pointer shadow-sm shadow-indigo-600/30"
          >
            Get started
          </Link>
        )}
      </div>
    </header>
  );
}
