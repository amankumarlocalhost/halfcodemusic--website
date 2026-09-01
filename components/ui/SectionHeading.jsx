import Reveal from "@/components/ui/Reveal";

/** Consistent eyebrow + H2 + optional lede used across every section. */
export default function SectionHeading({
  eyebrow,
  title,
  highlight,
  lede,
  align = "center",
  as: Heading = "h2",
}) {
  const alignClass = align === "left" ? "text-left items-start" : "text-center items-center mx-auto";

  return (
    <Reveal className={`flex max-w-2xl flex-col ${alignClass}`}>
      {eyebrow && (
        <span className="glass mb-4 inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-dim uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-neon" />
          {eyebrow}
        </span>
      )}
      <Heading className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
        {title}{" "}
        {highlight && (
          <span className="bg-gradient-to-r from-accent to-neon bg-clip-text text-transparent">
            {highlight}
          </span>
        )}
      </Heading>
      {lede && <p className="mt-5 leading-relaxed text-dim">{lede}</p>}
    </Reveal>
  );
}
