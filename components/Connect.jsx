"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import { InstagramIcon, YoutubeIcon } from "@/components/icons";
import { site } from "@/lib/site";

const socials = [
  { label: "YouTube", href: site.links.youtube, Icon: YoutubeIcon },
  { label: "Instagram", href: site.links.instagram, Icon: InstagramIcon },
];

export default function Connect() {
  return (
    <section id="connect" className="relative px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Let&apos;s Connect
          </h2>
          <p className="mt-5 text-white/50">
            Follow the journey, stream the sound, or just say hi.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="relative mt-12 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] px-8 py-12 backdrop-blur-md">
            {/* soft glow inside the card */}
            <div
              aria-hidden
              className="absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-violet-600/20 blur-[80px]"
            />
            <div className="relative flex flex-wrap items-start justify-center gap-8">
              {socials.map(({ label, href, Icon }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 320, damping: 18 }}
                  className="group flex flex-col items-center gap-3"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition-all duration-300 group-hover:border-violet-500/60 group-hover:bg-violet-600/15 group-hover:shadow-[0_0_32px_rgba(139,92,246,0.4)]">
                    <Icon className="h-6 w-6 text-white/60 transition-colors duration-300 group-hover:text-violet-300" />
                  </span>
                  <span className="text-xs font-medium text-white/40 transition-colors duration-300 group-hover:text-white/80">
                    {label}
                  </span>
                </motion.a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
