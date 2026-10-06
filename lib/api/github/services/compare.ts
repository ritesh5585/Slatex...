import { getUserByUsername, getUserRepos } from "./users";
import { getUserContributions, getUserCommitActivity } from "./contributions";
import { GitHubUserGQL, GitHubUserRepoGQL, UserCommitActivity } from "../types";
import { computeStreaks } from "@/components/user/contro-streaks";

export interface ComparedUser {
  profile: GitHubUserGQL;
  repos: GitHubUserRepoGQL[];
  commitActivity: UserCommitActivity;
  contributions: { date: string; contributionCount: number }[];
  derived: {
    totalStars: number;
    totalForks: number;
    topLanguages: [string, number][];
    avgCommitsPerWeek: number;
    longestStreak: number;
    currentStreak: number;
    activeDays: number;
  };
}

export async function compareUsers(usernames: string): Promise<ComparedUser> {
  const [profile, repos, commitActivity, contriData] = await Promise.all([
    getUserByUsername(usernames),
    getUserRepos(usernames, 100),
    getUserCommitActivity(usernames),
    getUserContributions(usernames),
  ]);

  const contributions = contriData.contributions;

  const totalStars = repos.reduce((acc, repo) => acc + repo.stargazerCount, 0);
  const totalForks = repos.reduce((acc, repo) => acc + repo.forkCount, 0);

  const langMap = new Map<string, number>();
  repos.forEach((repo) => {
    if (repo.primaryLanguage?.name) {
      langMap.set(
        repo.primaryLanguage.name,
        (langMap.get(repo.primaryLanguage.name) ?? 0) + 1,
      );
    }
  });
  const topLanguages = Array.from(langMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  // Streaks (reuse logic from components/user/contro-streaks.tsx — extract it)
  const { current, longest, activeDays } = computeStreaks(contributions);

  const avgCommitsPerWeek =
    contributions.length > 0
      ? Math.round(
          (contributions.reduce((s, d) => s + d.contributionCount, 0) /
            contributions.length) *
            7,
        )
      : 0;

  return {
    profile,
    repos,
    commitActivity,
    contributions,
    derived: {
      totalStars,
      totalForks,
      topLanguages,
      avgCommitsPerWeek,
      activeDays,
      longestStreak: longest,
      currentStreak: current,
    },
  };
}
