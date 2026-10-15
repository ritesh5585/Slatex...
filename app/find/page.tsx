import type { Metadata } from "next";
import { FindSearchForm } from "@/components/find/FindSearchForm";
import { GitFork } from "lucide-react";

export const metadata: Metadata = {
  title: "Find projects — Slatex",
  description: "Analyze a GitHub profile and discover open source projects to contribute to.",
};

export default function FindPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div>
        <h1
          className="text-[20px] font-semibold leading-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Find projects to contribute to
        </h1>
        <p
          className="mt-1 text-[14px]"
          style={{ color: "var(--text-secondary)" }}
        >
          Enter a GitHub username. We read the public profile and suggest open
          source projects that fit.
        </p>
      </div>

      {/* Search form */}
      <FindSearchForm />

      {/* Empty state prompt */}
      <div
        className="flex flex-col items-center gap-4 py-12 rounded-[12px] border text-center mt-4"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <div
          className="flex h-12 w-12 items-center justify-center rounded-[12px]"
          style={{
            background: "var(--elevated)",
            color: "var(--text-tertiary)",
          }}
        >
          <GitFork className="h-6 w-6" />
        </div>
        <div>
          <p
            className="text-sm font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            No username yet
          </p>
          <p
            className="mt-1 text-[13px] max-w-xs mx-auto leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            Enter your GitHub username above and we will suggest repositories
            tailored to your tech stack.
          </p>
        </div>
        <p className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>
          Try:{" "}
          <code
            className="font-mono px-1 py-0.5 rounded"
            style={{ background: "var(--elevated)" }}
          >
            ritesh5585
          </code>{" "}
          or{" "}
          <code
            className="font-mono px-1 py-0.5 rounded"
            style={{ background: "var(--elevated)" }}
          >
            torvalds
          </code>
        </p>
      </div>
    </div>
  );
}
