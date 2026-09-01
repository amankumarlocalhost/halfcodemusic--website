"use client";

import { motion, useReducedMotion } from "framer-motion";
import useHydrated from "@/lib/useHydrated";

/** Soft fade-up transition applied on every page navigation. */
export default function Template({ children }) {
  const reduceMotion = useReducedMotion();
  const hydrated = useHydrated();
  // `initial` is rendered into the HTML, so it must not depend on a value that
  // differs between server and client. Reduced motion collapses the duration
  // instead — same end state, no perceptible movement.
  const still = hydrated && reduceMotion;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: still ? 0 : 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
}
