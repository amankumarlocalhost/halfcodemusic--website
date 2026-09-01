import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import PlayButton from "@/components/player/PlayButton";
import { YoutubeIcon } from "@/components/icons";

/** Large featured-release section used on the homepage. */
export default function FeaturedRelease({ release }) {
  return (
    <section id="music" className="relative overflow-hidden px-6 py-28 sm:py-36">
      <div aria-hidden className="absolute inset-0">
        <div className="absolute top-1/2 left-0 h-[32rem] w-[32rem] -translate-x-1/3 -translate-y-1/2 rounded-full bg-sage/50 blur-[130px]" />
        <div className="absolute top-1/4 right-0 h-96 w-96 translate-x-1/3 rounded-full bg-greige/50 blur-[120px]" />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative mx-auto w-full max-w-xl">
          <div
            aria-hidden
            className="absolute inset-0 scale-95 rounded-3xl bg-gradient-to-br from-sage/70 to-greige/60 blur-[90px]"
          />
          <div className="group relative block overflow-hidden rounded-3xl bg-gradient-to-br from-greige via-stone/70 to-sage p-px shadow-[0_18px_50px_rgba(37,39,36,0.08)] transition-transform duration-500 hover:scale-[1.02]">
            <Link href={`/music/${release.slug}`} className="relative block overflow-hidden rounded-[calc(1.5rem-1px)]">
              <Image
                src={release.cover}
                alt={`${release.title} — album artwork`}
                width={1280}
                height={1280}
                sizes="(min-width: 1024px) 36rem, 92vw"
                className="aspect-square h-auto w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </Link>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-ink/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="pointer-events-auto">
                <PlayButton track={release} size="lg" />
              </span>
            </div>
          </div>
        </Reveal>

        <div className="text-center lg:text-left">
          <Reveal>
            <span className="glass inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-dim uppercase">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon" />
              Featured Release
            </span>
            <h2 className="font-display mt-5 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-ink via-dim to-neon bg-clip-text text-transparent">
                {release.title}
              </span>
            </h2>
            <p className="mt-3 text-lg font-medium text-dim">{release.subtitle}</p>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="mx-auto mt-6 max-w-lg leading-relaxed text-dim lg:mx-0">{release.description}</p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              {release.tags.map((tag) => (
                <span key={tag} className="glass rounded-full px-4 py-1.5 text-xs font-medium text-ink/70">
                  {tag}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <a
                href={release.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full max-w-xs items-center justify-center gap-2.5 rounded-full bg-ink hover:bg-deep-soft px-8 py-4 text-sm font-semibold text-ivory shadow-[0_2px_12px_rgba(37,39,36,0.10)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(37,39,36,0.16)] sm:w-auto sm:max-w-none"
              >
                <YoutubeIcon className="h-5 w-5" />
                Watch on YouTube
              </a>
              <Link
                href={`/music/${release.slug}`}
                className="group inline-flex items-center gap-2 text-sm font-semibold text-ink/70 transition-colors hover:text-ink"
              >
                Release details
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
