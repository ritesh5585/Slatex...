import { githubGraphQL } from "../client";
import { GET_USER_QUERY } from "../queries/user.query";
import { NotFoundError } from "@/lib/api/with-github-errors";
import { cached } from "@/lib/cache";
import { enforceLimit } from "@/lib/rate-limiter";
import type { GitHubUserGQL } from "../types";

interface UserResponse {
  user: GitHubUserGQL | null;
}

export const getUserByUsername = (username: string) =>
  cached(`gh:v1:user:${username.toLowerCase()}`, 600, async () => {
    await enforceLimit("gh/user");
    const data = await githubGraphQL<UserResponse>(GET_USER_QUERY, {
      username,
    });
    if (!data.user) throw new NotFoundError(`User "${username}"`);
    return data.user;
  });

