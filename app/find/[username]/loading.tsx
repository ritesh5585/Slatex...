import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

function CardSkeleton() {
  return (
    <div
      className="flex flex-col gap-3 rounded-[12px] border p-4"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
      }}
    >
      {/* Header: repo name + fit label */}
      <div className="flex items-start justify-between gap-2">
        <Skeleton className="h-4 w-44 max-w-[65%] rounded-[6px]" />
        <Skeleton className="h-3.5 w-16 shrink-0 rounded-[4px]" />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-3 w-full rounded-[4px]" />
        <Skeleton className="h-3 w-4/5 rounded-[4px]" />
      </div>

      {/* Meta row: lang, stars, issues, difficulty */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-2.5 w-2.5 rounded-full" />
          <Skeleton className="h-3 w-16 rounded-[4px]" />
        </div>
        <Skeleton className="h-3 w-14 rounded-[4px]" />
        <Skeleton className="h-3 w-24 rounded-[4px]" />
        <Skeleton className="h-4 w-16 rounded-[8px]" />
      </div>

      {/* Reasons list */}
      <div className="flex flex-col gap-1.5 py-1">
        <div className="flex items-center gap-2">
          <Skeleton className="h-1.5 w-1.5 rounded-full shrink-0" />
          <Skeleton className="h-3 w-11/12 rounded-[4px]" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-1.5 w-1.5 rounded-full shrink-0" />
          <Skeleton className="h-3 w-4/5 rounded-[4px]" />
        </div>
      </div>

      {/* Footer meta info */}
      <Skeleton className="h-2.5 w-32 rounded-[4px] mt-0.5" />

      {/* Actions */}
      <div className="flex items-center gap-2 mt-1">
        <Skeleton className="h-9 flex-1 rounded-[8px]" />
        <Skeleton className="h-9 w-10 shrink-0 rounded-[8px]" />
      </div>
    </div>
  );
}

export function FindProjectsSkeleton() {
  return (
    <div
      className="flex flex-col gap-6"
      aria-busy="true"
      aria-label="Loading project recommendations"
    >
      {/* Page header */}
      <div>
        <h1
          className="text-[20px] font-semibold leading-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Find projects to contribute to
        </h1>
        <p className="mt-1 text-[14px]" style={{ color: "var(--text-secondary)" }}>
          Enter a GitHub username. We read the public profile and suggest open
          source projects that fit.
        </p>
      </div>

      {/* Search form skeleton */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Skeleton className="h-10 flex-1 rounded-[8px]" />
        <Skeleton className="h-10 sm:w-28 rounded-[8px]" />
      </div>

      {/* Profile row skeleton */}
      <div
        className="flex items-center gap-3 py-4 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <Skeleton className="h-10 w-10 rounded-full shrink-0" />
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <Skeleton className="h-4 w-32 rounded-[6px]" />
          <Skeleton className="h-3 w-72 max-w-full rounded-[4px]" />
        </div>
      </div>

      {/* Signal chips skeleton */}
      <div className="flex gap-2 overflow-hidden py-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 shrink-0 rounded-[8px]" />
        ))}
      </div>

      {/* Filter bar skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Skeleton className="h-4 w-28 rounded-[6px]" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-32 rounded-[8px]" />
          <Skeleton className="h-9 w-28 rounded-[8px]" />
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 min-[860px]:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export default function Loading() {
  return <FindProjectsSkeleton />;
}