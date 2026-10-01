"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  fallback?: string;
  label?: string;
  className?: string;
}

export function BackButton({
  fallback = "/",
  label = "Back",
  className = "",
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallback);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-zinc-800 bg-[#0e111c] text-xs sm:text-sm font-medium text-zinc-300 hover:text-white hover:border-zinc-700 hover:bg-[#141829] transition-all cursor-pointer shadow-sm active:scale-95 ${className}`}
    >
      <ArrowLeft className="h-4 w-4" suppressHydrationWarning />
      <span>{label}</span>
    </button>
  );
}
