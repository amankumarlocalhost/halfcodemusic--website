import { notFound } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import MusicCard from "@/components/MusicCard";
import PlayButton from "@/components/player/PlayButton";
import Reveal from "@/components/ui/Reveal";
import { YoutubeIcon } from "@/components/icons";
import { releases, getReleaseBySlug, getRelatedReleases } from "@/data/music";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return releases.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const release = getReleaseBySlug(slug);
  if (!release) return {};

  const title = `${release.title} — ${release.subtitle}`;
  const description = release.description;

  return {
    title,
    description,
    alternates: { canonical: `/music/${release.slug}` },
    openGraph: {
      title,
      description,
      url: `/music/${release.slug}`,
      type: "music.song",
      images: [{ url: release.cover, width: 1280, height: 1280, alt: `${release.title} — cover artwork` }],
    },
    twitter: { card: "summary_large_image", title, description, images: [release.cover] },
  };
}

export default async function ReleasePage({ params }) {
  const { slug } = await params;
  const release = getReleaseBySlug(slug);
  if (!release) notFound();

  const related = getRelatedReleases(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    name: release.title,
    byArtist: { "@type": "MusicGroup", name: release.artist, url: site.url },
    genre: release.genre,
    datePublished: release.releaseDate,
    image: `${site.url}${release.cover}`,
    url: `${site.url}/music/${release.slug}`,
    ...(release.youtubeUrl ? { sameAs: [release.youtubeUrl] } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Music", href: "/music" },
          { label: release.title, href: `/music/${release.slug}` },
        ]}
      />

      <main className="px-6 pt-10 pb-28 sm:pb-36">
        <div className="mx-auto grid max-w-6xl items-start gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal className="relative mx-auto w-full max-w-lg">
            <div
              aria-hidden
              className="absolute inset-0 scale-95 rounded-3xl bg-gradient-to-br from-sage/70 to-greige/60 blur-[90px]"
            />
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-greige via-stone/70 to-sage p-px shadow-[0_18px_50px_rgba(37,39,36,0.08)]">
              <Image
                src={release.cover}
                alt={`${release.title} — cover artwork`}
                width={1280}
                height={1280}
                priority
                sizes="(min-width: 1024px) 32rem, 92vw"
                className="aspect-square w-full rounded-[calc(1.5rem-1px)] object-cover"
              />
            </div>
          </Reveal>

          <div>
            <Reveal>
              <p className="text-xs font-semibold tracking-[0.2em] text-dim uppercase">{release.genre}</p>
              <h1 className="font-display mt-3 text-4xl font-bold tracking-tight sm:text-5xl">{release.title}</h1>
              <p className="mt-2 text-lg font-medium text-dim">{release.subtitle}</p>
              <p className="mt-1 text-sm text-dim">
                {release.artist} · {new Date(release.releaseDate).getFullYear()}
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-6 leading-relaxed text-dim">{release.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {release.tags.map((tag) => (
                  <span key={tag} className="glass rounded-full px-4 py-1.5 text-xs font-medium text-ink/70">
                    {tag}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <PlayButton track={release} queue={releases} />
                {release.youtubeUrl && (
                  <a
                    href={release.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 rounded-full bg-ink hover:bg-deep-soft px-6 py-3.5 text-sm font-semibold text-ivory shadow-[0_2px_12px_rgba(37,39,36,0.10)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(37,39,36,0.16)]"
                  >
                    <YoutubeIcon className="h-5 w-5" />
                    Watch on YouTube
                  </a>
                )}
              </div>
            </Reveal>

            {release.credits?.length > 0 && (
              <Reveal delay={0.3}>
                <div className="mt-10 border-t border-line pt-6">
                  <h2 className="text-xs font-semibold tracking-[0.15em] text-ink/55 uppercase">Credits</h2>
                  <ul className="mt-3 space-y-1.5">
                    {release.credits.map((credit) => (
                      <li key={credit.role} className="text-sm text-dim">
                        <span className="text-ink/70">{credit.role}</span> — {credit.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}

            <Reveal delay={0.35}>
              <div className="mt-10 border-t border-line pt-6">
                <h2 className="text-xs font-semibold tracking-[0.15em] text-ink/55 uppercase">Lyrics</h2>
                {release.lyrics ? (
                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-dim">{release.lyrics}</p>
                ) : (
                  <p className="mt-3 text-sm text-dim">Lyrics for this release haven&apos;t been published yet.</p>
                )}
              </div>
            </Reveal>
          </div>
        </div>

        {related.length > 0 && (
          <section aria-labelledby="related-heading" className="mx-auto mt-28 max-w-6xl">
            <h2 id="related-heading" className="font-display text-2xl font-bold tracking-tight">
              Related Music
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((r) => (
                <MusicCard key={r.slug} release={r} queue={related} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
