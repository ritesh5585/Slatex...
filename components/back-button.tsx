"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  fallback?: string;
  label?: string;
}

export function BackButton({
  fallback = "/",
  label = "Go Back",
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    // Agar history hai toh back, warna fallback
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallback);
    }
  };

  return (
    <button
      onClick={handleBack}
      className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-zinc-400 hover:text-white transition-colors"
    >
      <ArrowLeft className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}
