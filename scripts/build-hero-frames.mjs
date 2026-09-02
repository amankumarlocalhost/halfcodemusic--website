/**
 * Encodes the raw hero frame sequences into web-ready WebP sets.
 *
 *   node scripts/build-hero-frames.mjs
 *
 * Two sources, because one aspect ratio cannot serve both orientations:
 *   video2_frames_30fps/frames2  1920x1080 PNG landscape  -> w1600, w960
 *   frames                       2160x3840 JPG portrait   -> p720
 *
 * The raw sources stay out of the repo; only the encoded sets are committed.
 * Re-run this whenever a source sequence changes, and update the frame counts
 * in components/Hero.jsx if the number of frames changes.
 */
import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { VERSION, nameFor } from "./frame-names.mjs";

const OUT = `public/hero-frames/${VERSION}`;
const MAP_FILE = "lib/heroFrames.json";

/** setDir -> concatenated 8-char names, one per frame index. */
const names = {};

const SOURCES = [
  {
    label: "landscape",
    dir: "video2_frames_30fps/frames2",
    ext: ".png",
    sets: [
      { dir: "w1600", width: 1600, quality: 68, effort: 6 },
      { dir: "w960", width: 960, quality: 62, effort: 6 },
    ],
  },
  {
    label: "portrait",
    dir: "mobileframes",
    ext: ".png",
    sets: [{ dir: "p720", width: 720, quality: 66, effort: 6 }],
  },
];

/** Runs `worker` over `items` with at most `limit` in flight. */
async function pool(items, limit, worker) {
  let cursor = 0;
  const runners = Array.from({ length: limit }, async () => {
    while (cursor < items.length) {
      const i = cursor++;
      await worker(items[i], i);
    }
  });
  await Promise.all(runners);
}

for (const source of SOURCES) {
  let files;
  try {
    files = (await readdir(source.dir)).filter((f) => f.endsWith(source.ext)).sort();
  } catch {
    console.log(`- ${source.label}: ${source.dir} not present, skipping`);
    continue;
  }
  if (!files.length) {
    console.log(`- ${source.label}: no ${source.ext} frames in ${source.dir}, skipping`);
    continue;
  }

  console.log(`\n${source.label}: ${files.length} frames from ${source.dir}`);

  for (const set of source.sets) {
    const outDir = path.join(OUT, set.dir);
    await mkdir(outDir, { recursive: true });

    let bytes = 0;
    let done = 0;

    await pool(files, 8, async (file, i) => {
      const buf = await sharp(path.join(source.dir, file))
        .resize(set.width)
        .webp({ quality: set.quality, effort: set.effort })
        .toBuffer();

      // Hashed rather than sequential, so the filenames carry no playback order.
      await writeFile(path.join(outDir, `${nameFor(set.dir, i)}.webp`), buf);

      bytes += buf.length;
      if (++done % 100 === 0) process.stdout.write(`  ${set.dir}: ${done}/${files.length}\n`);
    });

    // One concatenated string of fixed-width names per set: the client slices
    // out index i rather than carrying 600 separate JSON entries.
    names[set.dir] = files.map((_, i) => nameFor(set.dir, i)).join("");

    console.log(
      `✓ ${set.dir} — ${done} frames, ${(bytes / 1024 / 1024).toFixed(1)} MB ` +
        `(${Math.round(bytes / done / 1024)} KB avg)`
    );
  }

  console.log(`  frame count for ${source.label}: ${files.length}`);
}

if (Object.keys(names).length) {
  await writeFile(MAP_FILE, JSON.stringify({ version: VERSION, names }));
  console.log(`\nWrote ${MAP_FILE}`);
} else {
  console.log("\nNo sources found — leaving the existing map in place.");
}
