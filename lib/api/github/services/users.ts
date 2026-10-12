import { githubGraphQL } from "../client";
import { GET_USER_QUERY, GET_USER_REPOS_QUERY } from "../queries/user.query";
import { NotFoundError } from "@/lib/api/with-github-errors";
import { cached } from "@/lib/cache";
import { enforceLimit } from "@/lib/rate-limiter";
import type { GitHubUserGQL, GitHubUserRepoGQL } from "../types";

interface UserResponse {
  user: GitHubUserGQL | null;
}

interface UserReposResponse {
  user: {
    repositories: { nodes: GitHubUserRepoGQL[] };
  } | null;
}

export const getUserByUsername = (username: string) =>
  cached(`gh:v1:user:${username.toLowerCase()}`, 600, async () => {
    await enforceLimit();
    const data = await githubGraphQL<UserResponse>(GET_USER_QUERY, {
      username,
    });
    if (!data.user) throw new NotFoundError(`User "${username}"`);
    return data.user;
  });

export async function getUserRepos(
  username: string,
  first: number = 100,
): Promise<GitHubUserRepoGQL[]> {
  const data = await githubGraphQL<UserReposResponse>(GET_USER_REPOS_QUERY, {
    username,
    first,
  });
  if (!data.user) throw new NotFoundError(`User "${username}"`);
  return data.user.repositories.nodes;
}
