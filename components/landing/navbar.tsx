"use client";

import React from "react";

interface NavbarProps {
  onGetStarted?: () => void;
}

export function Navbar({ onGetStarted }: NavbarProps) {
  return (
    <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2 flex items-center justify-end">

      <button
        type="button"
        onClick={onGetStarted}
        className="inline-flex items-center justify-center px-5 py-2 rounded-xl text-sm font-semibold text-white bg-[#5850ec] hover:bg-[#4b43db] active:scale-95 transition-all duration-200 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 cursor-pointer"
      >
        Get started
      </button>
    </header>
  );
}
