"use client";

import { useEffect } from "react";

const clamp = (v, min, max) => (v < min ? min : v > max ? max : v);

/** Width of the source strip stretched outwards to fill the bare edges. */
const EDGE = 16;

/**
 * The coarsest pass of the ladder. These same indices are preloaded from the
 * server-rendered HTML (see components/Hero.jsx), so by the time this hook
 * runs they are already in the HTTP cache and resolve instantly.
 */
export const COARSE_STRIDE = 64;

/**
 * Progressive load ladder: first and last frame, then a coarse pass over the
 * whole timeline, then repeatedly halving the stride.
 *
 * Starting at stride 64 rather than deep in the sequence matters — roughly ten
 * frames spread evenly is enough that *any* scroll position has something to
 * show within the first moments, and every later pass halves the gap. Loading
 * in playback order instead would leave the back half blank for seconds.
 */
function buildLoadOrder(count) {
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
  for (let stride = COARSE_STRIDE; stride >= 1; stride >>= 1) {
    for (let i = 0; i < count; i += stride) push(i);
  }
  return order;
}

/** Frames in the coarse pass — preloaded from the HTML, so fetched at high priority. */
export function coarseFrames(count) {
  const list = [];
  for (let i = 0; i < count; i += COARSE_STRIDE) list.push(i);
  if (list[list.length - 1] !== count - 1) list.push(count - 1);
  return list;
}

/**
 * Drives a <canvas> through an image sequence from scroll position.
 *
 * Everything runs outside React: scroll is sampled with getBoundingClientRect
 * inside a single rAF loop and smoothed with a frame-rate-independent
 * exponential lerp. The smoothing is applied to the scroll *input*; the output
 * always resolves to exactly one whole frame, so the subject is never blended
 * with its own past or future position.
 *
 * `progress` is an optional framer-motion MotionValue for anything that wants
 * to follow along; updating it never re-renders React.
 */
export default function useFrameSequence({
  canvasRef,
  trackRef,
  // { frameCount, srcFor } — or null while the orientation is still unknown.
  source,
  posterRef,
  progress,
  // When set (0–1) the sequence holds this frame and ignores scroll entirely.
  staticProgress = null,
}) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const track = trackRef.current;
    if (!canvas || !source) return;

    const { frameCount, srcFor } = source;

    // alpha:true so the poster <img> shows through until the first frame paints.
    const ctx = canvas.getContext("2d");
    const frames = new Array(frameCount).fill(null);
    const ready = new Uint8Array(frameCount);

    let disposed = false;
    let rafId = 0;
    let current = staticProgress ?? 0;
    let target = current;
    let lastTime = 0;
    let needsPaint = true;
    let paintedIndex = -1;
    let posterHidden = false;

    let cssWidth = 0;
    let cssHeight = 0;

    /* --------------------------------------------------------------- canvas */

    const resize = () => {
      // Layout size, not getBoundingClientRect: a transformed ancestor would
      // otherwise resize (and so clear) the canvas on every scroll tick.
      cssWidth = canvas.clientWidth;
      cssHeight = canvas.clientHeight;
      if (!cssWidth || !cssHeight) return;

      // Never build a backing store finer than the frames can actually feed —
      // beyond that it is pure fill-rate for no extra detail.
      const first = frames[0];
      const useful = first ? Math.max(1, first.naturalWidth / cssWidth) : 2;
      const dpr = Math.min(window.devicePixelRatio || 1, 2, useful);

      const w = Math.round(cssWidth * dpr);
      const h = Math.round(cssHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      // Resizing resets all context state, so both of these belong here.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      needsPaint = true;
    };

    /* ---------------------------------------------------------------- load */

    const order = buildLoadOrder(frameCount);
    let cursor = 0;

    // The coarse pass is what makes the animation usable, so it competes for
    // bandwidth; everything after it is refinement and must not hold up the
    // rest of the page. `position` tracks how far down the ladder we are.
    const coarseCount = coarseFrames(frameCount).length;

    const loadNext = async () => {
      while (!disposed && cursor < order.length) {
        const position = cursor;
        const index = order[cursor++];
        if (ready[index]) continue;

        const img = new Image();
        img.decoding = "async";
        // Priority hints keep the long tail of frames from queueing ahead of
        // fonts, scripts and the rest of the page's own resources.
        img.fetchPriority = position < coarseCount ? "high" : "low";
        img.src = srcFor(index);

        try {
          // Decode here rather than letting the first drawImage trigger it.
          // A synchronous decode inside the rAF loop is a dropped frame; doing
          // it during loading keeps the scrub path free of decode work.
          await img.decode();
        } catch {
          continue; // a failed frame just leaves a gap; nearest() covers it
        }
        if (disposed) return;

        frames[index] = img;
        ready[index] = 1;
        // The first frame reveals the source resolution, which caps the
        // backing store. Any new frame may also beat what is on screen.
        if (index === 0) resize();
        needsPaint = true;
      }
    };

    /* ---------------------------------------------------------------- paint */

    /** Nearest already-decoded frame, searching backwards first. */
    const nearest = (index) => {
      if (ready[index]) return index;
      for (let d = 1; d < frameCount; d++) {
        if (index - d >= 0 && ready[index - d]) return index - d;
        if (index + d < frameCount && ready[index + d]) return index + d;
      }
      return -1;
    };

    /**
     * Where the frame lands on the canvas — contain, so the entire frame is
     * always on screen and nothing is ever cropped: head, hands and shoes all
     * stay in view at every window aspect ratio.
     *
     * There is no zoom: scaling the canvas by CSS transform would have the
     * compositor resample it on top of the resampling drawImage already did,
     * softening the frame. Every frame in a set also has identical intrinsic
     * dimensions, so this returns the same rect for all of them — the subject
     * stays registered to the same pixels from one frame to the next.
     */
    const geometryFor = (img) => {
      const scale = Math.min(cssWidth / img.width, cssHeight / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      return { w, h, x: (cssWidth - w) / 2, y: (cssHeight - h) / 2 };
    };

    /**
     * Containing the frame leaves bare edges on any window whose aspect ratio
     * differs from the footage. Rather than show them as flat white, the
     * frame's own outermost strip is stretched outwards to fill them. Because
     * the fill starts from the exact pixels it abuts, the join is seamless by
     * construction and the ivory backdrop simply continues to the edge of the
     * screen — edge to edge, with nothing cropped.
     *
     * Contain only ever leaves a gap on one axis, so these never overlap.
     */
    const drawEdgeFill = (img, { w, h, x, y }) => {
      if (x > 0.5) {
        ctx.drawImage(img, 0, 0, EDGE, img.height, 0, y, x, h);
        ctx.drawImage(img, img.width - EDGE, 0, EDGE, img.height, x + w, y, x, h);
      }
      if (y > 0.5) {
        ctx.drawImage(img, 0, 0, img.width, EDGE, x, 0, w, y);
        ctx.drawImage(img, 0, img.height - EDGE, img.width, EDGE, x, y + h, w, y);
      }
    };

    const paint = (index) => {
      if (!cssWidth || !cssHeight) return;

      const shown = nearest(index);
      if (shown === -1) return;
      const img = frames[shown];
      const geometry = geometryFor(img);
      const { w, h, x, y } = geometry;

      // Only ever one frame on the canvas, at full opacity — no blending, so
      // no ghosting. Cleared first so nothing from a previous size lingers.
      ctx.clearRect(0, 0, cssWidth, cssHeight);
      drawEdgeFill(img, geometry);
      ctx.drawImage(img, x, y, w, h);

      paintedIndex = index;

      // The poster sits underneath the canvas. Drop it the moment the canvas
      // has something of its own.
      if (!posterHidden) {
        posterHidden = true;
        if (posterRef?.current) posterRef.current.style.visibility = "hidden";
      }
    };

    /* ----------------------------------------------------------------- loop */

    const sampleScroll = () => {
      if (!track) return 0;
      const rect = track.getBoundingClientRect();
      const distance = rect.height - window.innerHeight;
      if (distance <= 0) return 0;
      return clamp(-rect.top / distance, 0, 1);
    };

    const tick = (time) => {
      if (disposed) return;
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.1) : 0;
      lastTime = time;

      if (staticProgress === null) {
        target = sampleScroll();
        // Frame-rate independent easing — identical feel at 60 and 120 Hz.
        // Fast flicks catch up quickly; slow drags stay perfectly continuous.
        current += (target - current) * (1 - Math.exp(-dt / 0.075));
        if (Math.abs(target - current) < 0.00015) current = target;
      }

      progress?.set(current);

      // Round, not floor: the nearest whole frame halves the worst-case
      // temporal error and never blends two positions together.
      const index = Math.round(current * (frameCount - 1));
      if (needsPaint || index !== paintedIndex) {
        needsPaint = false;
        paint(index);
      }

      rafId = requestAnimationFrame(tick);
    };

    /* ---------------------------------------------------------------- setup */

    // HTTP/2 multiplexes, so a wider gate simply lets the browser schedule more
    // of the ladder at once; priority hints above keep it polite.
    for (let i = 0; i < 10; i++) loadNext();

    resize();
    progress?.set(current);

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    rafId = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      observer.disconnect();
      for (const img of frames) {
        if (img) img.onload = img.onerror = null;
      }
    };
  }, [canvasRef, trackRef, posterRef, source, progress, staticProgress]);
}
