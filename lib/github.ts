export interface GitHubCommit {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author: { name: string; date: string } | null;
  };
  author: { login: string; avatar_url: string; html_url: string } | null;
}

export interface GitHubContributor {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

export interface GitHubRepository {
  name: string;
  description: string | null;
  html_url: string;
  updated_at: string;
  language: string | null;
  topics?: string[];
  private?: boolean;
  archived?: boolean;
  license?: { spdx_id: string | null } | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
}

export interface GitHubCommitActivityWeek {
  week: number;
  total: number;
  days: number[];
  never: number
}