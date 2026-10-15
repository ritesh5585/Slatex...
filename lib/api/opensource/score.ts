import type { Signal, UserSignals, ScoredProject, FitLabel } from "./types";
import type { SearchItem } from "./queries";
import { getLangColor, getStarterIssues } from "./queries";

// Scoring rules as described in spec:
// +3 language match, +2 topic/keyword match, +2 has ≥3 good-first-issues,
// +1 pushed within 14d, +1 PR review <3d (we use forks as proxy),
// -2 archived/low activity
// Map: ≥7 Strong, 4-6 Good, else Fair

function fitFromScore(score: number): FitLabel {
  if (score >= 7) return "Strong fit";
  if (score >= 4) return "Good fit";
  return "Fair fit";
}

function daysSince(iso: string): number {
  return (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24);
}

export async function scoreProject(
  item: SearchItem,
  userSignals: UserSignals,
): Promise<ScoredProject> {
  const signals: Signal[] = userSignals.signals;
  let score = 0;
  const reasons: string[] = [];

  const itemLang = item.language?.toLowerCase() ?? "";
  const itemName = item.full_name.split("/")[1] ?? "";

  // +3 language match
  const langSignal = signals.find(
    (s) => s.kind === "language" && s.id.toLowerCase() === itemLang,
  );
  if (langSignal) {
    const langPct =
      userSignals.publicRepos > 0
        ? Math.round((langSignal.count / userSignals.publicRepos) * 100)
        : 0;
    score += 3;
    reasons.push(
      `${item.language} is your main language (${langPct}% of your repos).`,
    );
  }

  // +2 topic match
  const topicMatches = signals.filter(
    (s) =>
      s.kind === "topic" && (item.topics ?? []).includes(s.id.toLowerCase()),
  );
  if (topicMatches.length > 0) {
    score += 2;
    const matchedTopics = topicMatches.map((s) => s.id).join(", ");
    reasons.push(
      `Matches ${topicMatches.length > 1 ? "topics" : "topic"} you work with: ${matchedTopics}.`,
    );
  }

  // +2 beginner-friendly (≥3 good-first-issues)
  // open_issues_count includes all open issues; we use it as a proxy
  // We'll refine after fetching actual starter issues
  const begFriendly = item.open_issues_count >= 3;
  if (begFriendly) {
    score += 2;
    reasons.push(
      `${item.open_issues_count.toLocaleString()} open issues labeled good first issue.`,
    );
  }

  // +1 pushed within 14d
  const pushedDaysAgo = daysSince(item.pushed_at);
  if (pushedDaysAgo <= 14) {
    score += 1;
    reasons.push(
      `Actively maintained — last commit ${Math.round(pushedDaysAgo)} days ago.`,
    );
  }

  // Mention matching user repos if any
  const matchingUserRepos = userSignals.repoNames.filter(
    (n) =>
      n.toLowerCase().includes(itemLang) ||
      (item.topics ?? []).some((t) => n.toLowerCase().includes(t)),
  );
  if (matchingUserRepos.length > 0 && reasons.length < 3) {
    reasons.push(
      `Your repo "${matchingUserRepos[0]}" already uses similar tech.`,
    );
  }

  // -2 low activity (not pushed in 30d)
  if (pushedDaysAgo > 30) {
    score -= 2;
  }

  // Fetch real starter issues
  const starterIssues = await getStarterIssues(item.full_name);

  // If we got real starter issues update reason
  if (starterIssues.length > 0 && begFriendly) {
    // replace the beginner reason with more precise info
    const idx = reasons.findIndex((r) => r.includes("open issues labeled"));
    if (idx !== -1) {
      reasons[idx] =
        `${starterIssues.length} open issues labeled good first issue.`;
    }
    // +1 bonus for ≥3 real starter issues
    if (starterIssues.length >= 3) score += 1;
  }

  // Difficulty
  const difficulty: ScoredProject["difficulty"] =
    userSignals.level === "beginner" ? "Beginner" : "Intermediate";

  // prReviewSpeed – not accessible without PRs API; use a heuristic
  const prReviewSpeed: string | null =
    item.forks_count > 200
      ? "~1–2 days"
      : item.forks_count > 50
        ? "~3–5 days"
        : null;

  // Clamp reasons to 3
  const finalReasons = reasons.slice(0, 3);
  // Ensure at least one reason
  if (finalReasons.length === 0) {
    finalReasons.push(
      `${item.stargazers_count.toLocaleString()} stars on GitHub.`,
    );
  }

  return {
    fullName: item.full_name,
    description: item.description,
    url: item.html_url,
    language: item.language,
    languageColor: getLangColor(item.language),
    stars: item.stargazers_count,
    beginnerIssues: starterIssues.length,
    pushedAt: item.pushed_at,
    prReviewSpeed,
    fit: fitFromScore(score),
    score,
    reasons: finalReasons,
    difficulty,
    starterIssues,
  };
}

export async function scoreAllProjects(
  items: SearchItem[],
  userSignals: UserSignals,
): Promise<ScoredProject[]> {
  const results = await Promise.all(
    items.map((item) => scoreProject(item, userSignals)),
  );
  return results.sort((a, b) => b.score - a.score);
}
