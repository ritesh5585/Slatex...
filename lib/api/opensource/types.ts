export type SignalKind = "language" | "topic" | "keyword";

export interface Signal {
  id: string;
  kind: SignalKind;
  count: number;
}

export type SkillLevel = "beginner" | "intermediate";

export interface UserSignals {
  username: string;
  avatarUrl: string;
  publicRepos: number;
  accountAgeYears: number;
  signals: Signal[];
  level: SkillLevel;
  summaryText: string;
  repoNames: string[];
}

export type FitLabel = "Strong fit" | "Good fit" | "Fair fit";

export interface StarterIssue {
  number: number;
  title: string;
  url: string;
  labels: string[];
}

export interface ScoredProject {
  /** "owner/repo" */
  fullName: string;
  description: string | null;
  url: string;
  language: string | null;
  languageColor: string | null;
  stars: number;
  beginnerIssues: number;
  /** last pushed date ISO string */
  pushedAt: string;
  /** rough PR review speed */
  prReviewSpeed: string | null;
  fit: FitLabel;
  score: number;
  /** plain-sentence explanations */
  reasons: string[];
  difficulty: "Beginner" | "Intermediate";
  starterIssues: StarterIssue[];
}

export type FindProjectsResult =
  | { status: "ok"; userSignals: UserSignals; projects: ScoredProject[] }
  | { status: "not_found" }
  | { status: "rate_limited"; retryAfter: number }
  | { status: "no_signals" }
  | { status: "error"; message: string };
