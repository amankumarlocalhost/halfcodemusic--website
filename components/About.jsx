import { Code2, Film, Heart } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const pillars = [
  { Icon: Heart, label: "Emotional" },
  { Icon: Film, label: "Cinematic" },
  { Icon: Code2, label: "Engineered" },
];

export default function About() {
  return (
    <section id="about" className="relative px-6 py-28 sm:py-36">
      {/* soft ambient glow */}
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[120px]"
      />

      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal>
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Who is{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
              HalfCodeMusic
            </span>
            ?
          </h2>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mt-8 text-lg leading-relaxed text-white/60">
            HalfCodeMusic lives at the intersection of technology and feeling —
            crafting emotional, cinematic and modern music where every layer is
            engineered with intention. Half logic, half soul: melodies written in
            code, but felt in the heart.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            {pillars.map(({ Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-md transition-colors duration-300 hover:border-violet-500/40"
              >
                <Icon className="h-4.5 w-4.5 text-violet-400" />
                <span className="text-sm font-medium text-white/80">{label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
