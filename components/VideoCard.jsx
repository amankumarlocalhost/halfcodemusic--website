"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { youtubeThumbnail } from "@/data/music";

/** Thumbnail-only card. The real YouTube iframe loads only on click, in VideoModal. */
export default function VideoCard({ video, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(video)}
      className="group relative block w-full overflow-hidden rounded-2xl text-left"
      aria-label={`Play ${video.title} on YouTube`}
    >
      <div className="relative aspect-video overflow-hidden bg-ink/5">
        <Image
          src={youtubeThumbnail(video.youtubeId)}
          alt={`${video.title} — video thumbnail`}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-ink shadow-lg transition-transform duration-300 group-hover:scale-110">
            <Play className="ml-0.5 h-5 w-5 fill-current" />
          </span>
        </span>
      </div>
      <div className="mt-3">
        <h3 className="truncate font-display text-base font-semibold text-ink">{video.title}</h3>
        {video.subtitle && <p className="truncate text-sm text-dim">{video.subtitle}</p>}
      </div>
    </button>
  );
}
