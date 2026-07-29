"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Premium intro overlay: brand mark + equalizer pulse, then fades away.
 * Skipped entirely for reduced-motion users; removed from the DOM once done
 * so it costs nothing after load.
 */
export default function Loader() {
  const reduceMotion = useReducedMotion();
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1100);
    return () => clearTimeout(t);
  }, []);

  if (reduceMotion) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          aria-hidden
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-paper"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <motion.p
            className="font-display text-2xl font-bold tracking-tight"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            HalfCode
            <span className="bg-gradient-to-r from-accent to-neon bg-clip-text text-transparent">
              Music
            </span>
          </motion.p>
          <div className="flex h-8 items-end gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.span
                key={i}
                className="w-1.5 origin-bottom rounded-full bg-gradient-to-t from-accent to-neon"
                style={{ height: 12 + (i % 3) * 8 }}
                animate={{ scaleY: [0.4, 1, 0.4] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.12,
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
