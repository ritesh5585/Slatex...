import { getProfileBundle } from "../github/services/profile-bundle";
import { getUserSignals } from "./skills";
import { searchProjects } from "./queries";
import { scoreAllProjects } from "./score";
import { cached } from "@/lib/cache";
import type { FindProjectsResult } from "./types";

export async function findProjectsForUser(
  username: string,
): Promise<FindProjectsResult> {
  let bundle: Awaited<ReturnType<typeof getProfileBundle>>;
  try {
    bundle = await getProfileBundle(username);
  } catch (err: unknown) {
    const errName = (err as Error)?.name ?? "";
    if (errName === "NotFoundError") return { status: "not_found" };
    if (errName === "RateLimitError" || errName === "ClientRateLimitError") {
      const retryAfter = (err as { retryAfter?: number }).retryAfter ?? 3600;
      return { status: "rate_limited", retryAfter };
    }
    return {
      status: "error",
      message: (err as Error)?.message ?? "Unknown error",
    };
  }

  const { user, repos } = bundle;

  const userSignals = getUserSignals(
    user.login,
    user.avatarUrl,
    user.repositories.totalCount,
    user.createdAt,
    repos,
  );

  if (userSignals.signals.length === 0) {
    return { status: "no_signals" };
  }

  // Cache the expensive search+score step
  const cacheKey = `os:v1:find:${username.toLowerCase()}`;
  const projects = await cached(cacheKey, 600, async () => {
    const items = await searchProjects(userSignals.signals, userSignals.level);
    if (items.length === 0) return [];
    return scoreAllProjects(items, userSignals);
  });

  return { status: "ok", userSignals, projects };
}
