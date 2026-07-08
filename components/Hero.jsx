"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Music2, Disc3, Play, ArrowDown } from "lucide-react";
import Button from "@/components/ui/Button";
import { site } from "@/lib/site";

/** Slow-drifting blurred gradient orbs behind the hero content. */
function GradientBackdrop({ animate }) {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-violet-600/25 blur-[120px]"
        animate={animate ? { scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] } : undefined}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 -left-40 h-96 w-96 rounded-full bg-fuchsia-600/15 blur-[110px]"
        animate={animate ? { x: [0, 60, 0], y: [0, -40, 0] } : undefined}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-indigo-600/15 blur-[110px]"
        animate={animate ? { x: [0, -50, 0], y: [0, 30, 0] } : undefined}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
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

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const animate = !reduceMotion;

  return (
    <section
      id="home"
      className="relative flex min-h-svh flex-col items-center justify-center px-6 text-center"
    >
      <GradientBackdrop animate={animate} />
      <FloatingShapes animate={animate} />

      <motion.div
        className="relative z-10 mx-auto max-w-4xl"
        initial={animate ? { opacity: 0, y: 32 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-widest text-white/60 uppercase backdrop-blur-md">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-500" />
          {site.tagline}
        </span>

        <h1 className="font-display text-5xl leading-[1.05] font-bold tracking-tight sm:text-7xl lg:text-8xl">
          Half<span className="bg-gradient-to-r from-violet-400 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">Code</span>Music
        </h1>

        <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
          {site.description}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href="#music">
            <Play className="h-4 w-4 fill-current" />
            Listen Now
          </Button>
          <Button href="#about" variant="ghost">
            Explore Music
          </Button>
        </div>
      </motion.div>

      <motion.a
        href="#music"
        aria-label="Scroll to latest release"
        className="absolute bottom-8 text-white/30 transition-colors hover:text-white/70"
        animate={animate ? { y: [0, 8, 0] } : undefined}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ArrowDown className="h-5 w-5" />
      </motion.a>
    </section>
  );
}
