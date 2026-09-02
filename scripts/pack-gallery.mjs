/**
 * Packs the gallery's photographs into opaque binaries.
 *
 *   npm run pack:gallery
 *
 * Same idea as scripts/pack-frames.mjs, applied to stills instead of a frame
 * sequence: rather than serving N individually addressable image files, each
 * size variant ships as a single `g-<hash>.bin` whose bytes are XOR-masked. The
 * browser makes one request per variant, nothing in the Network tab previews as
 * an image, and no photograph is reachable as its own URL.
 *
 * This is a deterrent, not encryption — the mask key ships in the JS bundle, so
 * anyone determined can still recover the photos. What it does stop: right-click
 * to save, drag-to-desktop, "copy image address", renaming a response to .jpg,
 * and pointing a scraper at /gallery to hoover up every file.
 *
 * WHY TWO PACKS INSTEAD OF ONE
 * The grid needs small images for every photo at once; the lightbox needs one
 * big image, and only if the visitor actually opens it. Packing those together
 * would force every visitor to download full-resolution copies of photos they
 * may never enlarge. So `thumb` is fetched when the gallery mounts, and `full`
 * is fetched lazily on the first lightbox open.
 *
 * Source (kept out of the repo, see .gitignore):
 *   gallery-src/*.jpg|png|webp|avif|tif   the original photographs
 *   gallery-src/meta.json                 optional alt text / category per file
 *
 * Outputs (committed, since the sources are not):
 *   public/_gal/g-<hash>.bin    one masked pack per variant
 *   lib/galleryManifest.json    per-image metadata, dimensions and LQIP posters
 *   lib/galleryKey.js           the XOR key, as its own JS module
 */
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { createHash, randomBytes } from "node:crypto";
import path from "node:path";
import sharp from "sharp";

const SRC_DIR = "gallery-src";
const META_FILE = path.join(SRC_DIR, "meta.json");
const OUT_DIR = "public/_gal";
const MANIFEST_FILE = "lib/galleryManifest.json";
const KEY_FILE = "lib/galleryKey.js";

/** Extensions treated as source photographs. Anything else in the folder is ignored. */
const SOURCE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".tif", ".tiff"]);

/**
 * The two size variants.
 *
 * `thumb` is sized for the masonry grid: the grid is capped at max-w-6xl
 * (1152px) across three columns, so one cell is roughly 370 CSS px — 720px
 * covers that at 2x device pixel ratio without paying for detail nobody can see.
 *
 * `full` is sized for the lightbox, which is capped at max-w-4xl (896px) and
 * 85vh — again 2x, rounded up.
 */
const VARIANTS = [
  { key: "thumb", width: 720, quality: 72 },
  { key: "full", width: 1800, quality: 80 },
];

/**
 * A tiny blurred placeholder, inlined into the manifest as a data URI so a cell
 * shows something the instant the page paints rather than an empty box while
 * the pack streams. At this size each one costs a few hundred bytes.
 */
const LQIP_WIDTH = 24;
const LQIP_QUALITY = 40;

/** Numeric-aware sort, so photo_9 comes before photo_10. */
const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

/** Runs `worker` over `items` with at most `limit` in flight, to bound sharp's decode buffers. */
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

/**
 * Turns "studio-session-03.jpg" into "Studio session 03" — a readable fallback
 * so a photo with no entry in meta.json still gets sensible alt text.
 */
function altFromFilename(file) {
  const bare = path.basename(file, path.extname(file));
  const words = bare.replace(/[_-]+/g, " ").trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/**
 * Lays payloads out back to back behind a header describing each one.
 *
 * Unlike the hero pack, gallery photos are not all the same shape, so the
 * header carries per-image width and height. The client needs those to size
 * each grid cell BEFORE the image itself has decoded — without them the grid
 * would reflow as photos land, which looks broken.
 *
 *   offset 0              u32 LE       image count (n)
 *   offset 4              u32 LE x n   payload byte length, in order
 *   offset 4 + 4n         u16 LE x n   image width
 *   offset 4 + 6n         u16 LE x n   image height
 *   offset 4 + 8n         ...          the WebP payloads, back to back
 */
function packContainer(payloads, sizes) {
  const n = payloads.length;
  const headerBytes = 4 + n * 8;

  // Total the body first, so the buffer is allocated exactly once.
  let bodyBytes = 0;
  for (let i = 0; i < n; i++) {
    bodyBytes += payloads[i].length;
  }

  const container = Buffer.allocUnsafe(headerBytes + bodyBytes);
  container.writeUInt32LE(n, 0);

  for (let i = 0; i < n; i++) {
    container.writeUInt32LE(payloads[i].length, 4 + i * 4);
    container.writeUInt16LE(sizes[i].width, 4 + n * 4 + i * 2);
    container.writeUInt16LE(sizes[i].height, 4 + n * 6 + i * 2);
  }

  let cursor = headerBytes;
  for (let i = 0; i < n; i++) {
    payloads[i].copy(container, cursor);
    cursor += payloads[i].length;
  }

  return container;
}

/* -------------------------------------------------------------------------- */

// Resolve the sources before touching the output, so a machine without the raw
// photos (a deploy box) leaves the committed packs alone rather than wiping them.
let files = [];
try {
  const entries = await readdir(SRC_DIR);
  files = entries
    .filter((f) => SOURCE_EXT.has(path.extname(f).toLowerCase()))
    .sort(collator.compare);
} catch {
  console.log(`- ${SRC_DIR}/ not present — keeping the committed gallery pack untouched.`);
  process.exit(0);
}

if (!files.length) {
  console.log(`- no source images in ${SRC_DIR}/ — keeping the committed gallery pack untouched.`);
  process.exit(0);
}

// Optional sidecar: { "studio-01.jpg": { "alt": "...", "category": "studio" } }
let meta = {};
try {
  meta = JSON.parse(await readFile(META_FILE, "utf8"));
} catch {
  console.log(`- no ${META_FILE}; falling back to filenames for alt text.`);
}

await rm(OUT_DIR, { recursive: true, force: true });
await mkdir(OUT_DIR, { recursive: true });

// One key for the whole build, regenerated every run.
const key = randomBytes(32);

const manifest = {
  generated: new Date().toISOString(),
  variants: {},
  images: [],
};

/* ------------------------------------------------------------------ posters */

// Built from the originals in the same order as the packs, so manifest index i
// and pack index i always describe the same photograph.
const posters = new Array(files.length);

await pool(files, 4, async (file, i) => {
  const buffer = await sharp(path.join(SRC_DIR, file))
    .resize(LQIP_WIDTH, null, { withoutEnlargement: true })
    .webp({ quality: LQIP_QUALITY })
    .toBuffer();
  posters[i] = `data:image/webp;base64,${buffer.toString("base64")}`;
});

/* ----------------------------------------------------------------- variants */

for (const variant of VARIANTS) {
  const payloads = new Array(files.length);
  const sizes = new Array(files.length);
  let done = 0;

  // Encode every photo at this variant's size. Note this runs against the RAW
  // originals, never against an already-encoded variant — re-encoding WebP to
  // WebP would be a second lossy generation for no benefit.
  await pool(files, 4, async (file, i) => {
    const encoded = await sharp(path.join(SRC_DIR, file))
      .resize(variant.width, null, { withoutEnlargement: true })
      .webp({ quality: variant.quality, effort: 6 })
      .toBuffer();

    const info = await sharp(encoded).metadata();
    payloads[i] = encoded;
    sizes[i] = { width: info.width, height: info.height };

    if (++done % 25 === 0) process.stdout.write(`  ${variant.key}: ${done}/${files.length}\n`);
  });

  const container = packContainer(payloads, sizes);

  // XOR is its own inverse, so the client undoes this with the same key.
  for (let i = 0; i < container.length; i++) {
    container[i] ^= key[i % key.length];
  }

  // Content hash in the filename, so a rebuild ships under a new URL and can be
  // cached forever — see the /_gal/ header rule in next.config.mjs.
  const name = `g-${createHash("sha256").update(container).digest("hex").slice(0, 16)}.bin`;
  await writeFile(path.join(OUT_DIR, name), container);

  manifest.variants[variant.key] = {
    url: `/_gal/${name}`,
    count: files.length,
    bytes: container.length,
  };

  // The thumb pass defines each image's intrinsic aspect ratio for layout, so
  // record the per-image metadata while its dimensions are in hand.
  if (variant.key === "thumb") {
    for (let i = 0; i < files.length; i++) {
      const entry = meta[files[i]] || {};
      manifest.images.push({
        alt: entry.alt || altFromFilename(files[i]),
        category: entry.category || "artwork",
        width: sizes[i].width,
        height: sizes[i].height,
        poster: posters[i],
      });
    }
  }

  console.log(
    `✓ ${variant.key} — ${files.length} images, ${(container.length / 1024 / 1024).toFixed(2)} MB`
  );
}

await writeFile(MANIFEST_FILE, JSON.stringify(manifest));

await writeFile(
  KEY_FILE,
  "// Generated by scripts/pack-gallery.mjs — do not edit.\n" +
    "// Kept out of the manifest on purpose: manifest fields become props and are\n" +
    "// serialized into the page HTML in the clear, whereas this lands in a JS chunk.\n" +
    `export const GALLERY_KEY = "${key.toString("base64")}";\n`
);

console.log(`\nWrote ${MANIFEST_FILE} and ${KEY_FILE}`);
