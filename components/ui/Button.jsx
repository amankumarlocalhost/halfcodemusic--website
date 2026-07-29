const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const variants = {
  primary:
    "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-[0_0_28px_rgba(139,92,246,0.4)] hover:shadow-[0_0_44px_rgba(139,92,246,0.6)] hover:-translate-y-0.5 active:translate-y-0",
  ghost:
    "glass text-ink hover:border-violet-500/50 hover:bg-violet-500/5 hover:-translate-y-0.5 active:translate-y-0",
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
