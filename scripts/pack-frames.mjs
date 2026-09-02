/**
 * Packs each hero frame sequence into ONE opaque binary.
 *
 *   npm run pack:frames
 *
 * Instead of ~600 individually addressable .webp files, each set ships as a
 * single `s-<hash>.bin` whose bytes are XOR-masked, so it is not a valid image
 * container and the DevTools response preview is noise. The browser makes one
 * request per visitor and no frame is reachable as a URL.
 *
 * This is a deterrent, not encryption: the mask key ships in the JS bundle, so
 * anyone determined can still recover the frames. It stops right-click → save,
 * drag-out, renaming to .webp, and "it's obviously just images" at a glance.
 *
 * Sources (kept out of the repo, see .gitignore):
 *   video2_frames_30fps/frames2  1920x1080 PNG landscape
 *   mobileframes                 1080x1920 PNG portrait
 *
 * Outputs (committed, since the sources are not):
 *   public/_seq/s-<hash>.bin     one masked pack per set
 *   lib/seqManifest.json         url / dimensions / poster per set
 *   lib/seqKey.js                the XOR key, as its own JS module
 */
import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { createHash, randomBytes } from "node:crypto";
import path from "node:path";
import sharp from "sharp";

const OUT_DIR = "public/_seq";
const MANIFEST_FILE = "lib/seqManifest.json";
const KEY_FILE = "lib/seqKey.js";

/**
 * Encode settings per set.
 *
 * These are deliberately the same values the previous per-frame build used, and
 * they run against the RAW sources — not against the already-encoded .webp
 * frames. Re-encoding WebP to WebP would be a second lossy generation; going
 * back to the originals keeps the packed frames pixel-for-pixel the quality
 * that is already shipping.
 */
const SETS = [
  {
    key: "landscape",
    dir: "video2_frames_30fps/frames2",
    ext: ".png",
    width: 1600,
    quality: 68,
  },
  {
    key: "landscapeNarrow",
    dir: "video2_frames_30fps/frames2",
    ext: ".png",
    width: 960,
    quality: 62,
  },
  {
    key: "portrait",
    dir: "mobileframes",
    ext: ".png",
    width: 720,
    quality: 66,
  },
];

/** Poster shown until the canvas paints its first real frame. */
const POSTER_WIDTH = 480;
const POSTER_QUALITY = 55;

/**
 * Order frames are written into the pack: first and last, a coarse pass across
 * the whole timeline, then repeatedly halving the stride.
 *
 * This is the one place this build departs from a plain sequential pack, and it
 * matters. A stream in play order only covers the part of the animation that
 * has downloaded — scrub to 80% early on and there is nothing to draw. Writing
 * in ladder order means the first seconds of the stream already cover the whole
 * timeline coarsely, and every later pass halves the gap. The header carries an
 * index table so the client knows which frame each payload actually is.
 */
function packOrder(count) {
  const order = [];
  const queued = new Uint8Array(count);
  const push = (i) => {
    if (i >= 0 && i < count && !queued[i]) {
      queued[i] = 1;
      order.push(i);
    }
  };

  push(0);
  push(count - 1);
  for (let stride = 64; stride >= 1; stride >>= 1) {
    for (let i = 0; i < count; i += stride) push(i);
  }
  return order;
}

/** Numeric-aware sort, so frame_9 comes before frame_10. */
const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

/** Runs `worker` over `items` with at most `limit` in flight. */
async function pool(items, limit, worker) {
  let cursor = 0;
  await Promise.all(
    Array.from({ length: limit }, async () => {
      while (cursor < items.length) {
        const i = cursor++;
        await worker(items[i], i);
      }
    })
  );
}

/* -------------------------------------------------------------------------- */

// Resolve every source before touching the output, so a machine without the raw
// frames (a deploy box) leaves the committed packs alone rather than wiping them.
const resolved = [];
for (const set of SETS) {
  try {
    const files = (await readdir(set.dir)).filter((f) => f.endsWith(set.ext)).sort(collator.compare);
    if (files.length) resolved.push({ set, files });
    else console.log(`- ${set.key}: no ${set.ext} frames in ${set.dir}`);
  } catch {
    console.log(`- ${set.key}: ${set.dir} not present`);
  }
}

if (resolved.length !== SETS.length) {
  console.log(
    `\nRaw sources incomplete (${resolved.length}/${SETS.length}) — keeping the ` +
      `committed packs and manifest untouched.`
  );
  process.exit(0);
}

await rm(OUT_DIR, { recursive: true, force: true });
await mkdir(OUT_DIR, { recursive: true });

// One key for the whole build, regenerated every run.
const key = randomBytes(32);
const manifest = { generated: new Date().toISOString(), sets: {} };

for (const { set, files } of resolved) {
  const order = packOrder(files.length);

  // Encode every frame first. Payloads are ~20 KB each, so holding them is a few
  // MB; the memory that matters is sharp's decode buffers, which the small pool
  // bounds to four at a time.
  const payloads = new Array(order.length);
  let done = 0;

  await pool(order, 4, async (frameIndex, slot) => {
    payloads[slot] = await sharp(path.join(set.dir, files[frameIndex]))
      .resize(set.width, null, { withoutEnlargement: true })
      .webp({ quality: set.quality, effort: 6 })
      .toBuffer();

    if (++done % 100 === 0) process.stdout.write(`  ${set.key}: ${done}/${order.length}\n`);
  });

  const meta = await sharp(payloads[0]).metadata();

  /* ------------------------------------------------------------ container */
  // offset 0            u32 LE   frame count
  // offset 4            u16 LE   frame width
  // offset 6            u16 LE   frame height
  // offset 8            u32 LE x n   payload byte length, in stream order
  // offset 8 + 4n       u16 LE x n   frame index of each payload
  // then                             the WebP payloads, back to back
  const n = order.length;
  const headerBytes = 8 + n * 4 + n * 2;
  const bodyBytes = payloads.reduce((sum, p) => sum + p.length, 0);
  const container = Buffer.allocUnsafe(headerBytes + bodyBytes);

  container.writeUInt32LE(n, 0);
  container.writeUInt16LE(meta.width, 4);
  container.writeUInt16LE(meta.height, 6);

  for (let i = 0; i < n; i++) {
    container.writeUInt32LE(payloads[i].length, 8 + i * 4);
    container.writeUInt16LE(order[i], 8 + n * 4 + i * 2);
  }

  let cursor = headerBytes;
  for (const payload of payloads) {
    payload.copy(container, cursor);
    cursor += payload.length;
  }

  // XOR is its own inverse, so the client undoes this with the same key.
  for (let i = 0; i < container.length; i++) container[i] ^= key[i % key.length];

  const name = `s-${createHash("sha256").update(container).digest("hex").slice(0, 16)}.bin`;
  await writeFile(path.join(OUT_DIR, name), container);

  // Tiny inline first paint, so the hero is never blank while the pack streams.
  const poster = await sharp(path.join(set.dir, files[0]))
    .resize(POSTER_WIDTH, null, { withoutEnlargement: true })
    .webp({ quality: POSTER_QUALITY })
    .toBuffer();

  manifest.sets[set.key] = {
    url: `/_seq/${name}`,
    frameCount: n,
    width: meta.width,
    height: meta.height,
    bytes: container.length,
    poster: `data:image/webp;base64,${poster.toString("base64")}`,
  };

  console.log(
    `✓ ${set.key} — ${n} frames, ${meta.width}x${meta.height}, ` +
      `${(container.length / 1024 / 1024).toFixed(1)} MB, poster ${Math.round(poster.length / 1024)} KB`
  );
}

await writeFile(MANIFEST_FILE, JSON.stringify(manifest));

await writeFile(
  KEY_FILE,
  "// Generated by scripts/pack-frames.mjs — do not edit.\n" +
    "// Kept out of the manifest on purpose: manifest fields become props and are\n" +
    "// serialized into the page HTML in the clear, whereas this lands in a JS chunk.\n" +
    `export const MASK_KEY = "${key.toString("base64")}";\n`
);

console.log(`\nWrote ${MANIFEST_FILE} and ${KEY_FILE}`);
