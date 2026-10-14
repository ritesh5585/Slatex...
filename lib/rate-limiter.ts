import { Ratelimit } from "@upstash/ratelimit";
import { headers } from "next/headers";
import { redis } from "./redis";
import { ClientRateLimitError } from "./api/with-github-errors";

const limiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(60, "1 h"),
      prefix: "rl:gh-miss",
      analytics: false,
    })
  : null;

export async function enforceLimit(reason: string) {
  if (!limiter) {
    console.log(`[rl] skip (no limiter) reason=${reason}`);
    return;
  }

  const h = await headers();
  const id =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    "local";

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
