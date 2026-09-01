"use client";

import { motion, useReducedMotion } from "framer-motion";
import useHydrated from "@/lib/useHydrated";

/** Fades content up as it scrolls into view. Respects reduced-motion. */
export default function Reveal({ children, delay = 0, className }) {
  const reduceMotion = useReducedMotion();
  const hydrated = useHydrated();
  // `initial` is rendered into the HTML, so it must not depend on a value that
  // differs between server and client. Reduced motion collapses the duration
  // instead — same end state, no perceptible movement.
  const still = hydrated && reduceMotion;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: still ? 0 : 0.7,
        delay: still ? 0 : delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
    >
      {children}
    </motion.div>
  );
}
