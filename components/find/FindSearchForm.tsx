"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface FindSearchFormProps {
  defaultValue?: string;
}

/**
 * Input + Analyze button. On submit → router.push(/find/username).
 */
export function FindSearchForm({ defaultValue = "" }: FindSearchFormProps) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = value.trim().replace(/^@/, "");
    if (!clean) return;
    setLoading(true);
    router.push(`/find/${encodeURIComponent(clean)}` as any);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full"
    >
      {/* Prefix + input */}
      <div
        className="flex items-center flex-1 rounded-[8px] border overflow-hidden"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        <span
          className="pl-3 pr-1 text-[13px] shrink-0 select-none"
          style={{ color: "var(--text-tertiary)" }}
        >
          github.com/
        </span>
        <input
          id="find-username-input"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="username"
          autoComplete="off"
          spellCheck={false}
          className="flex-1 bg-transparent py-2 pr-3 text-[14px] outline-none min-h-[44px]"
          style={{ color: "var(--text-primary)" }}
          aria-label="GitHub username to analyze"
        />
      </div>

      <Button
        type="submit"
        disabled={!value.trim() || loading}
        className="min-h-[44px] px-5 text-[14px] shrink-0"
        aria-label="Analyze GitHub profile"
      >
        {loading ? "Analyzing…" : "Analyze"}
      </Button>
    </form>
  );
}
