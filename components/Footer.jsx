import Image from "next/image";
import Link from "next/link";
import { InstagramIcon, YoutubeIcon } from "@/components/icons";
import { footerLinks, site } from "@/lib/site";
import { socialLinks } from "@/data/social";

const icons = { youtube: YoutubeIcon, instagram: InstagramIcon };

export default function Footer() {
  return (
    <footer className="relative border-t border-line px-6 pt-14 pb-8">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 mx-auto h-px w-2/3 bg-gradient-to-r from-transparent via-stone to-transparent"
      />

      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-10 sm:flex-row sm:items-start">
          <div className="flex flex-col items-center gap-3 sm:items-start">
            <Link href="/" className="flex items-center gap-2.5 font-display text-lg font-bold">
              <Image src="/logo.svg" alt="" width={28} height={28} className="h-7 w-7 rounded-lg" />
              HalfCode
              <span className="-ml-2 bg-gradient-to-r from-accent to-neon bg-clip-text text-transparent">
                Music
              </span>
            </Link>
            <p className="max-w-xs text-center text-sm text-dim sm:text-left">{site.tagline}</p>
            <div className="flex items-center gap-3 pt-1">
              {socialLinks.map((platform) => {
                const Icon = icons[platform.id];
                return (
                  <a
                    key={platform.id}
                    href={platform.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={platform.label}
                    className="glass flex h-10 w-10 items-center justify-center rounded-full text-ink/60 transition-all duration-300 hover:border-stone hover:text-ink"
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </a>
                );
              })}
            </div>
          </div>

          <nav aria-label="Footer">
            <p className="mb-3 text-center text-xs font-semibold tracking-[0.15em] text-ink/55 uppercase sm:text-left">
              Explore
            </p>
            <ul className="flex flex-col items-center gap-2 sm:items-start">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-dim transition-colors duration-200 hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/contact" className="text-sm text-dim transition-colors duration-200 hover:text-ink">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Legal">
            <p className="mb-3 text-center text-xs font-semibold tracking-[0.15em] text-ink/55 uppercase sm:text-left">
              Legal
            </p>
            <ul className="flex flex-col items-center gap-2 sm:items-start">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-dim transition-colors duration-200 hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-10 border-t border-line/60 pt-6 text-center text-xs text-ink/55">
          &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
