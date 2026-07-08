"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Music2, Disc3, Play, ArrowRight, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import { site, latestRelease } from "@/lib/site";

/** Slow-drifting blurred gradient orbs behind the hero content. */
function GradientBackdrop({ animate }) {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-violet-600/30 blur-[120px]"
        animate={animate ? { scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] } : undefined}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 -left-40 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-[110px]"
        animate={animate ? { x: [0, 60, 0], y: [0, -40, 0] } : undefined}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-indigo-600/20 blur-[110px]"
        animate={animate ? { x: [0, -50, 0], y: [0, 30, 0] } : undefined}
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
      className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_65%_60%_at_50%_40%,black,transparent)]"
    />
  );
}

/** Very subtle floating music glyphs. */
function FloatingShapes({ animate }) {
  const shapes = [
    { Icon: Music2, className: "left-[12%] top-[28%] h-6 w-6", duration: 9, delay: 0 },
    { Icon: Disc3, className: "right-[14%] top-[24%] h-8 w-8", duration: 12, delay: 1.5 },
    { Icon: Play, className: "left-[20%] bottom-[22%] h-5 w-5", duration: 10, delay: 3 },
    { Icon: Music2, className: "right-[22%] bottom-[28%] h-5 w-5", duration: 11, delay: 2 },
  ];

  return (
    <div aria-hidden className="absolute inset-0 hidden overflow-hidden sm:block">
      {shapes.map(({ Icon, className, duration, delay }, i) => (
        <motion.span
          key={i}
          className={`absolute text-violet-400/20 ${className}`}
          animate={animate ? { y: [0, -18, 0], rotate: [0, 8, 0] } : undefined}
          transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <Icon className="h-full w-full" />
        </motion.span>
      ))}
    </div>
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
      className="absolute inset-x-0 bottom-8 flex h-16 items-end justify-center gap-1 opacity-70 [mask-image:linear-gradient(to_right,transparent,black_25%,black_75%,transparent)] sm:gap-1.5"
    >
      {bars.map((height, i) => (
        <motion.span
          key={i}
          className="w-1 origin-bottom rounded-full bg-gradient-to-t from-violet-600/80 to-fuchsia-400/80 sm:w-1.5"
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

  return (
    <section
      id="home"
      className="relative flex min-h-svh flex-col items-center justify-center px-6 text-center"
    >
      <GradientBackdrop animate={animate} />
      <GridBackdrop />
      <FloatingShapes animate={animate} />

      <motion.div
        className="relative z-10 mx-auto max-w-4xl"
        initial={animate ? { opacity: 0, y: 32 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        <a
          href="#music"
          className="group mb-8 inline-flex items-center gap-2 rounded-full border border-violet-500/40 bg-violet-600/10 px-5 py-2 text-xs font-medium text-violet-200 backdrop-blur-md transition-all duration-300 hover:border-fuchsia-400/60 hover:bg-violet-600/20 hover:shadow-[0_0_28px_rgba(139,92,246,0.35)] sm:text-sm"
        >
          <Sparkles className="h-3.5 w-3.5 text-fuchsia-300" />
          New Release — {latestRelease.title}
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </a>

        <h1 className="font-display text-5xl leading-[1.05] font-bold tracking-tight drop-shadow-[0_0_40px_rgba(139,92,246,0.35)] sm:text-7xl lg:text-8xl">
          <span className="text-shimmer">HalfCodeMusic</span>
        </h1>

        <p className="mt-6 text-xs font-semibold tracking-[0.35em] text-violet-300/80 uppercase sm:text-sm">
          {site.tagline}
        </p>

        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
          {site.description}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href="#music">
            <Play className="h-4 w-4 fill-current" />
            Listen Now
          </Button>
          <Button href="#connect" variant="ghost">
            Explore Music
          </Button>
        </div>
      </motion.div>

      <Waveform animate={animate} />
    </section>
  );
}
