// lib/cache.ts
import { redis } from "./redis";

export async function cached<T>(
  key: string,
  ttl: number,
  loader: () => Promise<T>,
): Promise<T> {
  try {
    const hit = await redis.get<T>(key);
    if (hit !== null) return hit;
  } catch (e) {
    console.error("cache get failed", e);
  } // Redis down ≠ app down
  const fresh = await loader();
  try {
    await redis.set(key, fresh, { ex: ttl });
  } catch (e) {
    console.error("cache set failed", e);
  }
  return fresh;
}
    