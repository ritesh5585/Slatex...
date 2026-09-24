"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  function handleSearch(username: string) {
    const Username = username.trim();
    if (!Username) return;

    setIsLoading(true);
    if (Username.includes("github.com/")) {
      let parts = Username.replace(".git", "")
        .split("github.com/")[1]
        .split("/")
        .filter(Boolean);

      if (parts.length >= 2) {
        console.log(parts);
        router.push(
          `/repo?owner=${encodeURIComponent(parts[0])}&repo=${encodeURIComponent(parts[1])}`,
        );
      } else {
        // sirf username URL hai → /result pe bhejo
        router.push(`/result?username=${encodeURIComponent(parts[0])}`);
      }
    } else {
      router.push(`/result?username=${encodeURIComponent(Username)}`);
    }
    setIsLoading(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleSearch(input);
  }

  return (
    <main className="relative min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center px-4 overflow-hidden selection:bg-blue-500/30 selection:text-blue-200">
      {/* Background ambient lighting */}
      <div className="hero-glow" />

      {/* Grid Pattern */}
      <div className="hero-grid absolute inset-0 opacity-[0.06] pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col items-center text-center space-y-8">
        {/* Heading & Subheading */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Developer Insights,{" "}
            <span className="bg-linear-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Redefined.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-md mx-auto leading-relaxed">
            Enter any public GitHub username or repo to generate a sleek,
            production-grade developer dashboard and repository analytics.
          </p>
        </div>

        {/* Search Input Box */}
        <form
          onSubmit={handleSubmit}
          className="w-full relative rounded-2xl border border-zinc-800 bg-zinc-900/60 p-2 backdrop-blur-xl shadow-2xl transition-all focus-within:border-zinc-700 focus-within:ring-2 focus-within:ring-blue-500/30"
        >
          <div className="flex flex-row gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-2 sm:flex-row sm:items-center sm:gap-0 sm:p-0 sm:px-4 sm:py-1">
            {" "}
            <div className="text-zinc-500"></div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="type here..."
              autoFocus
              className="w-full rounded-2xl bg-zinc-900/50 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-zinc-700 sm:flex-1 sm:rounded-none sm:border-0 sm:bg-transparent sm:px-0 sm:py-2.5 sm:focus:border-0"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className=" flex w-10 rounded-xl px-2 py-2 mt-0.5 text-sm font-semibold gap-1.5 shrink-0"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
