import type { Signal, SkillLevel, ScoredProject, StarterIssue } from "./types";
import { LANG_COLORS } from "@/lib/language-colors";

// ── REST API helpers ──────────────────────────────────────────────────────────

const GITHUB_API = "https://api.github.com";

function ghHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function ghFetch(url: string): Promise<Response> {
  return fetch(url, { headers: ghHeaders(), next: { revalidate: 300 } });
}

export function getLangColor(lang: string | null): string | null {
  if (!lang) return null;
  return LANG_COLORS[lang] ?? null;
}

// ── Search repos via GitHub REST search ───────────────────────────────────────

interface SearchItem {
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  open_issues_count: number;
  pushed_at: string;
  topics: string[];
  archived: boolean;
  forks_count: number;
}

interface SearchResponse {
  items: SearchItem[];
  total_count: number;
}

/** Build one GitHub search query string */
function buildQuery(signal: Signal, level: SkillLevel): string {
  const d30ago = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const starRange = level === "beginner" ? "100..10000" : "500..50000";
  const base = `stars:${starRange} pushed:>${d30ago} archived:false`;

  if (signal.kind === "language") {
    return `${base} language:${signal.id} good-first-issues:>2`;
  }
  if (signal.kind === "topic") {
    return `${base} topic:${signal.id} good-first-issues:>2`;
  }
  // keyword: just use as search term
  return `${signal.id} ${base} good-first-issues:>2`;
}

/** Search one signal, returns up to 10 items */
async function searchOneSignal(
  signal: Signal,
  level: SkillLevel,
): Promise<SearchItem[]> {
  const q = encodeURIComponent(buildQuery(signal, level));
  const url = `${GITHUB_API}/search/repositories?q=${q}&sort=stars&per_page=10`;
  const res = await ghFetch(url);

  if (res.status === 403 || res.status === 429) return [];
  if (!res.ok) return [];

  const data: SearchResponse = await res.json();
  return data.items ?? [];
}

/** Fetch starter issues for one repo (up to 3) */
export async function getStarterIssues(
  fullName: string,
): Promise<StarterIssue[]> {
  const labels = encodeURIComponent("good first issue,help wanted");
  const url = `${GITHUB_API}/repos/${fullName}/issues?state=open&labels=${labels}&per_page=3`;
  const res = await ghFetch(url);
  if (!res.ok) return [];

  const issues: {
    number: number;
    title: string;
    html_url: string;
    labels: { name: string }[];
  }[] = await res.json();

  return (issues ?? []).map((i) => ({
    number: i.number,
    title: i.title,
    url: i.html_url,
    labels: i.labels.map((l) => l.name),
  }));
}

/** Search across top-3 language signals, merge + dedupe */
export async function searchProjects(
  signals: Signal[],
  level: SkillLevel,
): Promise<SearchItem[]> {
  // Use top-3 language signals, fallback to first 3 signals
  const languageSignals = signals
    .filter((s) => s.kind === "language")
    .slice(0, 3);
  const toUse =
    languageSignals.length > 0 ? languageSignals : signals.slice(0, 3);

  // parallel fetch with rate-limit awareness
  const batches = await Promise.all(
    toUse.map((s) => searchOneSignal(s, level)),
  );

  const seen = new Set<string>();
  const merged: SearchItem[] = [];
  for (const batch of batches) {
    for (const item of batch) {
      if (!seen.has(item.full_name) && !item.archived) {
        seen.add(item.full_name);
        merged.push(item);
      }
    }
  }
  return merged;
}

// Re-export type for scorer
export type { SearchItem };
