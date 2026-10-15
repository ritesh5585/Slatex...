"use client";

import React, { useState } from "react";
import type { ScoredProject } from "@/lib/api/opensource/types";
import { Button } from "@/components/ui/button";

interface ProjectCardProps {
  project: ScoredProject;
  onSave?: (fullName: string) => void;
  isSaved?: boolean;
}

function relativeDate(iso: string): { relative: string; full: string } {
  const d = new Date(iso);
  const full = d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const diffMs = Date.now() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let relative: string;
  if (diffDays === 0) relative = "today";
  else if (diffDays === 1) relative = "yesterday";
  else if (diffDays < 30) relative = `${diffDays} days ago`;
  else if (diffDays < 365) relative = `${Math.floor(diffDays / 30)} months ago`;
  else relative = `${Math.floor(diffDays / 365)} years ago`;

  return { relative, full };
}

function FitLabel({ fit }: { fit: ScoredProject["fit"] }) {
  const color =
    fit === "Strong fit"
      ? "var(--success)"
      : fit === "Good fit"
        ? "var(--text-primary)"
        : "var(--text-tertiary)";
  return (
    <span className="text-[12px] font-medium shrink-0" style={{ color }}>
      {fit}
    </span>
  );
}

function LangDot({ color, name }: { color: string | null; name: string }) {
  return (
    <span className="flex items-center gap-1 text-[12px]" style={{ color: "var(--text-secondary)" }}>
      <span
        className="w-2.5 h-2.5 rounded-full shrink-0 inline-block"
        style={{ background: color ?? "var(--border)" }}
      />
      {name}
    </span>
  );
}

// ── Main Card ─────────────────────────────────────────────────────────────────

export function ProjectCard({ project, onSave, isSaved = false }: ProjectCardProps) {
  const [saved, setSaved] = useState(isSaved);
  const pushed = relativeDate(project.pushedAt);

  const handleSave = () => {
    setSaved((s) => !s);
    onSave?.(project.fullName);
  };

  return (
    <article
      className="flex flex-col gap-3 rounded-[12px] border p-4"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
      }}
    >
      {/* Header: repo name + fit label */}
      <div className="flex items-start justify-between gap-2">
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[13px] font-medium leading-snug hover:underline focus-visible:underline transition-colors duration-[120ms] min-w-0 truncate"
          style={{ color: "var(--text-primary)" }}
          aria-label={`Open ${project.fullName} on GitHub`}
        >
          {project.fullName}
        </a>
        <FitLabel fit={project.fit} />
      </div>

      {/* Description */}
      {project.description && (
        <p
          className="text-[13px] leading-relaxed line-clamp-2"
          style={{ color: "var(--text-secondary)" }}
        >
          {project.description}
        </p>
      )}

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        {project.language && (
          <LangDot color={project.languageColor} name={project.language} />
        )}
        <span
          className="text-[12px]"
          style={{ color: "var(--text-secondary)" }}
        >
          {project.stars.toLocaleString()} stars
        </span>
        {project.beginnerIssues > 0 && (
          <span
            className="text-[12px]"
            style={{ color: "var(--text-secondary)" }}
          >
            {project.beginnerIssues} beginner issues
          </span>
        )}
        <span
          className="text-[12px] rounded-[8px] border px-1.5 py-0.5"
          style={{
            color: "var(--text-tertiary)",
            borderColor: "var(--border)",
          }}
        >
          {project.difficulty}
        </span>
      </div>

      {/* Reasons */}
      {project.reasons.length > 0 && (
        <ul className="flex flex-col gap-1 pl-0">
          {project.reasons.slice(0, 3).map((r, i) => (
            <li
              key={i}
              className="flex items-start gap-1.5 text-[13px]"
              style={{ color: "var(--text-secondary)" }}
            >
              <span
                className="mt-1.5 w-1 h-1 rounded-full shrink-0"
                style={{ background: "var(--text-tertiary)" }}
              />
              {r}
            </li>
          ))}
        </ul>
      )}

      {/* Starter issues collapsible */}
      {project.starterIssues.length > 0 && (
        <details className="group">
          <summary
            className="text-[12px] cursor-pointer select-none list-none flex items-center gap-1 transition-colors duration-[120ms]"
            style={{ color: "var(--text-tertiary)" }}
          >
            <span className="group-open:rotate-90 transition-transform duration-[120ms] inline-block">
              ›
            </span>
            {project.starterIssues.length} starter{" "}
            {project.starterIssues.length === 1 ? "issue" : "issues"}
          </summary>
          <ul className="mt-2 flex flex-col gap-1.5 pl-3">
            {project.starterIssues.map((issue) => (
              <li key={issue.number}>
                <a
                  href={issue.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] hover:underline focus-visible:underline transition-colors duration-[120ms]"
                  style={{ color: "var(--accent)" }}
                >
                  #{issue.number} {issue.title}
                </a>
              </li>
            ))}
          </ul>
        </details>
      )}

      {/* Footer meta */}
      <p
        className="text-[11px]"
        style={{ color: "var(--text-tertiary)" }}
      >
        <time dateTime={project.pushedAt} title={pushed.full}>
          Updated {pushed.relative}
        </time>
        {project.prReviewSpeed && (
          <> · PRs reviewed {project.prReviewSpeed}</>
        )}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-1">
        <Button
          asChild
          className="flex-1 h-9 text-[13px]"
          aria-label={`View beginner issues for ${project.fullName}`}
        >
          <a
            href={`${project.url}/issues?q=is%3Aopen+label%3A%22good+first+issue%22`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View issues
          </a>
        </Button>
        <Button
          variant="ghost"
          className="h-9 px-3 text-[13px]"
          onClick={handleSave}
          aria-label={saved ? `Unsave ${project.fullName}` : `Save ${project.fullName}`}
        >
          {saved ? "Saved" : "Save"}
        </Button>
      </div>
    </article>
  );
}
