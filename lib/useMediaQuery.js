"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

/**
 * Tracks a media query, and stays honest about not knowing the answer on the
 * server: returns `null` during SSR and the hydrating render, then the real
 * boolean, then updates whenever the query starts or stops matching (a phone
 * being rotated, a window being resized).
 *
 * The `null` matters — it lets callers hold off on doing work that would be
 * wasted, or wrong, if they guessed the wrong branch before hydration.
 */
export default function useMediaQuery(query) {
  const list = useMemo(
    () => (typeof window === "undefined" ? null : window.matchMedia(query)),
    [query]
  );

  const subscribe = useCallback(
    (onChange) => {
      if (!list) return () => {};
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [list]
  );

  return useSyncExternalStore(
    subscribe,
    () => (list ? list.matches : null),
    () => null
  );
}
