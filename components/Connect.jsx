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
    <section id="connect" className="relative overflow-hidden px-6 py-28 sm:py-36">
      {/* ambient glow behind the card */}
      <div
        aria-hidden
        className="absolute bottom-0 left-1/2 h-80 w-[40rem] -translate-x-1/2 translate-y-1/2 rounded-full bg-violet-400/20 blur-[120px]"
      />

      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal>
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Let&apos;s{" "}
            <span className="bg-gradient-to-r from-accent to-neon bg-clip-text text-transparent">
              Connect
            </span>
          </h2>
          <p className="mt-5 text-dim">
            Follow the journey, stream the sound, or reach out for collaborations.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="glass relative mt-12 overflow-hidden rounded-3xl px-6 py-10 sm:px-8 sm:py-12">
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
                  <span className="glass flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 group-hover:border-violet-500/50 group-hover:bg-violet-500/10 group-hover:shadow-[0_0_32px_rgba(124,58,237,0.25)]">
                    <Icon className="h-6 w-6 text-ink/60 transition-colors duration-300 group-hover:text-violet-600" />
                  </span>
                  <span className="text-xs font-medium text-dim transition-colors duration-300 group-hover:text-ink">
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
