import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import Stats from "@/components/Stats";
import { artist } from "@/data/artist";
import { site } from "@/lib/site";

const title = "About";
const description =
  "The story behind HalfCodeMusic — an independent producer building cinematic, emotion-first music at the intersection of sound and code.";

export const metadata = {
  title,
  description,
  alternates: { canonical: "/about" },
  openGraph: { title, description, url: "/about" },
  twitter: { card: "summary_large_image", title, description },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: title,
  description,
  url: `${site.url}/about`,
};

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }]} />

      <main className="px-6 pt-10 pb-28 sm:pb-36">
        <SectionHeading eyebrow="The Story" title="Music, coded with" highlight="emotions." align="left" as="h1" />

        <div className="mx-auto mt-14 grid max-w-5xl gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal className="space-y-6 text-left leading-relaxed text-dim">
            <p className="text-lg text-ink/85">{artist.shortBio}</p>
            <p>
              HalfCodeMusic began as a simple idea: that a song can be built the way good software is built — with
              intention, iteration and restraint. Every release starts as a feeling first, then gets shaped, layered
              and refined until the production disappears behind the emotion it was written to carry.
            </p>
            <p>
              The name is literal. Half musician, half engineer — the process moves between a DAW and a mindset
              borrowed from writing code: small deliberate changes, constant listening back, and never shipping
              something that doesn&apos;t feel finished.
            </p>
            <p>
              HalfCodeMusic is independent — self-produced, self-mixed and self-released. That independence is what
              keeps the sound honest, and it&apos;s why every release on this site is real, not a placeholder for
              something bigger.
            </p>
          </Reveal>

          <Reveal delay={0.15} className="space-y-4">
            {artist.philosophy.map((item) => (
              <div key={item.title} className="glass rounded-2xl px-6 py-6">
                <h2 className="font-display font-semibold text-ink">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-dim">{item.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </main>

      <Stats />
      <Footer />
    </>
  );
}
