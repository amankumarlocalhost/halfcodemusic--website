"use client";

import { useState } from "react";
import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import Lightbox from "@/components/Lightbox";

/** Editorial masonry-style grid with lazy-loaded images and a keyboard-accessible lightbox. */
export default function GalleryGrid({ images }) {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {images.map((image, i) => (
          <Reveal key={image.src} delay={(i % 3) * 0.08} className="mb-4 break-inside-avoid">
            <button
              type="button"
              onClick={() => setActiveIndex(i)}
              className="group relative block w-full overflow-hidden rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              aria-label={`Open ${image.alt}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                loading="lazy"
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
                className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
            </button>
          </Reveal>
        ))}
      </div>

      <Lightbox
        images={images}
        activeIndex={activeIndex}
        onClose={() => setActiveIndex(null)}
        onNavigate={setActiveIndex}
      />
    </>
  );
}
