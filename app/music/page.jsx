import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading";
import MusicBrowser from "@/components/MusicBrowser";
import { releases } from "@/data/music";
import { site } from "@/lib/site";

const title = "Music — All Releases";
const description =
  "Every HalfCodeMusic release in one place — cinematic, emotion-first singles and EPs from an independent producer.";

export const metadata = {
  title,
  description,
  alternates: { canonical: "/music" },
  openGraph: { title, description, url: "/music" },
  twitter: { card: "summary_large_image", title, description },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: title,
  description,
  url: `${site.url}/music`,
  isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
};

export default function MusicPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Music", href: "/music" }]} />
      <main className="px-6 pt-10 pb-28 sm:pb-36">
        <SectionHeading
          eyebrow="Discography"
          title="All"
          highlight="Releases"
          lede="Singles, EPs and everything in between — cinematic, emotion-first music engineered note by note."
          as="h1"
        />
        <div className="mt-14">
          <MusicBrowser releases={releases} />
        </div>
      </main>
      <Footer />
    </>
  );
}
