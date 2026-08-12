import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { artist } from "@/data/artist";

export default function AboutPreview() {
  return (
    <section aria-labelledby="about-preview-heading" className="relative px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="The Artist"
          title="Music, coded with"
          highlight="emotion."
          lede={artist.shortBio}
        />

        <Reveal delay={0.15} className="mt-14 grid gap-6 sm:grid-cols-3">
          {artist.philosophy.map((item) => (
            <div key={item.title} className="glass rounded-2xl px-6 py-7">
              <h3 className="font-display font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-dim">{item.body}</p>
            </div>
          ))}
        </Reveal>

        <Reveal delay={0.25} className="mt-10 flex justify-center">
          <Link
            href="/about"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-ink/70 transition-colors hover:text-ink"
          >
            Read the full story
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
