import { site } from "@/lib/site";
import { releases } from "@/data/music";

const staticRoutes = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/music", priority: 0.9, changeFrequency: "weekly" },
  { path: "/videos", priority: 0.8, changeFrequency: "weekly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/gallery", priority: 0.6, changeFrequency: "monthly" },
  { path: "/connect", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
  { path: "/privacy-policy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
];

export default function sitemap() {
  const now = new Date();

  const staticEntries = staticRoutes.map(({ path, priority, changeFrequency }) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  const releaseEntries = releases.map((release) => ({
    url: `${site.url}/music/${release.slug}`,
    lastModified: new Date(release.releaseDate),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticEntries, ...releaseEntries];
}
