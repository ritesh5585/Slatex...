import { githubGraphQL } from "../client";
import { GET_USER_QUERY } from "../queries/user.query";
import { NotFoundError } from "../errors";
import type { GitHubUserGQL } from "../types";

interface UserResponse {
  user: GitHubUserGQL | null;
}

export async function getUserByUsername(
  username: string,
): Promise<GitHubUserGQL> {
  const data = await githubGraphQL<UserResponse>(GET_USER_QUERY, { username });
  if (!data.user) throw new NotFoundError(`User "${username}"`);
  return data.user;
}
