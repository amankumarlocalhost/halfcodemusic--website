import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import { AppleIcon, SpotifyIcon, YoutubeIcon } from "@/components/icons";
import { latestRelease } from "@/lib/site";

const platforms = [
  { label: "Spotify", href: latestRelease.links.spotify, Icon: SpotifyIcon },
  { label: "YouTube", href: latestRelease.links.youtube, Icon: YoutubeIcon },
  { label: "Apple Music", href: latestRelease.links.appleMusic, Icon: AppleIcon },
];

export default function LatestRelease() {
  return (
    <section id="music" className="relative px-6 py-28 sm:py-36">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative mx-auto w-full max-w-md">
          {/* glow behind the artwork */}
          <div
            aria-hidden
            className="absolute inset-0 scale-90 rounded-3xl bg-violet-600/30 blur-[80px]"
          />
          <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-violet-950/50 transition-transform duration-500 hover:scale-[1.02]">
            <Image
              src={latestRelease.cover}
              alt={`${latestRelease.title} — album artwork`}
              width={800}
              height={800}
              className="h-auto w-full"
              priority
            />
          </div>
        </Reveal>

        <div className="text-center lg:text-left">
          <Reveal>
            <span className="text-xs font-semibold tracking-[0.25em] text-violet-400 uppercase">
              Latest Release
            </span>
            <h2 className="font-display mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              {latestRelease.title}
            </h2>
            <p className="mt-3 text-lg text-white/50">{latestRelease.artist}</p>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="mx-auto mt-6 max-w-lg leading-relaxed text-white/60 lg:mx-0">
              {latestRelease.description}
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              {platforms.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-500/60 hover:bg-violet-600/15 hover:shadow-[0_0_24px_rgba(139,92,246,0.35)]"
                >
                  <Icon className="h-4.5 w-4.5" />
                  {label}
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
