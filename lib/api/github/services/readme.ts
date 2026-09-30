import { githubGraphQL } from "../client";
import { NotFoundError } from "../errors";
import { GET_REPO_README_QUERY } from "../queries/repo.query";

interface ReadmeResponse {
  repository: { object: { text: string | null } | null } | null;
}

export async function getRepoReadme(
  owner: string,
  name: string,
): Promise<string | null> {
  const data = await githubGraphQL<ReadmeResponse>(GET_REPO_README_QUERY, {
    owner,
    name,
  });
  if (!data.repository)
    throw new NotFoundError(`Repository "${owner}/${name}"`);
  return data.repository.object?.text ?? null;
}
