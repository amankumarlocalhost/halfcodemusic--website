import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { site } from "@/lib/site";

const title = "Terms of Use";
const description = "Terms governing use of the HalfCodeMusic website.";

export const metadata = {
  title,
  description,
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Terms", href: "/terms" }]} />
      <main className="px-6 pt-10 pb-28 sm:pb-36">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-3 text-sm text-dim">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

          <div className="mt-10 space-y-8 leading-relaxed text-dim">
            <section>
              <h2 className="font-display text-xl font-semibold text-ink">Acceptance of Terms</h2>
              <p className="mt-3">
                By accessing {site.url.replace("https://", "")}, you agree to these terms.
                <em> [Placeholder — replace with the legal entity name operating {site.name} before publishing.]</em>
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-ink">Intellectual Property</h2>
              <p className="mt-3">
                All music, artwork, video content and branding on this site belong to {site.name} unless otherwise
                credited. No content may be reproduced, redistributed or used commercially without prior written
                permission.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-ink">Streaming &amp; Third-Party Platforms</h2>
              <p className="mt-3">
                Links to YouTube, Instagram and other platforms are subject to those platforms&apos; own terms of
                service.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-ink">Limitation of Liability</h2>
              <p className="mt-3">
                This site is provided &quot;as is&quot; without warranties of any kind. {site.name} is not liable for
                any damages arising from use of this website.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-ink">Contact</h2>
              <p className="mt-3">
                Questions about these terms can be sent through the <a href="/contact" className="text-dim underline underline-offset-2">contact page</a>.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
