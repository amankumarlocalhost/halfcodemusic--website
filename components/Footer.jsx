import Image from "next/image";
import { InstagramIcon, YoutubeIcon } from "@/components/icons";
import { navLinks, site } from "@/lib/site";

const socials = [
  { label: "YouTube", href: site.links.youtube, Icon: YoutubeIcon },
  { label: "Instagram", href: site.links.instagram, Icon: InstagramIcon },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-ink/10 px-6 pt-14 pb-8">
      {/* thin gradient accent on the top border */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 mx-auto h-px w-2/3 bg-gradient-to-r from-transparent via-violet-500/50 to-transparent"
      />

      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row sm:items-start">
          <div className="flex flex-col items-center gap-3 sm:items-start">
            <a href="#home" className="flex items-center gap-2.5 font-display text-lg font-bold">
              <Image src="/logo.svg" alt="" width={28} height={28} className="h-7 w-7 rounded-lg" />
              HalfCode
              <span className="-ml-2 bg-gradient-to-r from-accent to-neon bg-clip-text text-transparent">
                Music
              </span>
            </a>
            <p className="max-w-xs text-center text-sm text-dim sm:text-left">{site.tagline}</p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap items-center justify-center gap-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-dim transition-colors duration-200 hover:text-ink"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="glass flex h-10 w-10 items-center justify-center rounded-full text-ink/60 transition-all duration-300 hover:border-violet-500/50 hover:text-violet-600"
              >
                <Icon className="h-4.5 w-4.5" />
              </a>
            ))}
          </div>
        </div>

        <p className="mt-10 border-t border-ink/5 pt-6 text-center text-xs text-ink/40">
          &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
