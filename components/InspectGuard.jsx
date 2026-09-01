"use client";

import { useEffect } from "react";

/**
 * Deterrents against casually opening DevTools.
 *
 * Read this before relying on it: none of this is security, and none of it
 * stops anyone who actually wants the assets. DevTools still opens from the
 * browser menu, `view-source:` still works, disabling JavaScript removes all of
 * it at once, and a network proxy (Charles, Fiddler, curl) never runs page
 * script at all.
 *
 * What actually holds and what does not:
 *   - contextmenu  reliably prevented. This is the one that carries the weight.
 *   - dragstart    reliably prevented.
 *   - F12, Ctrl+Shift+I/J/C, Ctrl+U are *browser* accelerators. Chrome and
 *     Firefox handle them above the page, so preventDefault here usually does
 *     NOT stop DevTools opening. The handler is kept because it does work in
 *     some browsers and costs nothing, but do not count on it.
 *
 * Deliberately NOT included: the `debugger`-in-a-loop trap. It is the only
 * technique that meaningfully obstructs an open DevTools, but it runs
 * constantly on the main thread and repeatedly freezes the page, which would
 * wreck the hero's scroll smoothness. It is also switched off by one click on
 * "Never pause here". The cost is real and the protection is not.
 *
 * Everything here is passive: listeners only, no timers, no polling, no work on
 * the animation path.
 */
export default function InspectGuard() {
  useEffect(() => {
    // Escape hatch for your own debugging, in dev or production. Run this once
    // in the console and the guard stays off for this browser:
    //   localStorage.setItem("hcm:inspect", "1")
    // Undo with: localStorage.removeItem("hcm:inspect")
    try {
      if (localStorage.getItem("hcm:inspect") === "1") return;
    } catch {
      // Private mode / blocked storage — fall through and guard as normal.
    }

    /** Fields where the context menu is genuinely useful (paste into the contact form). */
    const isTextField = (el) =>
      el?.closest?.("input, textarea, [contenteditable='true']") != null;

    const onContextMenu = (e) => {
      if (isTextField(e.target)) return;
      e.preventDefault();
    };

    const onKeyDown = (e) => {
      const key = e.key.toUpperCase();

      // F12
      if (key === "F12") {
        e.preventDefault();
        return;
      }
      // Ctrl/Cmd + Shift + I / J / C  — inspector, console, element picker
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && ["I", "J", "C"].includes(key)) {
        e.preventDefault();
        return;
      }
      // Ctrl/Cmd + U — view source
      if ((e.ctrlKey || e.metaKey) && key === "U") {
        e.preventDefault();
      }
    };

    // Stop frames and artwork being dragged straight out to the desktop.
    const onDragStart = (e) => {
      if (e.target instanceof HTMLImageElement || e.target instanceof HTMLCanvasElement) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("dragstart", onDragStart);

    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("dragstart", onDragStart);
    };
  }, []);

  return null;
}
