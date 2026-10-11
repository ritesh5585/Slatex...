export interface GitHubUserGQL {
  login: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  location: string | null;
  company: string | null;
  websiteUrl: string | null;
  followers: { totalCount: number };
  following: { totalCount: number };
  repositories: { totalCount: number };
  createdAt: string;
  url: string;
}

export interface GitHubRepoGQL {
  name: string;
  owner: { login: string; avatarUrl: string };
  description: string | null;
  url: string;
  homepageUrl: string | null;
  stargazerCount: number;
  forkCount: number;
  watchers: { totalCount: number };
  issues: { totalCount: number };
  pullRequests: { totalCount: number };
  primaryLanguage: { name: string; color: string } | null;
  repositoryTopics: { nodes: { topic: { name: string } }[] };
  licenseInfo: { name: string; spdxId: string } | null;
  defaultBranchRef: { name: string } | null;
  isPrivate: boolean;
  isArchived: boolean;
  updatedAt: string;
  pushedAt: string;
  createdAt: string;
  isFork: boolean;
}

export interface CommitNode {
  oid: string;
  committedDate: string;
  additions: number;
  deletions: number;
  message: string;
  author: {
    name: string | null;
    avatarUrl: string | null;
    user: { login: string; url: string } | null;
  } | null;
}

export interface ContributionDay {
  date: string;
  contributionCount: number;
}

export interface ContributionCalendar {
  totalContributions: number;
  weeks: { contributionDays: ContributionDay[] }[];
}

export interface GitHubUserRepoGQL {
  id: string;
  name: string;
  description: string | null;
  url: string;
  stargazerCount: number;
  forkCount: number;
  updatedAt: string;
  primaryLanguage: { name: string; color: string } | null;
  repositoryTopics: { nodes: { topic: { name: string } }[] };
}

export interface RepoCommitContribution {
  repository: {
    id: string;
    name: string;
    description: string | null;
    url: string;
    stargazerCount: number;
    forkCount: number;
    updatedAt: string;
    isPrivate: boolean;
    primaryLanguage: { name: string; color: string } | null;
    owner: { login: string; avatarUrl: string };
  };
  contributions: {
    totalCount: number;
    nodes: {
      occurredAt: string;
      commitCount: number;
      url: string;
    }[];
  };
}

export interface UserCommitActivity {
  totalCommitContributions: number;
  totalRepositoriesWithContributedCommits: number;
  totalContributions: number;
  contributions: ContributionDay[];
  repoCommitContributions: RepoCommitContribution[];
}

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
}

export interface GitHubUser {
  avatar_url: string;
  name: string | null;
  login: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  blog: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  html_url: string;
}

export interface GitHubRepo {
  id: string;
  name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics?: string[];
}

export interface ComparedUser {
  login: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  location: string | null;
  company: string | null;
  url: string;
  createdAt: string;
  joinedFormatted: string;
  followers: number;
  following: number;
  publicRepos: number;
  totalStars: number;
  totalContributions: number;
  totalCommits: number;
  languages: { name: string; count: number; color: string; percent: number }[];
  topRepos: {
    id: string;
    name: string;
    description: string | null;
    url: string;
    stars: number;
    forks: number;
    language: string | null;
    languageColor: string | null;
  }[];
}

export interface MonthlyPoint {
  month: string;
  u1: number;
  u2: number;
}

export interface ComparisonInsight {
  verdict: string;
  overallWinner: string;
  winnerName: string;
  score: { u1Wins: number; u2Wins: number };
  moreProjects: { winner: string; count: number; diff: number };
  bestContent: {
    winner: string;
    stars: number;
    topRepo: string;
    topRepoStars: number;
  };
  mostActive: { winner: string; contributions: number; commits: number };
  languageAnalysis: {
    u1Primary: string;
    u2Primary: string;
    u1Langs: string[];
    u2Langs: string[];
    sharedLangs: string[];
    summary: string;
  };
  strengths: {
    u1: string[];
    u2: string[];
  };
}

export interface ComparisonResult {
  user1: ComparedUser;
  user2: ComparedUser;
  monthlyData: MonthlyPoint[];
  insight: ComparisonInsight;
}