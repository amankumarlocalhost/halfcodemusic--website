"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Pause, Play, ArrowRight, Sparkles, ChevronDown, Radio } from "lucide-react";
import Button from "@/components/ui/Button";
import { site } from "@/lib/site";
import { featuredRelease } from "@/data/music";
import { usePlayer } from "@/components/player/PlayerProvider";

/**
 * Slow-drifting gradient orbs with a scroll parallax.
 * Only transform/opacity are animated, so everything stays on the compositor.
 */
function GradientBackdrop({ animate, scrollProgress, isPlaying }) {
  const y1 = useTransform(scrollProgress, [0, 1], [0, 140]);
  const y2 = useTransform(scrollProgress, [0, 1], [0, -100]);

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <motion.div
        style={{ y: y1 }}
        className="absolute -top-40 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-violet-600/30 blur-[130px] will-change-transform"
        animate={
          animate
            ? { scale: isPlaying ? [1, 1.22, 1] : [1, 1.15, 1], opacity: [0.75, 1, 0.75] }
            : undefined
        }
        transition={{ duration: isPlaying ? 5 : 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute top-1/3 -left-40 h-96 w-96 rounded-full bg-cyan-500/20 blur-[110px] will-change-transform"
        animate={animate ? { x: [0, 60, 0] } : undefined}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        style={{ y: y1 }}
        className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-[110px] will-change-transform"
        animate={animate ? { x: [0, -50, 0] } : undefined}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* soft central vignette for cinematic depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_38%,rgba(124,58,237,0.08),transparent_70%)]" />
    </div>
  );
}

/** Faint grid that fades out toward the edges. */
function GridBackdrop() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(rgba(24,24,31,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(24,24,31,0.05)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_65%_60%_at_50%_40%,black,transparent)]"
    />
  );
}

/** Cursor-follow glow — cheap radial spotlight driven by CSS custom properties. */
function CursorSpotlight({ x, y }) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden opacity-0 transition-opacity duration-500 will-change-transform lg:block lg:group-hover:opacity-100"
      style={{
        background: useTransform(
          [x, y],
          ([latestX, latestY]) =>
            `radial-gradient(420px circle at ${latestX}px ${latestY}px, rgba(124,58,237,0.14), transparent 70%)`
        ),
      }}
    />
  );
}

/** Full-width animated waveform along the bottom of the hero — reacts to real playback. */
function Waveform({ animate, isPlaying }) {
  const bars = Array.from({ length: 40 }, (_, i) =>
    14 + Math.round(34 * Math.abs(Math.sin(i * 0.55)))
  );

  return (
    <div
      aria-hidden
      className={`absolute inset-x-0 bottom-14 flex h-16 items-end justify-center gap-1 transition-opacity duration-500 [mask-image:linear-gradient(to_right,transparent,black_25%,black_75%,transparent)] sm:gap-1.5 ${
        isPlaying ? "opacity-100" : "opacity-60"
      }`}
    >
      {bars.map((height, i) => (
        <motion.span
          key={i}
          className={`w-1 origin-bottom rounded-full will-change-transform sm:w-1.5 ${
            isPlaying ? "bg-gradient-to-t from-violet-600 to-cyan-300" : "bg-gradient-to-t from-violet-600/80 to-cyan-400/70"
          }`}
          style={{ height }}
          animate={animate ? { scaleY: isPlaying ? [1, 0.15, 1] : [1, 0.3, 1] } : undefined}
          transition={{
            duration: (isPlaying ? 0.7 : 1.3) + (i % 4) * 0.25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.07,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Floating featured-release artwork — the hero's visual anchor. Desktop-only
 * (mobile keeps the hero text-led and uncluttered). Tilts toward the cursor,
 * glows with a slow-rotating conic ring, and actually plays the release.
 */
function FloatingArtwork({ animate, mouseX, mouseY }) {
  const { track, isPlaying, play, toggle } = usePlayer();
  const isActive = track?.slug === featuredRelease.slug;
  const playing = isActive && isPlaying;

  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);
  const springX = useSpring(rotateY, { stiffness: 120, damping: 14 });
  const springY = useSpring(rotateX, { stiffness: 120, damping: 14 });

  return (
    <motion.div
      className="absolute top-1/2 right-[6%] z-0 hidden -translate-y-1/2 will-change-transform lg:block xl:right-[10%]"
      style={{ perspective: 1000 }}
      initial={animate ? { opacity: 0, x: 40, rotate: 10 } : false}
      animate={{ opacity: 1, x: 0, rotate: 6 }}
      transition={{ duration: 1.1, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      <motion.div
        className="relative"
        style={animate ? { rotateX: springY, rotateY: springX } : undefined}
        animate={animate ? { y: [0, -18, 0], rotate: [6, 2, 6] } : undefined}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* rotating conic glow ring — spins faster while the track is playing */}
        <motion.div
          aria-hidden
          className="absolute -inset-10 rounded-[2.5rem] opacity-60 blur-2xl will-change-transform"
          style={{
            background:
              "conic-gradient(from 0deg, rgba(124,58,237,0.55), rgba(34,211,238,0.4), rgba(217,70,239,0.5), rgba(124,58,237,0.55))",
          }}
          animate={animate ? { rotate: 360 } : undefined}
          transition={{ duration: playing ? 6 : 16, repeat: Infinity, ease: "linear" }}
        />

        <div className="glass group/art relative w-56 overflow-hidden rounded-[1.75rem] p-2.5 shadow-[0_30px_80px_-20px_rgba(124,58,237,0.55)] xl:w-64">
          <button
            type="button"
            onClick={() => (isActive ? toggle() : play(featuredRelease, [featuredRelease]))}
            aria-label={playing ? `Pause ${featuredRelease.title}` : `Play ${featuredRelease.title}`}
            className="pointer-events-auto relative block aspect-square w-full overflow-hidden rounded-2xl"
          >
            <Image
              src={featuredRelease.cover}
              alt={`${featuredRelease.title} — cover artwork`}
              fill
              priority
              sizes="256px"
              className="object-cover transition-transform duration-500 group-hover/art:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-transparent" />
            <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover/art:opacity-100">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-ink shadow-lg">
                {playing ? <Pause className="h-4.5 w-4.5 fill-current" /> : <Play className="ml-0.5 h-4.5 w-4.5 fill-current" />}
              </span>
            </span>
          </button>

          <div className="flex items-center gap-2 px-1.5 pt-3 pb-1.5">
            <span className="relative flex h-2 w-2 shrink-0">
              {playing && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon opacity-75" />
              )}
              <span className={`relative inline-flex h-2 w-2 rounded-full ${playing ? "bg-neon" : "bg-ink/25"}`} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-ink">{featuredRelease.title}</p>
              <p className="truncate text-[10px] text-dim">{playing ? "Now playing" : featuredRelease.artist}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/** Small brand-identity chip balancing the composition on wide screens. */
function IdentityBadge({ animate }) {
  return (
    <motion.div
      className="glass absolute top-[26%] left-[8%] z-0 hidden items-center gap-2.5 rounded-2xl px-4 py-3 will-change-transform xl:flex"
      initial={animate ? { opacity: 0, y: -20 } : false}
      animate={animate ? { opacity: 1, y: [0, 10, 0] } : { opacity: 1 }}
      transition={
        animate
          ? { y: { duration: 8, repeat: Infinity, ease: "easeInOut" }, opacity: { duration: 1, delay: 0.6 } }
          : undefined
      }
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 text-white">
        <Radio className="h-4 w-4" />
      </span>
      <div className="text-left">
        <p className="text-xs font-semibold text-ink">Independent Producer</p>
        <p className="text-[10px] text-dim">Self-written · Self-produced</p>
      </div>
    </motion.div>
  );
}

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const animate = !reduceMotion;
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlightX = useMotionValue(0);
  const spotlightY = useMotionValue(0);

  const { track, isPlaying } = usePlayer();
  const heroIsPlaying = track?.slug === featuredRelease.slug && isPlaying;

  const handlePointerMove = (e) => {
    if (!animate) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
    spotlightX.set(e.clientX - rect.left);
    spotlightY.set(e.clientY - rect.top);
  };

  const handlePointerLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="group relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-32 text-center"
    >
      <GradientBackdrop animate={animate} scrollProgress={scrollYProgress} isPlaying={heroIsPlaying} />
      <GridBackdrop />
      <CursorSpotlight x={spotlightX} y={spotlightY} />
      <IdentityBadge animate={animate} />
      <FloatingArtwork animate={animate} mouseX={mouseX} mouseY={mouseY} />

      <motion.div
        className="relative z-10 mx-auto max-w-4xl will-change-transform"
        style={animate ? { y: contentY, opacity: contentOpacity } : undefined}
        initial={animate ? { opacity: 0, y: 32 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        <Link
          href={`/music/${featuredRelease.slug}`}
          className="glass group/pill mb-8 inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-violet-700 transition-all duration-300 hover:border-violet-500/40 hover:shadow-[0_0_28px_rgba(124,58,237,0.2)] sm:px-5 sm:text-sm"
        >
          <Sparkles className="h-3.5 w-3.5 text-neon" />
          New Release — {featuredRelease.title}
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/pill:translate-x-1" />
        </Link>

        <h1 className="font-display text-[clamp(2.3rem,11vw,3rem)] leading-[1.05] font-bold tracking-tight drop-shadow-[0_0_50px_rgba(124,58,237,0.28)] sm:text-7xl lg:text-8xl">
          <span className="text-shimmer">HalfCodeMusic</span>
        </h1>

        <div className="mx-auto mt-6 flex items-center justify-center gap-3">
          <span aria-hidden className="h-px w-8 bg-gradient-to-r from-transparent to-violet-500/60" />
          <p className="text-[10px] font-semibold tracking-[0.22em] text-violet-700/80 uppercase sm:text-sm sm:tracking-[0.35em]">
            {site.tagline}
          </p>
          <span aria-hidden className="h-px w-8 bg-gradient-to-l from-transparent to-violet-500/60" />
        </div>

        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-dim sm:text-lg">
          {site.description}
        </p>

        <div className="mt-10 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">
          <Button href="/music" className="w-full max-w-xs shadow-[0_0_40px_rgba(139,92,246,0.55)] sm:w-auto sm:max-w-none">
            <Play className="h-4 w-4 fill-current" />
            Explore Music
          </Button>
          <Button href={featuredRelease.youtubeUrl} variant="ghost" className="w-full max-w-xs sm:w-auto sm:max-w-none" target="_blank" rel="noopener noreferrer">
            Watch Latest Video
          </Button>
        </div>
      </motion.div>

      <Waveform animate={animate} isPlaying={heroIsPlaying} />

      <motion.a
        href="#featured-release"
        aria-label="Scroll to featured release"
        className="absolute bottom-4 text-ink/40 transition-colors hover:text-ink"
        animate={animate ? { y: [0, 8, 0] } : undefined}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="h-5 w-5" />
      </motion.a>
    </section>
  );
}
