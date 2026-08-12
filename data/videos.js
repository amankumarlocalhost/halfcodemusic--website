import { releases } from "./music";

/**
 * Video catalog, derived from releases that have a YouTube link plus any
 * standalone visual content added directly here. Categories with no
 * entries yet render an empty state on /videos rather than being hidden
 * or filled with placeholders.
 */
export const videoCategories = [
  { id: "music-video", label: "Music Videos" },
  { id: "visualizer", label: "Visualizers" },
  { id: "short", label: "Shorts" },
  { id: "studio", label: "Studio" },
];

export const videos = releases
  .filter((r) => r.youtubeId)
  .map((r) => ({
    id: r.youtubeId,
    title: r.title,
    subtitle: r.subtitle,
    category: "music-video",
    youtubeId: r.youtubeId,
    youtubeUrl: r.youtubeUrl,
    relatedSlug: r.slug,
    publishedDate: r.releaseDate,
  }));

export function getVideosByCategory(categoryId) {
  return videos.filter((v) => v.category === categoryId);
}
