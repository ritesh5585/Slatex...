/**
 * getRepoBundle — fetches repo metadata + languages + readme in a single
 * GraphQL round-trip, consuming exactly 1 rate-limit unit instead of 3.
 *
 * Cache TTL: 600 s  (min of: repo=600, langs=1800, readme=1800)
 * Cache key: gh:v1:repo-bundle:<owner>/<name>
 *
 * Commits are intentionally NOT bundled here:
 *   - They accept a variable `first` parameter (30 for timeline, 100 for full)
 *   - They have their own TTL (300 s, much shorter than repo meta)
 *   - getCommitHistory is still called independently on the /repo page.
 */
import { githubGraphQL } from "../client";
import { GET_REPO_BUNDLE_QUERY } from "../queries/bundles.query";
import { NotFoundError } from "@/lib/api/with-github-errors";
import { cached } from "@/lib/cache";
import { enforceLimit } from "@/lib/rate-limiter";
import type { GitHubRepoGQL } from "../types";

// ── Raw GQL response shape ────────────────────────────────────────────────────
interface RepoBundleResponse {
  rateLimit: { cost: number; remaining: number; resetAt: string };
  repository: (GitHubRepoGQL & {
    languages: {
      edges: { size: number; node: { name: string; color: string } }[];
    };
    readmeMd:    { text: string | null } | null;
    readmeLower: { text: string | null } | null;
    readmeRst:   { text: string | null } | null;
    readmeTxt:   { text: string | null } | null;
  }) | null;
}

// ── Public return type ────────────────────────────────────────────────────────
export interface RepoBundle {
  repo: GitHubRepoGQL;
  languageEdges: { size: number; node: { name: string; color: string } }[];
  /** Resolved readme text (first non-null variant wins), or null if absent. */
  readme: string | null;
}

// ── Loader ───────────────────────────────────────────────────────────────────
export const getRepoBundle = (
  owner: string,
  name: string,
): Promise<RepoBundle> =>
  cached(
    `gh:v1:repo-bundle:${owner}/${name}`.toLowerCase(),
    600,
    async () => {
      await enforceLimit("gh/repo-bundle");
      const data = await githubGraphQL<RepoBundleResponse>(
        GET_REPO_BUNDLE_QUERY,
        { owner, name },
      );

      const rl = data.rateLimit;
      console.log(
        `[rl] bundle=repo-bundle cost=${rl.cost} remaining=${rl.remaining}`,
      );

      if (!data.repository)
        throw new NotFoundError(`Repository "${owner}/${name}"`);

      const r = data.repository;

      // Pick first non-null README variant (MD preferred)
      const readme =
        r.readmeMd?.text ??
        r.readmeLower?.text ??
        r.readmeRst?.text ??
        r.readmeTxt?.text ??
        null;

      return {
        repo: r,
        languageEdges: r.languages.edges,
        readme,
      };
    },
  );
