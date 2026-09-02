import { createHash } from "node:crypto";

/**
 * Path version. Must match VERSION in components/Hero.jsx — it is what lets
 * next.config.mjs serve these frames as permanently immutable.
 */
export const VERSION = "v3";

/**
 * Salt for the filename derivation. Bump it to rotate every filename at once;
 * leave it alone and the build is reproducible.
 */
const SALT = "halfcodemusic-frames-v1";

/** Characters per name. 8 hex chars is 4 billion values — collisions are not a concern here. */
export const NAME_LENGTH = 8;

/**
 * Frames are named by hash rather than by index.
 *
 * Sequentially numbered frames (0333.webp, 0334.webp …) make the technique
 * obvious at a glance in the Network tab. Hashed names carry no order. This is
 * obfuscation against a casual look, not security — the frames are still
 * ordinary files anyone can download.
 *
 * The derivation is deterministic, not random: re-running the build must
 * produce identical names, or the committed map would drift and already-loaded
 * pages would 404 on names that no longer exist.
 */
export function nameFor(setDir, index) {
  return createHash("sha256")
    .update(`${SALT}:${setDir}:${index}`)
    .digest("hex")
    .slice(0, NAME_LENGTH);
}
