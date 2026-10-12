import { githubGraphQL } from "../client";
import { GET_COMMIT_HISTORY_QUERY } from "../queries/commits.query";
import { cached } from "@/lib/cache";
import { enforceLimit } from "@/lib/rate-limiter";
import type { CommitNode } from "../types";

interface CommitHistoryResponse {
  repository: {
    defaultBranchRef: {
      target: {
        history: { totalCount: number; edges: { node: CommitNode }[] };
      } | null;
    } | null;
  } | null;
}

export const getCommitHistory = (
  owner: string,
  name: string,
  first: number = 100,
  since?: string,
) =>
  cached(
    `gh:v1:commits:${owner}/${name}:${first}:${since ?? "all"}`.toLowerCase(),
    300,
    async () => {
      await enforceLimit();
      const data = await githubGraphQL<CommitHistoryResponse>(
        GET_COMMIT_HISTORY_QUERY,
        {
          owner,
          name,
          first,
          since: since ?? null,
        },
      );
      const edges =
        data.repository?.defaultBranchRef?.target?.history.edges ?? [];
      return edges.map((e) => e.node);
    },
  );

// Pure function — no caching needed
export function aggregateCommitsByDay(commits: CommitNode[]) {
  const daily = new Map<
    string,
    { date: string; commits: number; additions: number; deletions: number }
  >();
  for (const commit of commits) {
    const date = commit.committedDate.split("T")[0];
    const existing = daily.get(date) ?? {
      date,
      commits: 0,
      additions: 0,
      deletions: 0,
    };
    existing.commits += 1;
    existing.additions += commit.additions;
    existing.deletions += commit.deletions;
    daily.set(date, existing);
  }
  return [...daily.values()].sort((a, b) => a.date.localeCompare(b.date));
}
