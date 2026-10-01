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
