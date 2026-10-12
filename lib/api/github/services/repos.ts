import { githubGraphQL } from "../client";
import {
  GET_REPO_QUERY,
  GET_REPO_LANGUAGES_QUERY,
} from "../queries/repo.query";
import { NotFoundError } from "@/lib/api/with-github-errors";
import { cached } from "@/lib/cache";
import { enforceLimit } from "@/lib/rate-limiter";
import type { GitHubRepoGQL } from "../types";

interface RepoResponse {
  repository: GitHubRepoGQL | null;
}

interface LanguagesResponse {
  repository: {
    languages: {
      edges: { size: number; node: { name: string; color: string } }[];
    };
  } | null;
}

export const getRepo = (owner: string, name: string): Promise<GitHubRepoGQL> =>
  cached(`gh:v1:repo:${owner}/${name}`.toLowerCase(), 600, async () => {
    await enforceLimit();
    const data = await githubGraphQL<RepoResponse>(GET_REPO_QUERY, {
      owner,
      name,
    });
    if (!data.repository)
      throw new NotFoundError(`Repository "${owner}/${name}"`);
    return data.repository;
  });

export const getRepoLanguages = (
  owner: string,
  name: string,
): Promise<{ size: number; node: { name: string; color: string } }[]> =>
  cached(`gh:v1:repo-langs:${owner}/${name}`.toLowerCase(), 1800, async () => {
    await enforceLimit();
    const data = await githubGraphQL<LanguagesResponse>(
      GET_REPO_LANGUAGES_QUERY,
      { owner, name },
    );
    return data.repository?.languages.edges ?? [];
  });
