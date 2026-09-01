import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

export default function ContactCTA() {
  return (
    <section aria-labelledby="contact-cta-heading" className="relative overflow-hidden px-6 py-28 sm:py-32">
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 h-72 w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sage/45 blur-[130px]"
      />
      <Reveal className="relative mx-auto max-w-2xl text-center">
        <h2 id="contact-cta-heading" className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Have a collaboration or{" "}
          <span className="bg-gradient-to-r from-accent to-neon bg-clip-text text-transparent">production inquiry?</span>
        </h2>
        <p className="mt-4 text-dim">Reach out — I read every message.</p>
        <Link
          href="/contact"
          className="group mt-8 inline-flex items-center gap-2.5 rounded-full bg-ink hover:bg-deep-soft px-8 py-4 text-sm font-semibold text-ivory shadow-[0_2px_12px_rgba(37,39,36,0.10)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(37,39,36,0.16)]"
        >
          Get in touch
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </Reveal>
    </section>
  );
}
