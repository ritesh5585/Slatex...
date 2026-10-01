import { githubGraphQL } from "../client";
import {
  GET_CONTRIBUTIONS_QUERY,
  GET_USER_COMMIT_CONTRIBUTIONS_QUERY,
} from "../queries/contributions.query";
import { NotFoundError } from "../errors";
import type {
  ContributionCalendar,
  RepoCommitContribution,
  UserCommitActivity,
} from "../types";

interface ContributionsResponse {
  user: {
    contributionsCollection: { contributionCalendar: ContributionCalendar };
  } | null;
}

interface CommitContributionsResponse {
  user: {
    contributionsCollection: {
      totalCommitContributions: number;
      totalRepositoriesWithContributedCommits: number;
      contributionCalendar: ContributionCalendar;
      commitContributionsByRepository: RepoCommitContribution[];
    };
  } | null;
}

export async function getUserContributions(username: string) {
  const data = await githubGraphQL<ContributionsResponse>(
    GET_CONTRIBUTIONS_QUERY,
    { username },
  );
  if (!data.user) throw new NotFoundError(`User "${username}"`);
  const calendar = data.user.contributionsCollection.contributionCalendar;
  return {
    totalContributions: calendar.totalContributions,
    contributions: calendar.weeks.flatMap((w) => w.contributionDays),
  };
}

export async function getUserCommitActivity(
  username: string,
): Promise<UserCommitActivity> {
  const data = await githubGraphQL<CommitContributionsResponse>(
    GET_USER_COMMIT_CONTRIBUTIONS_QUERY,
    { username },
  );
  if (!data.user) throw new NotFoundError(`User "${username}"`);
  const collection = data.user.contributionsCollection;
  const calendar = collection.contributionCalendar;
  return {
    totalCommitContributions: collection.totalCommitContributions,
    totalRepositoriesWithContributedCommits:
      collection.totalRepositoriesWithContributedCommits,
    totalContributions: calendar.totalContributions,
    contributions: calendar.weeks.flatMap((w) => w.contributionDays),
    repoCommitContributions: collection.commitContributionsByRepository || [],
  };
}
