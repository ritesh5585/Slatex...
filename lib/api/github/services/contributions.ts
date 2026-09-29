import { githubGraphQL } from "../client";
import { GET_CONTRIBUTIONS_QUERY } from "../queries/contributions.query";
import { NotFoundError } from "../errors";
import type { ContributionCalendar } from "../types";

interface ContributionsResponse {
  user: {
    contributionsCollection: { contributionCalendar: ContributionCalendar };
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
