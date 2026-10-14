import { githubGraphQL } from "../client";
import { GET_REPO_QUERY } from "../queries/repo.query";
import { NotFoundError } from "@/lib/api/with-github-errors";
import { cached } from "@/lib/cache";
import { enforceLimit } from "@/lib/rate-limiter";
import type { GitHubRepoGQL } from "../types";

interface RepoResponse {
  repository: GitHubRepoGQL | null;
}

export const getRepo = (owner: string, name: string): Promise<GitHubRepoGQL> =>
  cached(`gh:v1:repo:${owner}/${name}`.toLowerCase(), 600, async () => {
    await enforceLimit("gh/repo");
    const data = await githubGraphQL<RepoResponse>(GET_REPO_QUERY, {
      owner,
      name,
    });
    if (!data.repository)
      throw new NotFoundError(`Repository "${owner}/${name}"`);
    return data.repository;
  });

