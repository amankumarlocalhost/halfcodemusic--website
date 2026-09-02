"use client";

import Link from "next/link";
import { motion, useTransform } from "framer-motion";
import { ChevronDown, Globe, Headphones, Music } from "lucide-react";
import { YoutubeIcon, InstagramIcon } from "@/components/icons";
import { artist, stats } from "@/data/artist";
import { socialLinks } from "@/data/social";
import { site } from "@/lib/site";

/**
 * The hero's content layer, for narrow screens only.
 *
 * Desktop never renders this: `lg:hidden` keeps it out of the layout entirely
 * at >=1024px, so the desktop hero is exactly the bare frame sequence it was.
 *
 * Everything here clears as the sequence starts playing — opacity and a small
 * lift, both driven straight from the scroll `progress` MotionValue, so the
 * fade is locked to scroll position rather than to a timer.
 */

const STAT_ICONS = [Music, Headphones, Globe];

export default function HeroMobileOverlay({ progress, animate }) {
  // The lift is small and the fade finishes ahead of it: a larger rise looked
  // cluttered, because the copy slid up behind the navbar while still partly
  // visible and tangled with the wordmark. Mostly gone by 9%, fully by 12%.
  const opacity = useTransform(progress, [0, 0.09, 0.12], [1, 0.06, 0]);
  const lift = useTransform(progress, [0, 0.12], [0, -12]);
  // Once faded it must stop catching taps meant for the page behind it.
  const pointerEvents = useTransform(progress, (v) => (v > 0.1 ? "none" : "auto"));

  const style = animate ? { opacity, y: lift, pointerEvents } : undefined;

  return (
    <motion.div
      style={style}
      className="absolute inset-0 z-10 flex flex-col px-5 pt-20 pb-5 text-center will-change-[opacity,transform] lg:hidden"
    >
      {/* Lifts the frame behind the copy so it stays readable, heaviest where
          the text sits and lightest across the middle so the figure still
          reads. Inside the fading layer, so it clears along with the words
          rather than dimming the sequence once it starts. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(244,243,238,0.94)_0%,rgba(244,243,238,0.86)_26%,rgba(244,243,238,0.38)_46%,rgba(244,243,238,0.34)_66%,rgba(244,243,238,0.88)_88%,rgba(244,243,238,0.94)_100%)]"
      />

      {/* ---------------------------------------------------------- headline */}
      <div className="relative shrink-0">
        <span className="inline-flex items-center rounded-full border border-line px-4 py-1.5 text-[10px] font-semibold tracking-[0.18em] text-dim uppercase">
          Indie · Coded · Emotion
        </span>

        <h1 className="mt-4 font-display text-[2rem] leading-[1.08] font-bold tracking-tight text-ink sm:text-4xl">
          Music,
          <br />
          coded with
          <br />
          <span className="text-neon italic">emotion.</span>
        </h1>

        <p className="mx-auto mt-3 max-w-[21rem] text-[0.8rem] leading-relaxed text-dim">
          {artist.description}
        </p>

        <Link
          href="/music"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-ivory shadow-[0_2px_10px_rgba(37,39,36,0.10)] transition-colors duration-300 hover:bg-deep-soft"
        >
          <BrandMark />
          Listen Now
        </Link>
      </div>

      {/* ------------------------------------- stats + quote, flanking the frame */}
      <div className="relative flex-1">
        <ul className="absolute top-1/2 left-0 -translate-y-1/2 space-y-4 text-left">
          {stats.map((stat, i) => {
            const Icon = STAT_ICONS[i] ?? Music;
            return (
              <li key={stat.label} className="border-b border-line/70 pb-3 last:border-0">
                <Icon className="mb-1 h-4 w-4 text-neon" aria-hidden />
                <p className="font-display text-lg leading-none font-bold text-ink">
                  {stat.value}
                  {stat.suffix}
                </p>
                <p className="mt-0.5 text-[10px] text-dim">{stat.label}</p>
              </li>
            );
          })}
        </ul>

        <figure className="absolute top-1/2 right-0 max-w-[7.5rem] -translate-y-1/2 text-right">
          {/* Small static waveform — a visual echo of the desktop hero's bars. */}
          <svg viewBox="0 0 88 24" aria-hidden className="mb-3 ml-auto h-5 w-22 text-stone">
            {Array.from({ length: 26 }, (_, i) => {
              const h = 3 + Math.round(18 * Math.abs(Math.sin(i * 0.7)));
              return (
                <rect
                  key={i}
                  x={i * 3.4}
                  y={(24 - h) / 2}
                  width="1.4"
                  height={h}
                  rx="0.7"
                  fill="currentColor"
                />
              );
            })}
          </svg>
          <blockquote className="text-[0.8rem] leading-snug text-dim italic">
            “{artist.philosophy[0].body.split(",")[0]}.”
          </blockquote>
          <span aria-hidden className="mt-2 ml-auto block h-px w-8 bg-line" />
          <figcaption className="mt-2 text-[10px] text-muted">{site.name}</figcaption>
        </figure>
      </div>

      {/* ------------------------------------------------------------ footer */}
      <div className="relative shrink-0 space-y-4">
        <div className="glass mx-auto flex items-center justify-center gap-4 rounded-2xl px-4 py-2.5">
          <span className="text-[9px] font-semibold tracking-[0.14em] text-muted uppercase">
            Available on
          </span>
          <span aria-hidden className="h-4 w-px bg-line" />
          {socialLinks.map((platform) => {
            const Icon = platform.id === "youtube" ? YoutubeIcon : InstagramIcon;
            return (
              <a
                key={platform.id}
                href={platform.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[11px] font-medium text-ink transition-colors hover:text-dim"
              >
                <Icon className="h-3.5 w-3.5" />
                {platform.label}
              </a>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="text-[9px] font-semibold tracking-[0.18em] text-muted uppercase">
            Scroll to explore
          </span>
          <ChevronDown aria-hidden className="h-4 w-4 text-ink/40" />
        </div>
      </div>
    </motion.div>
  );
}

/** The brand mark used inside the Listen Now button. */
function BrandMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4" fill="currentColor">
      <rect x="3" y="9" width="2.2" height="6" rx="1.1" />
      <rect x="7" y="6" width="2.2" height="12" rx="1.1" />
      <rect x="11" y="3" width="2.2" height="18" rx="1.1" />
      <path
        d="M16.5 8.5 L20.5 12 L16.5 15.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
