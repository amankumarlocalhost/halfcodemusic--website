import Image from "next/image";
import Link from "next/link";
import PlayButton from "@/components/player/PlayButton";

/** Release card used on /music, home previews and related-songs lists. */
export default function MusicCard({ release, queue = [], priority = false }) {
  return (
    <article className="group relative">
      <Link
        href={`/music/${release.slug}`}
        className="relative block overflow-hidden rounded-2xl"
        aria-label={`View ${release.title}`}
      >
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={release.cover}
            alt={`${release.title} — cover artwork`}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 40vw, 90vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-ink/0 to-ink/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="pointer-events-auto">
            <PlayButton track={release} queue={queue} />
          </span>
        </div>
      </Link>

      <div className="mt-4">
        <h3 className="truncate font-display text-base font-semibold text-ink">
          <Link href={`/music/${release.slug}`} className="hover:text-dim">
            {release.title}
          </Link>
        </h3>
        <p className="mt-0.5 truncate text-sm text-dim">
          {release.artist} · {new Date(release.releaseDate).getFullYear()}
        </p>
      </div>
    </article>
  );
}
