import { Image as ImageIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading";
import GalleryGrid from "@/components/GalleryGrid";
import EmptyState from "@/components/ui/EmptyState";
import { galleryImages } from "@/data/gallery";
import galleryManifest from "@/lib/galleryManifest.json";
import { site } from "@/lib/site";

const title = "Gallery";
const description =
  "Artwork, studio moments and behind-the-scenes visuals from HalfCodeMusic.";

export const metadata = {
  title,
  description,
  alternates: { canonical: "/gallery" },
  openGraph: { title, description, url: "/gallery" },
  twitter: { card: "summary_large_image", title, description },
};

/**
 * The photographs shipped inside the masked pack (scripts/pack-gallery.mjs),
 * tagged with the index the client uses to pull each one back out.
 *
 * Empty until `npm run pack:gallery` has been run against gallery-src/, which
 * is why data/gallery.js still exists — anything listed there is served as a
 * normal, shareable file. Release artwork belongs there; it is promotional and
 * wants to be indexable. Photography you would rather people not lift belongs
 * in the pack.
 */
const packedImages = galleryManifest.images.map((image, i) => ({ ...image, packIndex: i }));

const allImages = [...packedImages, ...galleryImages];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: title,
  description,
  url: `${site.url}/gallery`,
};

export default function GalleryPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Gallery", href: "/gallery" }]} />

      <main className="px-6 pt-10 pb-28 sm:pb-36">
        <SectionHeading
          eyebrow="Visuals"
          title="Behind the"
          highlight="sound."
          lede="Artwork and studio visuals from the HalfCodeMusic catalog — more added with every release."
          as="h1"
        />

        <div className="mx-auto mt-14 max-w-6xl">
          {allImages.length > 0 ? (
            <GalleryGrid
              images={allImages}
              thumbVariant={galleryManifest.variants.thumb}
              fullVariant={galleryManifest.variants.full}
            />
          ) : (
            <EmptyState icon={ImageIcon} title="Gallery is empty" body="New visuals are on the way." />
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
