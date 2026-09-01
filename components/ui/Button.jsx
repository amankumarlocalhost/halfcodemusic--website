const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const variants = {
  primary:
    "bg-ink hover:bg-deep-soft text-ivory shadow-[0_2px_12px_rgba(37,39,36,0.10)] hover:shadow-[0_6px_20px_rgba(37,39,36,0.16)] hover:-translate-y-0.5 active:translate-y-0",
  ghost:
    "glass border-line text-ink hover:border-stone hover:bg-greige/40 hover:-translate-y-0.5 active:translate-y-0",
};

export default function Button({
  href,
  children,
  variant = "primary",
  className = "",
  ...rest
}) {
  return (
    <a href={href} className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </a>
  );
}
