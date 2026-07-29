"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { testimonials } from "@/lib/site";

const AUTO_ADVANCE_MS = 6000;

export default function Testimonials() {
  const reduceMotion = useReducedMotion();
  const [[index, direction], setIndex] = useState([0, 1]);

  const paginate = useCallback((dir) => {
    setIndex(([i]) => [(i + dir + testimonials.length) % testimonials.length, dir]);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const t = setInterval(() => paginate(1), AUTO_ADVANCE_MS);
    return () => clearInterval(t);
  }, [paginate, reduceMotion, index]);

  const current = testimonials[index];

  return (
    <section aria-label="What listeners say" className="relative overflow-hidden px-6 py-28 sm:py-32">
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[130px]"
      />

      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal>
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            What Listeners{" "}
            <span className="bg-gradient-to-r from-accent to-neon bg-clip-text text-transparent">
              Say
            </span>
          </h2>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="glass relative mt-12 rounded-3xl px-6 py-12 sm:px-12">
            <Quote
              aria-hidden
              className="absolute top-6 left-6 h-8 w-8 text-violet-500/40"
            />
            <div className="relative min-h-40 sm:min-h-32">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.blockquote
                  key={index}
                  custom={direction}
                  initial={reduceMotion ? false : { opacity: 0, x: 40 * direction }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, x: -40 * direction }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <p className="text-lg leading-relaxed text-ink/85 sm:text-xl">
                    &ldquo;{current.quote}&rdquo;
                  </p>
                  <footer className="mt-6">
                    <p className="font-semibold text-ink">{current.name}</p>
                    <p className="mt-1 text-sm text-dim">{current.role}</p>
                  </footer>
                </motion.blockquote>
              </AnimatePresence>
            </div>

            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                type="button"
                aria-label="Previous testimonial"
                onClick={() => paginate(-1)}
                className="glass flex h-10 w-10 items-center justify-center rounded-full text-ink/60 transition-all duration-300 hover:border-violet-500/50 hover:text-ink"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Go to testimonial ${i + 1}`}
                    aria-current={i === index}
                    onClick={() => setIndex([i, i > index ? 1 : -1])}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === index ? "w-6 bg-gradient-to-r from-accent to-neon" : "w-1.5 bg-ink/20 hover:bg-ink/40"
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                aria-label="Next testimonial"
                onClick={() => paginate(1)}
                className="glass flex h-10 w-10 items-center justify-center rounded-full text-ink/60 transition-all duration-300 hover:border-violet-500/50 hover:text-ink"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
