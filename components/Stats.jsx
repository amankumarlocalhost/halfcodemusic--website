"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import { stats } from "@/lib/site";

/** Counts from 0 to `value` once the number scrolls into view. */
function Counter({ value, suffix }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(reduceMotion ? value : 0);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.21, 0.47, 0.32, 0.98],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, reduceMotion]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section id="about" aria-label="HalfCodeMusic in numbers" className="relative px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="glass grid grid-cols-1 gap-px overflow-hidden rounded-3xl sm:grid-cols-3">
            {stats.map(({ label, value, suffix }, i) => (
              <motion.div
                key={label}
                whileHover={{ backgroundColor: "rgba(139,92,246,0.08)" }}
                className="flex flex-col items-center gap-2 px-6 py-10 text-center"
              >
                <span className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
                  <span className="bg-gradient-to-r from-accent to-neon bg-clip-text text-transparent">
                    <Counter value={value} suffix={suffix} />
                  </span>
                </span>
                <span className="text-xs font-medium tracking-[0.15em] text-dim uppercase">
                  {label}
                </span>
              </motion.div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
