"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import VideoCard from "@/components/VideoCard";
import VideoModal from "@/components/VideoModal";
import EmptyState from "@/components/ui/EmptyState";
import { Film } from "lucide-react";
import { videos } from "@/data/videos";

export default function VideoPreview() {
  const [active, setActive] = useState(null);
  const latest = videos[0];

  return (
    <section aria-labelledby="video-preview-heading" className="relative px-6 py-28 sm:py-36">
      <SectionHeading eyebrow="Watch" title="Latest" highlight="video." />

      <div className="mx-auto mt-14 max-w-2xl">
        <Reveal delay={0.15}>
          {latest ? (
            <VideoCard video={latest} onOpen={setActive} />
          ) : (
            <EmptyState icon={Film} title="No videos yet" body="New visuals are on the way." />
          )}
        </Reveal>
      </div>

      <Reveal delay={0.25} className="mt-10 flex justify-center">
        <Link
          href="/videos"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-ink/70 transition-colors hover:text-ink"
        >
          Watch all videos
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </Reveal>

      <VideoModal video={active} onClose={() => setActive(null)} />
    </section>
  );
}
