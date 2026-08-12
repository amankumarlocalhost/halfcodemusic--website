"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play, SkipBack, SkipForward, Volume1, Volume2, VolumeX } from "lucide-react";
import { usePlayer } from "@/components/player/PlayerProvider";

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** Persistent playback bar. Desktop: full transport. Mobile: compact bar. */
export default function PlayerBar() {
  const { track, isPlaying, isBuffering, currentTime, duration, volume, hasQueue, toggle, seekTo, setVolume, next, prev } =
    usePlayer();
  const barRef = useRef(null);

  const progress = duration ? currentTime / duration : 0;
  const VolumeIcon = volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2;

  const handleSeek = (e) => {
    const rect = barRef.current.getBoundingClientRect();
    const fraction = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    seekTo(fraction);
  };

  return (
    <AnimatePresence>
      {track && (
        <motion.div
          initial={{ y: 96, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 96, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="glass fixed inset-x-0 bottom-0 z-40 border-x-0 border-b-0 px-3 py-2.5 sm:px-5 sm:py-3"
          role="region"
          aria-label="Music player"
        >
          <div className="mx-auto flex max-w-6xl items-center gap-3 sm:gap-4">
            <Link
              href={`/music/${track.slug}`}
              className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg sm:h-12 sm:w-12"
              aria-label={`View ${track.title}`}
            >
              <Image src={track.cover} alt="" fill sizes="48px" className="object-cover" />
            </Link>

            <div className="min-w-0 flex-1 sm:w-40 sm:flex-none">
              <p className="truncate text-sm font-semibold text-ink">{track.title}</p>
              <p className="truncate text-xs text-dim">{track.artist}</p>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              {hasQueue && (
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous track"
                  className="hidden h-9 w-9 items-center justify-center rounded-full text-ink/60 transition-colors hover:bg-ink/5 hover:text-ink sm:flex"
                >
                  <SkipBack className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                onClick={toggle}
                aria-label={isPlaying ? "Pause" : "Play"}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.45)] transition-transform hover:-translate-y-0.5"
              >
                {isBuffering ? (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : isPlaying ? (
                  <Pause className="h-4 w-4 fill-current" />
                ) : (
                  <Play className="ml-0.5 h-4 w-4 fill-current" />
                )}
              </button>
              {hasQueue && (
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next track"
                  className="hidden h-9 w-9 items-center justify-center rounded-full text-ink/60 transition-colors hover:bg-ink/5 hover:text-ink sm:flex"
                >
                  <SkipForward className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="hidden flex-1 items-center gap-3 sm:flex">
              <span className="w-10 shrink-0 text-right text-xs tabular-nums text-dim">
                {formatTime(currentTime)}
              </span>
              <div
                ref={barRef}
                onClick={handleSeek}
                role="slider"
                tabIndex={0}
                aria-label="Seek"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress * 100)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight") seekTo(Math.min(1, progress + 0.05));
                  if (e.key === "ArrowLeft") seekTo(Math.max(0, progress - 0.05));
                }}
                className="group relative h-4 flex-1 cursor-pointer"
              >
                <span className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-ink/10" />
                <span
                  style={{ width: `${progress * 100}%` }}
                  className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-gradient-to-r from-accent to-neon"
                />
                <span
                  style={{ left: `${progress * 100}%` }}
                  className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 shadow transition-opacity group-hover:opacity-100"
                />
              </div>
              <span className="w-10 shrink-0 text-xs tabular-nums text-dim">{formatTime(duration)}</span>
            </div>

            <div className="hidden items-center gap-2 lg:flex">
              <VolumeIcon className="h-4 w-4 text-ink/50" />
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                aria-label="Volume"
                className="h-1 w-20 accent-violet-600"
              />
            </div>
          </div>

          {/* mobile progress line */}
          <div className="mt-2 h-0.5 w-full rounded-full bg-ink/10 sm:hidden">
            <div
              style={{ width: `${progress * 100}%` }}
              className="h-full rounded-full bg-gradient-to-r from-accent to-neon"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
