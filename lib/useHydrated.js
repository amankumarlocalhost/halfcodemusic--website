"use client";

import { useSyncExternalStore } from "react";

/** Never emits: the value only ever changes from its server to its client snapshot. */
const subscribe = () => () => {};

/**
 * False during SSR and the hydrating render, true on every render after.
 *
 * Gate anything whose value or tree shape differs between server and client —
 * reduced-motion branches, scroll position, viewport size — so the markup React
 * hydrates against always matches what the server sent, and the real value is
 * applied on the commit after.
 */
export default function useHydrated() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
