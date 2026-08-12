import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { galleryImages } from "@/data/gallery";

export default function GalleryPreview() {
  return (
    <section aria-labelledby="gallery-preview-heading" className="relative px-6 py-28 sm:py-36">
      <SectionHeading eyebrow="Visuals" title="Behind the" highlight="sound." />

      <Reveal delay={0.15} className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3">
        {galleryImages.slice(0, 3).map((image) => (
          <div key={image.src} className="relative aspect-square overflow-hidden rounded-2xl">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 640px) 30vw, 45vw"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        ))}
      </Reveal>

      <Reveal delay={0.25} className="mt-10 flex justify-center">
        <Link
          href="/gallery"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-ink/70 transition-colors hover:text-ink"
        >
          View the full gallery
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </Reveal>
    </section>
  );
}
