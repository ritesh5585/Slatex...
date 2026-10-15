import { Ratelimit } from "@upstash/ratelimit";
import { headers } from "next/headers";
import { redis } from "./redis";
import { ClientRateLimitError } from "./api/with-github-errors";

// Standard limiter for GitHub data lookups (60 req/hr per IP)
const limiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(60, "1 h"),
      prefix: "rl:gh-miss",
      analytics: false,
    })
  : null;

// Dedicated separate limiter for Find Projects / Find Repo (20 req/hr per IP)
const findRepoLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, "1 h"),
      prefix: "rl:find-repo",
      analytics: false,
    })
  : null;

async function getClientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    "local"
  );
}

export async function enforceLimit(reason: string) {
  if (!limiter) {
    console.log(`[rl] skip (no limiter) reason=${reason}`);
    return;
  }

  const id = await getClientIp();

  console.log(`[rl] consuming unit reason=${reason} ip=${id}`);
  const { success, reset, remaining } = await limiter.limit(id);
  console.log(
    `[rl] result reason=${reason} success=${success} remaining=${remaining}`,
  );
  if (!success)
    throw new ClientRateLimitError(
      Math.max(1, Math.ceil((reset - Date.now()) / 1000)),
    );
}

export async function enforceFindRepoLimit(reason = "find/repo") {
  if (!findRepoLimiter) {
    console.log(`[rl:find] skip (no limiter) reason=${reason}`);
    return;
  }

  const id = await getClientIp();

  console.log(`[rl:find] consuming unit reason=${reason} ip=${id}`);
  const { success, reset, remaining } = await findRepoLimiter.limit(id);
  console.log(
    `[rl:find] result reason=${reason} success=${success} remaining=${remaining}`,
  );
  if (!success)
    throw new ClientRateLimitError(
      Math.max(1, Math.ceil((reset - Date.now()) / 1000)),
    );
}

export const enforceFindLimit = enforceFindRepoLimit;
