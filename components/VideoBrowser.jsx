"use client";

import { useState } from "react";
import { Film } from "lucide-react";
import VideoCard from "@/components/VideoCard";
import VideoModal from "@/components/VideoModal";
import EmptyState from "@/components/ui/EmptyState";
import { videoCategories, getVideosByCategory } from "@/data/videos";

export default function VideoBrowser() {
  const [category, setCategory] = useState(videoCategories[0].id);
  const [active, setActive] = useState(null);
  const items = getVideosByCategory(category);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2">
        {videoCategories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategory(c.id)}
            aria-pressed={category === c.id}
            className={`rounded-full px-4 py-2 text-xs font-medium transition-all duration-300 ${
              category === c.id
                ? "bg-ink hover:bg-deep-soft text-ivory shadow-[0_2px_10px_rgba(37,39,36,0.10)]"
                : "glass text-dim hover:text-ink"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {items.length > 0 ? (
        <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((video) => (
            <VideoCard key={video.id} video={video} onOpen={setActive} />
          ))}
        </div>
      ) : (
        <div className="mt-14">
          <EmptyState icon={Film} title="Nothing here yet" body="New content in this category is on the way." />
        </div>
      )}

      <VideoModal video={active} onClose={() => setActive(null)} />
    </div>
  );
}
