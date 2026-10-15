import { githubGraphQL } from "../client";
import { GET_PROFILE_BUNDLE_QUERY } from "../queries/bundles.query";
import { NotFoundError } from "@/lib/api/with-github-errors";
import { cached } from "@/lib/cache";
import { enforceLimit } from "@/lib/rate-limiter";
import type {
  GitHubUserGQL,
  GitHubUserRepoGQL,
  ContributionDay,
} from "../types";

// ── Raw GQL response shape ────────────────────────────────────────────────────
interface ProfileBundleResponse {
  rateLimit: { cost: number; remaining: number; resetAt: string };
  user:
    | (GitHubUserGQL & {
        repoList: { nodes: GitHubUserRepoGQL[] };
        contributionsCollection: {
          contributionCalendar: {
            totalContributions: number;
            weeks: { contributionDays: ContributionDay[] }[];
          };
        };
      })
    | null;
}

// ── Public return type ────────────────────────────────────────────────────────
export interface ProfileBundle {
  user: GitHubUserGQL;
  repos: GitHubUserRepoGQL[];
  contributions: {
    totalContributions: number;
    contributions: ContributionDay[];
  };
}

// ── Loader ───────────────────────────────────────────────────────────────────
export const getProfileBundle = (
  username: string,
  reposFirst: number = 100,
  skipRateLimit: boolean = false,
): Promise<ProfileBundle> =>
  cached(
    `gh:v1:profile-bundle:${username.toLowerCase()}:${reposFirst}`,
    600,
    async () => {
      if (!skipRateLimit) {
        await enforceLimit("gh/profile-bundle");
      }
      const data = await githubGraphQL<ProfileBundleResponse>(
        GET_PROFILE_BUNDLE_QUERY,
        { username, reposFirst },
      );

      const rl = data.rateLimit;
      console.log(
        `[rl] bundle=profile-bundle cost=${rl.cost} remaining=${rl.remaining}`,
      );

      if (!data.user) throw new NotFoundError(`User "${username}"`);

      const calendar = data.user.contributionsCollection.contributionCalendar;

      return {
        user: data.user,
        repos: data.user.repoList.nodes,
        contributions: {
          totalContributions: calendar.totalContributions,
          contributions: calendar.weeks.flatMap((w) => w.contributionDays),
        },
      };
    },
  );
