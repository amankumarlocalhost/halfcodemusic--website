import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { site } from "@/lib/site";

const title = "Privacy Policy";
const description = "How HalfCodeMusic collects, uses and protects information submitted through this website.";

export const metadata = {
  title,
  description,
  alternates: { canonical: "/privacy-policy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy Policy", href: "/privacy-policy" }]} />
      <main className="px-6 pt-10 pb-28 sm:pb-36">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-3 text-sm text-dim">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

          <div className="prose-content mt-10 space-y-8 leading-relaxed text-dim">
            <section>
              <h2 className="font-display text-xl font-semibold text-ink">Overview</h2>
              <p className="mt-3">
                {site.name} (&quot;we&quot;, &quot;us&quot;) respects your privacy. This policy explains what
                information this website collects and how it is used.
                <em> [Placeholder — replace with the legal entity name and jurisdiction operating {site.name} before publishing.]</em>
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-ink">Information We Collect</h2>
              <p className="mt-3">
                When you use the contact form on this site, we collect the name, email address, inquiry type and
                message you submit, solely to respond to your inquiry. We do not require account creation to browse
                or listen on this site.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-ink">How We Use Information</h2>
              <p className="mt-3">
                Contact form submissions are used only to reply to your message. We do not sell or share your
                information with third parties for marketing purposes.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-ink">Third-Party Services</h2>
              <p className="mt-3">
                This site links to third-party platforms, including YouTube and Instagram. Those platforms have
                their own privacy policies governing any data they collect when you interact with embedded or linked
                content.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-ink">Contact</h2>
              <p className="mt-3">
                Questions about this policy can be sent through the <a href="/contact" className="text-dim underline underline-offset-2">contact page</a>.
                <em> [Placeholder — add a dedicated privacy contact email once available.]</em>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
