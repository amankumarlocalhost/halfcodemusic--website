/**
 * Central release catalog. Every song lives here once — pages and cards
 * just read from this list. Add a new release by adding an object below.
 *
 * Fields left null/empty (e.g. `audio`, `lyrics`, `credits`) are honest
 * placeholders for data that doesn't exist yet — render an empty state,
 * never fabricate a value.
 */
export const releases = [
  {
    slug: "teri-payal",
    title: "Teri Payal",
    subtitle: "Love at First Sight",
    artist: "HalfCodeMusic",
    releaseDate: "2025-01-01",
    genre: "Romantic · Hindi Melody",
    type: "single",
    tags: ["Romantic", "Melody", "Hindi"],
    description:
      "A soulful, romantic melody that captures the magic of first love. Warm vocals, delicate textures and a rhythm that feels like falling in love all over again.",
    cover: "/latest-release.jpg",
    youtubeId: "gVaVjpZ080I",
    youtubeUrl: "https://www.youtube.com/watch?v=gVaVjpZ080I",
    streaming: [],
    lyrics: null,
    credits: [{ role: "Production, Vocals & Mix", name: "HalfCodeMusic" }],
    featured: true,
  },
];

export const featuredRelease = releases.find((r) => r.featured) ?? releases[0];
export const latestRelease = [...releases].sort(
  (a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)
)[0];

export function getReleaseBySlug(slug) {
  return releases.find((r) => r.slug === slug) ?? null;
}

export function getRelatedReleases(slug, limit = 3) {
  return releases.filter((r) => r.slug !== slug).slice(0, limit);
}

/** youtube.com/watch?v=<id> thumbnail, no API call required. */
export function youtubeThumbnail(youtubeId) {
  return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
}
