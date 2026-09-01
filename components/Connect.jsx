import SectionHeading from "@/components/ui/SectionHeading";
import SocialCard from "@/components/SocialCard";
import { socialLinks } from "@/data/social";

export default function Connect({ compact = false, as = "h2" }) {
  return (
    <section aria-labelledby="connect-heading" className="relative overflow-hidden px-6 py-28 sm:py-36">
      <div
        aria-hidden
        className="absolute bottom-0 left-1/2 h-80 w-[40rem] -translate-x-1/2 translate-y-1/2 rounded-full bg-sage/45 blur-[120px]"
      />

      <div className="relative mx-auto max-w-3xl text-center">
        <SectionHeading
          eyebrow="Community"
          title="Let's"
          highlight="Connect"
          lede={
            compact
              ? "Follow the journey and stream the sound."
              : "Follow the journey, stream the sound, or reach out for collaborations."
          }
          as={as}
        />

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {socialLinks.map((platform) => (
            <SocialCard key={platform.id} platform={platform} />
          ))}
        </div>
      </div>
    </section>
  );
}
