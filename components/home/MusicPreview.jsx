import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import MusicCard from "@/components/MusicCard";
import { releases } from "@/data/music";

export default function MusicPreview() {
  return (
    <section aria-labelledby="music-preview-heading" className="relative px-6 py-28 sm:py-36">
      <SectionHeading eyebrow="Discography" title="Every release," highlight="one place." />

      <Reveal
        delay={0.15}
        className="mx-auto mt-14 grid max-w-6xl grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4"
      >
        {releases.map((release) => (
          <MusicCard key={release.slug} release={release} queue={releases} />
        ))}
      </Reveal>

      <Reveal delay={0.25} className="mt-12 flex justify-center">
        <Link
          href="/music"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-ink/70 transition-colors hover:text-ink"
        >
          Explore the full catalog
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </Reveal>
    </section>
  );
}
