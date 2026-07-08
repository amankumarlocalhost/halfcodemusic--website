const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500";

const variants = {
  primary:
    "bg-violet-600 text-white shadow-[0_0_28px_rgba(139,92,246,0.45)] hover:bg-violet-500 hover:shadow-[0_0_44px_rgba(139,92,246,0.65)] hover:-translate-y-0.5",
  ghost:
    "border border-white/15 bg-white/5 text-white backdrop-blur-md hover:border-violet-500/60 hover:bg-white/10 hover:-translate-y-0.5",
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
