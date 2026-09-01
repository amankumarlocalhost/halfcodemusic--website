"use client";

import { Pause, Play } from "lucide-react";
import { usePlayer } from "@/components/player/PlayerProvider";

/** Play/pause trigger for a release. Drop into any card or hero. */
export default function PlayButton({ track, queue = [], size = "md", className = "" }) {
  const { track: current, isPlaying, play, toggle } = usePlayer();
  const isActive = current?.slug === track.slug;

  const dims = size === "lg" ? "h-16 w-16 sm:h-20 sm:w-20" : size === "sm" ? "h-9 w-9" : "h-12 w-12";
  const iconDims = size === "lg" ? "h-6 w-6 sm:h-8 sm:w-8" : size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        isActive ? toggle() : play(track, queue);
      }}
      aria-label={isActive && isPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
      className={`flex shrink-0 items-center justify-center rounded-full bg-ink hover:bg-deep-soft text-ivory shadow-[0_2px_14px_rgba(37,39,36,0.14)] transition-transform duration-300 hover:scale-105 ${dims} ${className}`}
    >
      {isActive && isPlaying ? (
        <Pause className={`${iconDims} fill-current`} />
      ) : (
        <Play className={`ml-0.5 ${iconDims} fill-current`} />
      )}
    </button>
  );
}
