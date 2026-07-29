"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Play, ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import Button from "@/components/ui/Button";
import { site, latestRelease } from "@/lib/site";

/**
 * Slow-drifting gradient orbs with a scroll parallax.
 * Only transform/opacity are animated, so everything stays on the compositor.
 */
function GradientBackdrop({ animate, scrollProgress }) {
  const y1 = useTransform(scrollProgress, [0, 1], [0, 140]);
  const y2 = useTransform(scrollProgress, [0, 1], [0, -100]);

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <motion.div
        style={{ y: y1 }}
        className="absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-violet-600/25 blur-[120px] will-change-transform"
        animate={animate ? { scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] } : undefined}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute top-1/3 -left-40 h-96 w-96 rounded-full bg-cyan-500/15 blur-[110px] will-change-transform"
        animate={animate ? { x: [0, 60, 0] } : undefined}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        style={{ y: y1 }}
        className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-fuchsia-600/15 blur-[110px] will-change-transform"
        animate={animate ? { x: [0, -50, 0] } : undefined}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
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

/** Full-width animated waveform along the bottom of the hero. */
function Waveform({ animate }) {
  const bars = Array.from({ length: 40 }, (_, i) =>
    14 + Math.round(34 * Math.abs(Math.sin(i * 0.55)))
  );

  return (
    <div
      aria-hidden
      className="absolute inset-x-0 bottom-14 flex h-16 items-end justify-center gap-1 opacity-70 [mask-image:linear-gradient(to_right,transparent,black_25%,black_75%,transparent)] sm:gap-1.5"
    >
      {bars.map((height, i) => (
        <motion.span
          key={i}
          className="w-1 origin-bottom rounded-full bg-gradient-to-t from-violet-600/80 to-cyan-400/70 will-change-transform sm:w-1.5"
          style={{ height }}
          animate={animate ? { scaleY: [1, 0.3, 1] } : undefined}
          transition={{
            duration: 1.3 + (i % 4) * 0.25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.07,
          }}
        />
      ))}
    </div>
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

  return (
    <section
      ref={ref}
      id="home"
      className="relative flex min-h-svh flex-col items-center justify-center px-6 pt-24 pb-32 text-center"
    >
      <GradientBackdrop animate={animate} scrollProgress={scrollYProgress} />
      <GridBackdrop />

      <motion.div
        className="relative z-10 mx-auto max-w-4xl will-change-transform"
        style={animate ? { y: contentY, opacity: contentOpacity } : undefined}
        initial={animate ? { opacity: 0, y: 32 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        <a
          href="#music"
          className="glass group mb-8 inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-violet-700 transition-all duration-300 hover:border-violet-500/40 hover:shadow-[0_0_28px_rgba(124,58,237,0.2)] sm:px-5 sm:text-sm"
        >
          <Sparkles className="h-3.5 w-3.5 text-neon" />
          New Release — {latestRelease.title}
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </a>

        <h1 className="font-display text-[clamp(2.1rem,10.5vw,3rem)] leading-[1.05] font-bold tracking-tight drop-shadow-[0_0_40px_rgba(124,58,237,0.2)] sm:text-7xl lg:text-8xl">
          <span className="text-shimmer">HalfCodeMusic</span>
        </h1>

        <p className="mt-6 text-[10px] font-semibold tracking-[0.22em] text-violet-700/80 uppercase sm:text-sm sm:tracking-[0.35em]">
          {site.tagline}
        </p>

        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-dim sm:text-lg">
          {site.description}
        </p>

        <div className="mt-10 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">
          <Button href="#music" className="w-full max-w-xs sm:w-auto sm:max-w-none">
            <Play className="h-4 w-4 fill-current" />
            Listen Now
          </Button>
          <Button href="#connect" variant="ghost" className="w-full max-w-xs sm:w-auto sm:max-w-none">
            Let&apos;s Connect
          </Button>
        </div>
      </motion.div>

      <Waveform animate={animate} />

      <motion.a
        href="#music"
        aria-label="Scroll to latest release"
        className="absolute bottom-4 text-ink/40 transition-colors hover:text-ink"
        animate={animate ? { y: [0, 8, 0] } : undefined}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="h-5 w-5" />
      </motion.a>
    </section>
  );
}
