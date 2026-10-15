import type { GitHubUserRepoGQL } from "../github/types";
import type { Signal, SkillLevel, UserSignals } from "./types";

export function getUserSignals(
  username: string,
  avatarUrl: string,
  publicRepos: number,
  createdAt: string,
  repos: GitHubUserRepoGQL[],
): UserSignals {
  const accountAgeMs = Date.now() - new Date(createdAt).getTime();
  const accountAgeYears = accountAgeMs / (1000 * 60 * 60 * 24 * 365.25);

  // ── Languages by repo count ───────────────────────────────────────────────
  const langCount: Record<string, number> = {};
  const topicCount: Record<string, number> = {};
  const keywordCount: Record<string, number> = {};
  const repoNames: string[] = repos.map((r) => r.name);

  for (const repo of repos) {
    if (repo.primaryLanguage?.name) {
      const lang = repo.primaryLanguage.name;
      langCount[lang] = (langCount[lang] ?? 0) + 1;
    }
    for (const topicNode of repo.repositoryTopics?.nodes ?? []) {
      const t = topicNode.topic.name.toLowerCase();
      topicCount[t] = (topicCount[t] ?? 0) + 1;
    }
    // keyword extraction from description
    const desc = repo.description ?? "";
    const words = desc
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length > 3);
    for (const w of words) {
      keywordCount[w] = (keywordCount[w] ?? 0) + 1;
    }
  }

  const signals: Signal[] = [];

  // Top-5 languages
  const sortedLangs = Object.entries(langCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  for (const [lang, count] of sortedLangs) {
    signals.push({ id: lang, kind: "language", count });
  }

  // Top-4 topics (excluding trivial ones)
  const stopTopics = new Set([
    "hacktoberfest",
    "github",
    "open-source",
    "opensource",
  ]);
  const sortedTopics = Object.entries(topicCount)
    .filter(([t]) => !stopTopics.has(t))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);
  for (const [topic, count] of sortedTopics) {
    signals.push({ id: topic, kind: "topic", count });
  }

  // Level: beginner if account < 2y or < 30 public repos
  const level: SkillLevel =
    accountAgeYears < 2 || publicRepos < 30 ? "beginner" : "intermediate";

  // Summary text
  const topLangs = sortedLangs
    .slice(0, 2)
    .map(([l]) => l)
    .join(" and ");
  const pct = (n: number) =>
    repos.length > 0 ? Math.round((n / repos.length) * 100) : 0;
  const langPctStr = sortedLangs
    .slice(0, 2)
    .map(([l, c]) => `${l} (${pct(c)}%)`)
    .join(" and ");

  const ageParts: string[] = [];
  const ageYears = Math.floor(accountAgeYears);
  const ageMonths = Math.round((accountAgeYears - ageYears) * 12);
  if (ageYears > 0) ageParts.push(`${ageYears}y`);
  if (ageMonths > 0) ageParts.push(`${ageMonths}m`);
  const ageStr = ageParts.join(" ") || "<1m";

  const summaryText = [
    `${publicRepos} public repos`,
    topLangs ? `mostly ${langPctStr}` : null,
    `Account is ${ageStr} old`,
    level === "beginner"
      ? "so projects with beginner issues are ranked higher."
      : "so intermediate projects are included.",
  ]
    .filter(Boolean)
    .join(", ");

  return {
    username,
    avatarUrl,
    publicRepos,
    accountAgeYears,
    signals,
    level,
    summaryText,
    repoNames,
  };
}
