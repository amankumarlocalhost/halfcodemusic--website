"use client";

import { motion } from "framer-motion";
import { InstagramIcon, YoutubeIcon } from "@/components/icons";

const icons = { youtube: YoutubeIcon, instagram: InstagramIcon };

export default function SocialCard({ platform }) {
  const Icon = icons[platform.id];

  return (
    <motion.a
      href={platform.href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 320, damping: 18 }}
      className="glass group flex flex-col items-center gap-4 rounded-3xl px-6 py-8 text-center transition-colors duration-300 hover:border-stone hover:bg-greige/40"
    >
      <span className="glass flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 group-hover:border-stone group-hover:shadow-[0_4px_16px_rgba(37,39,36,0.08)]">
        <Icon className="h-6 w-6 text-ink/60 transition-colors duration-300 group-hover:text-ink" />
      </span>
      <span>
        <span className="block font-display font-semibold text-ink">{platform.label}</span>
        <span className="mt-0.5 block text-xs text-dim">{platform.handle}</span>
      </span>
      <span className="text-xs leading-relaxed text-dim">{platform.description}</span>
    </motion.a>
  );
}
