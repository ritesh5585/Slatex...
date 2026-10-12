// lib/cache.ts
import { redis } from "./redis";

/**
 * Null-safe generic cache wrapper.
 *
 * Bug fix: the old version stored bare values, so when loader() returned
 * null (e.g. getRepoReadme for a repo with no README) Redis stored `null`,
 * which is indistinguishable from a cache MISS.  We now wrap every value in
 * { v: T } so that `{ v: null }` is a valid HIT and we never re-fetch.
 */
export async function cached<T>(
  key: string,
  ttl: number,
  loader: () => Promise<T>,
): Promise<T> {
  if (redis) {
    try {
      const hit = await redis.get<{ v: T }>(key);
      if (hit !== null) {
        console.log(JSON.stringify({ evt: "cache", hit: true, key }));
        return hit.v;
      }
    } catch (e) {
      console.error("cache get failed", e);
    }
  }

  console.log(JSON.stringify({ evt: "cache", hit: false, key }));
  const fresh = await loader();

  if (redis) {
    try {
      await redis.set(key, { v: fresh }, { ex: ttl });
    } catch (e) {
      console.error("cache set failed", e);
    }
  }

  return fresh;
}
