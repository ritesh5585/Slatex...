import { githubGraphQL } from "../client";
import {
  GET_REPO_QUERY,
  GET_REPO_LANGUAGES_QUERY,
} from "../queries/repo.query";
import { NotFoundError } from "../errors";
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

export async function getRepo(
  owner: string,
  name: string,
): Promise<GitHubRepoGQL> {
  const data = await githubGraphQL<RepoResponse>(GET_REPO_QUERY, {
    owner,
    name,
  });
  if (!data.repository)
    throw new NotFoundError(`Repository "${owner}/${name}"`);
  return data.repository;
}

export async function getRepoLanguages(
  owner: string,
  name: string,
): Promise<{ size: number; node: { name: string; color: string } }[]> {
  const data = await githubGraphQL<LanguagesResponse>(
    GET_REPO_LANGUAGES_QUERY,
    { owner, name },
  );
  return data.repository?.languages.edges ?? [];
}
