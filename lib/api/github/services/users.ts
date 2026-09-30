import { githubGraphQL } from "../client";
import {
  GET_USER_QUERY,
  GET_USER_REPOS_QUERY,
} from "../queries/user.query";
import { NotFoundError } from "../errors";
import type { GitHubUserGQL, GitHubUserRepoGQL } from "../types";

interface UserResponse {
  user: GitHubUserGQL | null;
}

interface UserReposResponse {
  user: {
    repositories: { nodes: GitHubUserRepoGQL[] };
  } | null;
}

export async function getUserByUsername(
  username: string,
): Promise<GitHubUserGQL> {
  const data = await githubGraphQL<UserResponse>(GET_USER_QUERY, { username });
  if (!data.user) throw new NotFoundError(`User "${username}"`);
  return data.user;
}

export async function getUserRepos(
  username: string,
): Promise<GitHubUserRepoGQL[]> {
  const data = await githubGraphQL<UserReposResponse>(GET_USER_REPOS_QUERY, {
    username,
  });
  if (!data.user) throw new NotFoundError(`User "${username}"`);
  return data.user.repositories.nodes;
}
