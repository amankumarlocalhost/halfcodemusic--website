"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import {
  InstagramIcon,
  SoundCloudIcon,
  SpotifyIcon,
  YoutubeIcon,
} from "@/components/icons";
import { site } from "@/lib/site";

const socials = [
  { label: "YouTube", href: site.links.youtube, Icon: YoutubeIcon },
  { label: "Instagram", href: site.links.instagram, Icon: InstagramIcon },
  { label: "Spotify", href: site.links.spotify, Icon: SpotifyIcon },
  { label: "SoundCloud", href: site.links.soundcloud, Icon: SoundCloudIcon },
  { label: "Email", href: `mailto:${site.email}`, Icon: Mail },
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
          <div className="mt-12 flex flex-wrap items-center justify-center gap-5">
            {socials.map(({ label, href, Icon }) => (
              <motion.a
                key={label}
                href={href}
                aria-label={label}
                title={label}
                whileHover={{ y: -6, scale: 1.08 }}
                transition={{ type: "spring", stiffness: 320, damping: 18 }}
                className="group flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md transition-colors duration-300 hover:border-violet-500/60 hover:bg-violet-600/15 hover:shadow-[0_0_32px_rgba(139,92,246,0.4)]"
              >
                <Icon className="h-6 w-6 text-white/60 transition-colors duration-300 group-hover:text-violet-300" />
              </motion.a>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <p className="mt-10 text-sm text-white/40">
            For collaborations &amp; inquiries —{" "}
            <a
              href={`mailto:${site.email}`}
              className="text-violet-400 underline-offset-4 transition-colors hover:text-violet-300 hover:underline"
            >
              {site.email}
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
