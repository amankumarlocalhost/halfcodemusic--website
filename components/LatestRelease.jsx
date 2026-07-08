import Image from "next/image";
import { Play } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { YoutubeIcon } from "@/components/icons";
import { latestRelease } from "@/lib/site";

export default function LatestRelease() {
  return (
    <section id="music" className="relative overflow-hidden px-6 py-28 sm:py-36">
      {/* ambient section glows */}
      <div aria-hidden className="absolute inset-0">
        <div className="absolute top-1/2 left-0 h-[32rem] w-[32rem] -translate-x-1/3 -translate-y-1/2 rounded-full bg-violet-600/20 blur-[130px]" />
        <div className="absolute top-1/4 right-0 h-96 w-96 translate-x-1/3 rounded-full bg-fuchsia-600/15 blur-[120px]" />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative mx-auto w-full max-w-xl">
          {/* glow behind the artwork */}
          <div
            aria-hidden
            className="absolute inset-0 scale-95 rounded-3xl bg-gradient-to-br from-violet-500/50 to-fuchsia-500/35 blur-[90px]"
          />
          <a
            href={latestRelease.links.youtube}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Play ${latestRelease.title} on YouTube`}
            className="group relative block rounded-3xl bg-gradient-to-br from-violet-400/40 via-white/10 to-fuchsia-400/30 p-px shadow-2xl shadow-violet-950/50 transition-transform duration-500 hover:scale-[1.02]"
          >
            <div className="relative overflow-hidden rounded-[calc(1.5rem-1px)]">
              <Image
                src={latestRelease.cover}
                alt={`${latestRelease.title} — album artwork`}
                width={1280}
                height={720}
                className="h-auto w-full transition-transform duration-700 group-hover:scale-105"
                priority
              />
              {/* play overlay on hover */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-[0_0_48px_rgba(139,92,246,0.8)]">
                  <Play className="ml-1 h-8 w-8 fill-current text-white" />
                </span>
              </div>
            </div>
          </a>
        </Reveal>

        <div className="text-center lg:text-left">
          <Reveal>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-violet-500/30 bg-violet-600/10 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-violet-300 uppercase">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-fuchsia-400" />
              Latest Release
            </span>
            <h2 className="font-display mt-5 text-4xl font-bold tracking-tight sm:text-6xl">
              <span className="bg-gradient-to-r from-white via-violet-100 to-violet-300 bg-clip-text text-transparent">
                {latestRelease.title}
              </span>
            </h2>
            <p className="mt-3 text-lg font-medium text-violet-300/80">
              {latestRelease.artist}
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="mx-auto mt-6 max-w-lg leading-relaxed text-white/70 lg:mx-0">
              {latestRelease.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              {latestRelease.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <a
                href={latestRelease.links.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-4 text-sm font-semibold text-white shadow-[0_0_36px_rgba(139,92,246,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_56px_rgba(217,70,239,0.6)]"
              >
                <YoutubeIcon className="h-5 w-5" />
                Watch on YouTube
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
