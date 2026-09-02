"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import PackedImage from "@/components/gallery/PackedImage";

export default function Lightbox({ images, fullVariant, activeIndex, onClose, onNavigate }) {
  const closeRef = useRef(null);
  const active = activeIndex !== null ? images[activeIndex] : null;

  useEffect(() => {
    if (active === null) return;
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((activeIndex + 1) % images.length);
      if (e.key === "ArrowLeft") onNavigate((activeIndex - 1 + images.length) % images.length);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, activeIndex, images.length, onClose, onNavigate]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/90 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={active.alt}
          onClick={onClose}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close image"
            className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-ivory/10 text-ivory transition-colors hover:bg-ivory/20"
          >
            <X className="h-5 w-5" />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate((activeIndex - 1 + images.length) % images.length);
                }}
                aria-label="Previous image"
                className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full bg-ivory/10 text-ivory transition-colors hover:bg-ivory/20 sm:left-6"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate((activeIndex + 1) % images.length);
                }}
                aria-label="Next image"
                className="absolute right-3 flex h-10 w-10 items-center justify-center rounded-full bg-ivory/10 text-ivory transition-colors hover:bg-ivory/20 sm:right-6"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          <motion.div
            key={active.src ?? `packed-${active.packIndex}`}
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative max-h-[85vh] max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            {active.packIndex != null ? (
              // Opening the lightbox is what triggers the full-size pack's
              // download — see scripts/pack-gallery.mjs for why the big copies
              // are not shipped to every visitor. Until it lands, PackedImage
              // holds the blurred poster, so the frame is never empty.
              //
              // The box is sized from the photo's own aspect ratio, capped to
              // the viewport, so the panel does not resize once it decodes.
              <span
                className="relative block overflow-hidden rounded-xl shadow-2xl"
                style={{
                  aspectRatio: `${active.width} / ${active.height}`,
                  // Width is the only thing set; aspect-ratio derives the
                  // height. The third term is what keeps a tall portrait from
                  // overflowing 85vh.
                  width: `min(56rem, 92vw, calc(85vh * ${active.width / active.height}))`,
                }}
              >
                <PackedImage
                  variant={fullVariant}
                  index={active.packIndex}
                  alt={active.alt}
                  poster={active.poster}
                  fit="contain"
                />
              </span>
            ) : (
              <Image
                src={active.src}
                alt={active.alt}
                width={active.width}
                height={active.height}
                className="max-h-[85vh] w-auto rounded-xl object-contain shadow-2xl"
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
