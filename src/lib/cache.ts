import { unstable_cache } from "next/cache";
import { cache } from "react";

/**
 * Wraps a database query function with Next.js unstable_cache
 * @param fn Database query function
 * @param keyParts Cache key parts
 * @param tags Cache tags for revalidation
 * @param revalidateSec Revalidation TTL in seconds (default: 300 = 5 min)
 */
export function createCachedQuery<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyParts: string[],
  tags: string[],
  revalidateSec: number = 300
) {
  return unstable_cache(fn, keyParts, {
    revalidate: revalidateSec,
    tags: tags,
  }) as T;
}

/**
 * React request-deduplication cache for the lifetime of a single render request
 */
export const memoizeQuery = cache;
