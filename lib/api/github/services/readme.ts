import { githubGraphQL } from "../client";
import { NotFoundError } from "@/lib/api/with-github-errors";
import { GET_REPO_README_QUERY } from "../queries/repo.query";
import { cached } from "@/lib/cache";
import { enforceLimit } from "@/lib/rate-limiter";

interface ReadmeResponse {
  repository: { object: { text: string | null } | null } | null;
}


export const getRepoReadme = (
  owner: string,
  name: string,
): Promise<string | null> =>
  cached(`gh:v1:readme:${owner}/${name}`.toLowerCase(), 1800, async () => {
    await enforceLimit();
    const data = await githubGraphQL<ReadmeResponse>(GET_REPO_README_QUERY, {
      owner,
      name,
    });
    if (!data.repository)
      throw new NotFoundError(`Repository "${owner}/${name}"`);
    return data.repository.object?.text ?? null;
  });
