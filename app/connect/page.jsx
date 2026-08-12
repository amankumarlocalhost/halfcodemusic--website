import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import Connect from "@/components/Connect";
import { site } from "@/lib/site";

const title = "Connect";
const description =
  "Follow HalfCodeMusic on YouTube and Instagram — stream every release and stay close to the process.";

export const metadata = {
  title,
  description,
  alternates: { canonical: "/connect" },
  openGraph: { title, description, url: "/connect" },
  twitter: { card: "summary_large_image", title, description },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: title,
  description,
  url: `${site.url}/connect`,
};

export default function ConnectPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Connect", href: "/connect" }]} />
      <main className="pt-4">
        <Connect as="h1" />
      </main>
      <Footer />
    </>
  );
}
