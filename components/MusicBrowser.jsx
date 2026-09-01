"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import MusicCard from "@/components/MusicCard";
import EmptyState from "@/components/ui/EmptyState";

export default function MusicBrowser({ releases }) {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("all");

  const genres = useMemo(() => {
    const set = new Set(releases.map((r) => r.genre));
    return ["all", ...set];
  }, [releases]);

  const filtered = useMemo(() => {
    return releases.filter((r) => {
      const matchesGenre = genre === "all" || r.genre === genre;
      const matchesQuery = `${r.title} ${r.subtitle} ${r.tags.join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase());
      return matchesGenre && matchesQuery;
    });
  }, [releases, genre, query]);

  return (
    <div>
      <div className="mx-auto flex max-w-2xl flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <div className="glass relative flex-1 rounded-full">
          <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search releases..."
            aria-label="Search releases"
            className="w-full rounded-full bg-transparent py-3 pr-4 pl-11 text-sm text-ink placeholder:text-ink/50 focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {genres.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGenre(g)}
              aria-pressed={genre === g}
              className={`rounded-full px-4 py-2 text-xs font-medium transition-all duration-300 ${
                genre === g
                  ? "bg-ink hover:bg-deep-soft text-ivory shadow-[0_2px_10px_rgba(37,39,36,0.10)]"
                  : "glass text-dim hover:text-ink"
              }`}
            >
              {g === "all" ? "All Genres" : g}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="mx-auto mt-14 grid max-w-6xl grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((release) => (
            <MusicCard key={release.slug} release={release} queue={filtered} />
          ))}
        </div>
      ) : (
        <div className="mt-14">
          <EmptyState icon={Search} title="No releases match" body="Try a different search or genre." />
        </div>
      )}
    </div>
  );
}
