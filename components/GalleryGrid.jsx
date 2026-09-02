"use client";

import { useState } from "react";
import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import Lightbox from "@/components/Lightbox";
import PackedImage from "@/components/gallery/PackedImage";

/**
 * Editorial masonry-style grid with a keyboard-accessible lightbox.
 *
 * Each entry renders one of two ways:
 *   - packed  (`packIndex` is a number) — the photo lives inside a masked
 *     binary and is painted to a canvas. See scripts/pack-gallery.mjs.
 *   - plain   (`src` is a path) — an ordinary next/image, for artwork that is
 *     meant to be shareable, such as release covers.
 *
 * Both shapes carry alt/width/height, so layout and the lightbox do not care
 * which one they are looking at.
 */
export default function GalleryGrid({ images, thumbVariant, fullVariant }) {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {images.map((image, i) => (
          <Reveal
            key={image.src ?? `packed-${image.packIndex}`}
            delay={(i % 3) * 0.08}
            className="mb-4 break-inside-avoid"
          >
            <button
              type="button"
              onClick={() => setActiveIndex(i)}
              className="group relative block w-full overflow-hidden rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              aria-label={`Open ${image.alt}`}
            >
              {image.packIndex != null ? (
                // The wrapper holds the cell open at the photo's own aspect
                // ratio before it has decoded, so the masonry columns do not
                // reflow as the pack streams in.
                <span
                  className="relative block w-full overflow-hidden"
                  style={{ aspectRatio: `${image.width} / ${image.height}` }}
                >
                  <PackedImage
                    variant={thumbVariant}
                    index={image.packIndex}
                    alt={image.alt}
                    poster={image.poster}
                    fit="cover"
                    labelled={false}
                    className="transition-transform duration-700 group-hover:scale-105"
                  />
                </span>
              ) : (
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  loading="lazy"
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
                  className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/10" />
            </button>
          </Reveal>
        ))}
      </div>

      <Lightbox
        images={images}
        fullVariant={fullVariant}
        activeIndex={activeIndex}
        onClose={() => setActiveIndex(null)}
        onNavigate={setActiveIndex}
      />
    </>
  );
}
