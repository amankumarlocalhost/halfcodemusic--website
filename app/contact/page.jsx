import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading";
import ContactForm from "@/components/ContactForm";
import { site } from "@/lib/site";

const title = "Contact";
const description =
  "Get in touch with HalfCodeMusic for collaborations, production inquiries or business questions.";

export const metadata = {
  title,
  description,
  alternates: { canonical: "/contact" },
  openGraph: { title, description, url: "/contact" },
  twitter: { card: "summary_large_image", title, description },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: title,
  description,
  url: `${site.url}/contact`,
};

export default function ContactPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact", href: "/contact" }]} />

      <main className="px-6 pt-10 pb-28 sm:pb-36">
        <SectionHeading
          eyebrow="Get in Touch"
          title="Let's make"
          highlight="something."
          lede="Collaborations, production work, or just a note about the music — every message reaches me directly."
          as="h1"
        />

        <div className="mx-auto mt-14 max-w-xl">
          <ContactForm />
        </div>
      </main>

      <Footer />
    </>
  );
}
