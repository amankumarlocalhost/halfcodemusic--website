"use client";

import { useEffect } from "react";
import { loadFramePack } from "@/components/hero/framePack";

const clamp = (v, min, max) => (v < min ? min : v > max ? max : v);

/** Width of the source strip stretched outwards to fill the bare edges. */
const EDGE = 16;

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
  // A set from lib/seqManifest.json — or null while the orientation is still
  // unknown, which keeps us from downloading the wrong pack before hydration.
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

    const { frameCount } = source;

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

    // The whole sequence arrives as one masked binary rather than as ~600
    // separate image requests. Frames stream out of it coarse-to-fine across
    // the timeline, already decoded, so this side of the hook only has to file
    // them away — the drawing below is unchanged.
    const abort = new AbortController();

    loadFramePack(source, {
      signal: abort.signal,
      onFrame: (index, img) => {
        if (disposed || index >= frameCount) return;
        frames[index] = img;
        ready[index] = 1;
        // The first frame reveals the source resolution, which caps the
        // backing store. Any new frame may also beat what is on screen.
        if (index === 0) resize();
        needsPaint = true;
      },
    }).catch(() => {
      // A failed pack leaves the poster in place rather than a blank hero.
    });

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

    resize();
    progress?.set(current);

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    rafId = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      abort.abort();
      cancelAnimationFrame(rafId);
      observer.disconnect();
      // Every frame is backed by a blob: URL, which the document holds until
      // it is explicitly released.
      for (const img of frames) {
        if (img?.src?.startsWith("blob:")) URL.revokeObjectURL(img.src);
      }
    };
  }, [canvasRef, trackRef, posterRef, source, progress, staticProgress]);
}
