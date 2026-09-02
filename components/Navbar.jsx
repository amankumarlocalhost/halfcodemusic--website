"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/lib/site";
import useMediaQuery from "@/lib/useMediaQuery";

export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Narrow screens keep the nav on screen for the whole hero sequence, so it is
  // always reachable while the animation plays. At >=1024px this is false and
  // the hide-on-scroll behaviour below is exactly as it was.
  const keepVisible = useMediaQuery("(max-width: 1023px)") === true;

  const lastY = useRef(0);
  const ticking = useRef(false);

  // One passive listener, coalesced into a single rAF, and setHidden is only
  // ever called with a value that can change — React bails out on a repeat, so
  // scrolling does not re-render the nav.
  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY.current;

        // Ignore sub-pixel jitter and rubber-banding at the very top.
        if (Math.abs(delta) > 6) {
          setHidden(delta > 0 && y > 96);
          lastY.current = y;
        }
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <motion.header
      // Transparent overlay — the hero runs full-bleed behind it.
      // Slides out of the way on scroll down, back in on scroll up. The open
      // mobile menu pins it visible so it can always be dismissed.
      initial={{ y: "-30%", opacity: 0 }}
      animate={{ y: hidden && !open && !keepVisible ? "-100%" : "0%", opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="fixed inset-x-0 top-0 z-50 bg-transparent"
    >
      {/* Narrow screens only. The nav stays put for the whole hero sequence
          there, so without this the wordmark sits directly on the moving
          figure and reads as clutter. A gradient rather than a filled bar —
          it has no visible edge, so the nav still reads as transparent. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-28 bg-[linear-gradient(to_bottom,rgba(244,243,238,0.92)_0%,rgba(244,243,238,0.72)_45%,rgba(244,243,238,0)_100%)] lg:hidden"
      />

      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 sm:h-20">
        <Link href="/" className="group flex items-center gap-2.5 font-display text-lg font-bold tracking-tight">
          <Image
            src="/logo.svg"
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 rounded-xl shadow-[0_2px_10px_rgba(37,39,36,0.10)] transition-shadow duration-300 group-hover:shadow-[0_4px_16px_rgba(37,39,36,0.16)]"
            priority
          />
          <span>
            HalfCode
            <span className="bg-gradient-to-r from-accent to-neon bg-clip-text text-transparent">Music</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`relative text-sm transition-colors duration-200 after:absolute after:-bottom-1.5 after:left-0 after:h-px after:bg-gradient-to-r after:from-accent after:to-neon after:transition-all after:duration-300 hover:text-ink hover:after:w-full ${
                  isActive(link.href) ? "text-ink after:w-full" : "text-dim after:w-0"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/music"
              className="rounded-full bg-ink hover:bg-deep-soft px-5 py-2 text-sm font-semibold text-ivory shadow-[0_2px_10px_rgba(37,39,36,0.10)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(37,39,36,0.16)]"
            >
              Listen Now
            </Link>
          </li>
        </ul>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-ink/80 transition-colors hover:bg-ink/5 md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="glass overflow-hidden border-x-0 md:hidden"
          >
            <ul className="flex flex-col gap-1 px-6 py-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={`block rounded-lg px-3 py-3 transition-colors hover:bg-ink/5 hover:text-ink ${
                      isActive(link.href) ? "text-ink" : "text-ink/70"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  href="/contact"
                  className="block rounded-lg px-3 py-3 text-ink/70 transition-colors hover:bg-ink/5 hover:text-ink"
                >
                  Contact
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  href="/music"
                  className="block rounded-full bg-ink hover:bg-deep-soft px-5 py-3 text-center font-semibold text-ivory shadow-[0_2px_10px_rgba(37,39,36,0.10)]"
                >
                  Listen Now
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
