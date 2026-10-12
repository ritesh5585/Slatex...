import { Ratelimit } from "@upstash/ratelimit";
import { headers } from "next/headers";
import { redis } from "./redis";
import { ClientRateLimitError } from "./api/with-github-errors";

const limiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, "1 h"),
  prefix: "rl:gh-miss",
  analytics: false,
});

export async function enforceLimit() {
  const h = await headers();
  const id =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    "local";
  const { success, reset } = await limiter.limit(id);
  if (!success)
    throw new ClientRateLimitError(
      Math.max(1, Math.ceil((reset - Date.now()) / 1000)),
    );
}
