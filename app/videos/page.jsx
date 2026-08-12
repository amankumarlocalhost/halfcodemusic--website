import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading";
import VideoBrowser from "@/components/VideoBrowser";
import { videos } from "@/data/videos";
import { site } from "@/lib/site";

const title = "Videos";
const description =
  "Music videos, visualizers and studio footage from HalfCodeMusic. Thumbnails only until you press play — nothing loads until you ask for it.";

export const metadata = {
  title,
  description,
  alternates: { canonical: "/videos" },
  openGraph: { title, description, url: "/videos" },
  twitter: { card: "summary_large_image", title, description },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: title,
  description,
  url: `${site.url}/videos`,
  hasPart: videos.map((v) => ({
    "@type": "VideoObject",
    name: v.title,
    uploadDate: v.publishedDate,
    thumbnailUrl: `https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`,
    embedUrl: `https://www.youtube.com/embed/${v.youtubeId}`,
  })),
};

export default function VideosPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Videos", href: "/videos" }]} />
      <main className="px-6 pt-10 pb-28 sm:pb-36">
        <SectionHeading
          eyebrow="Watch"
          title="Music"
          highlight="Videos"
          lede="Visual stories built around every release — music videos, visualizers and a look into the studio."
          as="h1"
        />
        <div className="mt-14">
          <VideoBrowser />
        </div>
      </main>
      <Footer />
    </>
  );
}
