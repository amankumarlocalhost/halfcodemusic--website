"use client";

import { useMemo, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import useFrameSequence, { coarseFrames } from "@/components/hero/useFrameSequence";
import useMediaQuery from "@/lib/useMediaQuery";
import frameNames from "@/lib/heroFrames.json";

/**
 * Frame sets live in public/hero-frames — regenerate with
 * scripts/build-hero-frames.mjs, which also prints these counts.
 *
 * Portrait screens get a separately shot 9:16 cut of the same sequence, so the
 * subject fills a phone properly instead of sitting in a letterboxed strip. It
 * is a different edit, hence the different frame count.
 */
const SETS = {
  portrait: { dir: "p720", frameCount: 589, media: "(orientation: portrait)" },
  landscape: {
    dir: "w1600",
    frameCount: 600,
    media: "(orientation: landscape) and (min-width: 900px)",
  },
  landscapeNarrow: {
    dir: "w960",
    frameCount: 600,
    media: "(orientation: landscape) and (max-width: 899px)",
  },
};

/** Landscape below this width takes the lighter set. Matches the poster's media query. */
const NARROW = 900;

/** Fixed width of each hashed name in the map. Matches NAME_LENGTH in scripts/frame-names.mjs. */
const NAME_LENGTH = 8;

/**
 * Frames are stored under hashed filenames rather than a numbered sequence, so
 * the request list gives away no playback order. `frameNames` is a build-time
 * map of index -> name, compiled into the bundle: it carries no request of its
 * own, and being generated alongside the files it can never drift out of sync.
 *
 * Each set's names are one concatenated fixed-width string, so the whole map is
 * ~14 KB rather than 1,789 JSON entries.
 */
const frameUrl = (dir, index) => {
  const start = index * NAME_LENGTH;
  const name = frameNames.names[dir].slice(start, start + NAME_LENGTH);
  return `/hero-frames/${frameNames.version}/${dir}/${name}.webp`;
};

/**
 * Scroll-scrubbed hero.
 *
 * The section is a tall scroll track; the stage inside is pinned to the
 * viewport while a 600-frame sequence is scrubbed across it. The frame is
 * shown whole — contained, never cropped — inside the area below the fixed
 * navbar, so no part of the subject is ever cut off or hidden behind the nav.
 * The final frame resolves into the wordmark and hands off to the next section
 * as the track scrolls out from under the pin.
 */
export default function Hero() {
  const reduceMotion = useReducedMotion();

  const trackRef = useRef(null);
  const canvasRef = useRef(null);
  const posterRef = useRef(null);

  // null until hydration, so nothing is fetched before the orientation is
  // known — and a rotated phone re-resolves onto the matching set.
  const isPortrait = useMediaQuery("(orientation: portrait)");

  const source = useMemo(() => {
    if (isPortrait === null) return null;
    const set = isPortrait
      ? SETS.portrait
      : window.innerWidth < NARROW
        ? SETS.landscapeNarrow
        : SETS.landscape;

    return {
      frameCount: set.frameCount,
      srcFor: (index) => frameUrl(set.dir, index),
    };
  }, [isPortrait]);

  useFrameSequence({
    canvasRef,
    trackRef,
    source,
    posterRef,
    staticProgress: reduceMotion ? 0 : null,
  });

  return (
    <section
      ref={trackRef}
      aria-label="HalfCodeMusic"
      // The scroll track collapses to a single pinned screen under
      // reduced-motion. Done in CSS, not JS, so SSR and hydration agree.
      className="relative h-[320svh] motion-reduce:h-auto sm:h-[380svh] sm:motion-reduce:h-auto"
    >
      {/* Edge to edge and top to bottom: the stage is the whole viewport, and
          the transparent navbar overlays it rather than sitting above it. */}
      <div className="sticky top-0 h-svh overflow-hidden bg-paper">
        {/* Paints before hydration so the first frame is the hero immediately,
            and stays behind the canvas as its opening image. object-contain
            matches the canvas fit exactly, so the handover is invisible. */}
        {/* Server-rendered preloads. The browser's preload scanner picks these
            up while it is still parsing the HTML, so the coarse pass is already
            in cache by the time React has hydrated and the hook asks for it —
            worth well over a second on a cold load. `media` keeps each device
            to the one set it will actually use. */}
        {Object.values(SETS).flatMap((set) =>
          coarseFrames(set.frameCount).map((index) => (
            <link
              key={`${set.dir}-${index}`}
              rel="preload"
              as="image"
              type="image/webp"
              media={set.media}
              href={frameUrl(set.dir, index)}
            />
          ))
        )}

        <picture>
          <source media="(orientation: portrait)" srcSet={frameUrl(SETS.portrait.dir, 0)} />
          <source media={`(max-width: ${NARROW - 1}px)`} srcSet={frameUrl(SETS.landscapeNarrow.dir, 0)} />
          <img
            ref={posterRef}
            src={frameUrl(SETS.landscape.dir, 0)}
            alt=""
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-contain"
          />
        </picture>
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      </div>
    </section>
  );
}
