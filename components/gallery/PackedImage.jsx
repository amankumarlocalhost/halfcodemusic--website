"use client";

import { useEffect, useRef } from "react";
import { subscribeToPack } from "@/components/gallery/galleryPack";

/**
 * Paints one photo out of a packed variant onto a <canvas>.
 *
 * WHY A CANVAS AND NOT AN <img>
 * The pack already keeps photos from having their own URLs, but a decoded photo
 * still has to reach the screen somehow. Handing it to an <img> would put a
 * `blob:` URL in the DOM, and "Open image in new tab" on that URL hands over the
 * full-resolution file. Worse, every blob: URL is logged in the DevTools Network
 * panel as its own request with a working Preview tab, so a grid of N photos
 * would produce N inspectable image entries and give back everything the pack
 * was meant to withhold.
 *
 * So no URL is ever created: createImageBitmap decodes the Blob straight to
 * pixels, and the canvas draws it. Nothing to open, nothing to copy the address
 * of, nothing for "Save image as" to act on, and nothing in the Network panel.
 * Recovering a photo means calling toDataURL in the console — a different class
 * of effort from a right-click.
 *
 * A poster sits underneath: a 24px blurred copy from the manifest, stretched to
 * fill and inlined as a data URI, so a cell is never an empty box. It is
 * discarded the moment the canvas has real pixels of its own.
 *
 * @param {object}  props
 * @param {object}  props.variant  a variant from lib/galleryManifest.json
 * @param {number}  props.index    which photo in that pack
 * @param {string}  props.alt
 * @param {string}  props.poster   data: URI placeholder
 * @param {"cover"|"contain"} props.fit  cover for grid cells, contain for the lightbox
 * @param {boolean} props.labelled  false when an ancestor already names the image
 */
export default function PackedImage({
  variant,
  index,
  alt,
  poster,
  fit = "cover",
  labelled = true,
  className = "",
}) {
  const canvasRef = useRef(null);
  const posterRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !variant) return;

    const ctx = canvas.getContext("2d");

    let image = null;
    let cssWidth = 0;
    let cssHeight = 0;
    let posterHidden = false;

    const resize = () => {
      // Layout size rather than getBoundingClientRect, so an animated ancestor
      // (Reveal wraps these) cannot resize — and therefore clear — the canvas
      // mid-transition.
      cssWidth = canvas.clientWidth;
      cssHeight = canvas.clientHeight;
      if (!cssWidth || !cssHeight) return;

      // Never build a backing store finer than the photo can actually feed;
      // past that it is pure fill-rate for no extra detail.
      const useful = image ? Math.max(1, image.naturalWidth / cssWidth) : 2;
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
      paint();
    };

    const paint = () => {
      if (!image || !cssWidth || !cssHeight) return;

      // cover fills the cell and crops the overflow; contain fits the whole
      // photo inside the box. Only the scale choice differs between them.
      const scale =
        fit === "cover"
          ? Math.max(cssWidth / image.width, cssHeight / image.height)
          : Math.min(cssWidth / image.width, cssHeight / image.height);

      const w = image.width * scale;
      const h = image.height * scale;

      ctx.clearRect(0, 0, cssWidth, cssHeight);
      ctx.drawImage(image, (cssWidth - w) / 2, (cssHeight - h) / 2, w, h);

      if (!posterHidden) {
        posterHidden = true;
        if (posterRef.current) posterRef.current.style.visibility = "hidden";
      }
    };

    let bytes = null;
    let decoding = false;
    // Grid cells far below the fold should not decode: a decoded photo costs
    // several MB of pixels against a few tens of KB encoded, so a long gallery
    // would otherwise pin hundreds of MB before the visitor scrolled to it.
    let visible = false;
    let cancelled = false;

    const decode = () => {
      if (!bytes || !visible || image || decoding) return;
      decoding = true;
      createImageBitmap(new Blob([bytes], { type: "image/webp" }))
        .then((bitmap) => {
          if (cancelled) {
            bitmap.close();
            return;
          }
          image = bitmap;
          // The photo reveals its true resolution, which caps the backing store.
          resize();
        })
        .catch(() => {
          // A photo that will not decode leaves this cell on its poster.
        })
        .finally(() => {
          decoding = false;
        });
    };

    const unsubscribe = subscribeToPack(variant, (i, chunk) => {
      if (i !== index) return;
      bytes = chunk;
      decode();
    });

    // Generous margin, so a photo is ready well before it is scrolled into view.
    const nearViewport = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          visible = true;
          nearViewport.disconnect();
          decode();
        }
      },
      { rootMargin: "400px" }
    );
    nearViewport.observe(canvas);

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    return () => {
      cancelled = true;
      unsubscribe();
      observer.disconnect();
      nearViewport.disconnect();
      // An ImageBitmap holds its pixels until closed. The encoded bytes stay in
      // the pack cache for a remount; these decoded pixels do not.
      if (image) image.close();
    };
  }, [variant, index, fit]);

  return (
    <>
      {/* next/image is deliberately not used here: this is a 24px data: URI
          from the manifest, so there is no request to optimise and no remote
          asset to route through the image pipeline. Sending it through
          next/image would add a loader round trip for a few hundred bytes. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={posterRef}
        src={poster}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-xl"
        draggable={false}
      />
      <canvas
        ref={canvasRef}
        role={labelled ? "img" : undefined}
        aria-label={labelled ? alt : undefined}
        aria-hidden={labelled ? undefined : "true"}
        className={`relative h-full w-full ${className}`}
      />
    </>
  );
}
