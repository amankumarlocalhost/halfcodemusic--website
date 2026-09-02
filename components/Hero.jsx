"use client";

import { useEffect, useMemo, useRef } from "react";
import { useMotionValue, useReducedMotion } from "framer-motion";
import useFrameSequence from "@/components/hero/useFrameSequence";
import useMediaQuery from "@/lib/useMediaQuery";
import HeroMobileOverlay from "@/components/hero/HeroMobileOverlay";
import seqManifest from "@/lib/seqManifest.json";

/**
 * Each set is one packed binary — regenerate with `npm run pack:frames`.
 *
 * Portrait screens get a separately shot 9:16 cut of the same sequence, so the
 * subject fills a phone properly instead of sitting in a letterboxed strip; it
 * is a different edit, hence its own frame count. The manifest carries the
 * count, dimensions and inline poster for each, so nothing is hardcoded here.
 */
const { portrait, landscape, landscapeNarrow } = seqManifest.sets;

/** Landscape below this width takes the lighter pack. Matches the poster's media query. */
const NARROW = 900;

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

  // Scroll position of the sequence, 0–1. Only the narrow-screen content layer
  // reads it; on desktop nothing subscribes, so this stays inert.
  const progress = useMotionValue(0);

  // A reload should always open on frame 0. The inline script in the layout
  // turns scroll restoration off before the browser can act on it; this is the
  // belt and braces for browsers that restore before hydration anyway. An
  // explicit #anchor is honoured — that is a deliberate jump, not a restore.
  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0);

    return () => {
      // Hand restoration back when leaving, so long pages elsewhere still
      // return you to where you were.
      if ("scrollRestoration" in history) history.scrollRestoration = "auto";
    };
  }, []);

  // null until hydration, so nothing is fetched before the orientation is
  // known — and a rotated phone re-resolves onto the matching set.
  const isPortrait = useMediaQuery("(orientation: portrait)");

  const source = useMemo(() => {
    if (isPortrait === null) return null;
    if (isPortrait) return portrait;
    return window.innerWidth < NARROW ? landscapeNarrow : landscape;
  }, [isPortrait]);

  useFrameSequence({
    canvasRef,
    trackRef,
    source,
    posterRef,
    progress,
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
        {/* Inline first paint. These are data: URIs from the manifest, so the
            hero is never blank while the pack streams and they cost no request
            of their own. object-contain matches the canvas fit exactly, so the
            handover to the canvas is invisible. */}
        <picture>
          <source media="(orientation: portrait)" srcSet={portrait.poster} />
          <source media={`(max-width: ${NARROW - 1}px)`} srcSet={landscapeNarrow.poster} />
          <img
            ref={posterRef}
            src={landscape.poster}
            alt=""
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-contain"
          />
        </picture>
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
        />

        {/* Narrow screens only — `lg:hidden` keeps it out of the desktop layout. */}
        <HeroMobileOverlay progress={progress} animate={!reduceMotion} />
      </div>
    </section>
  );
}
