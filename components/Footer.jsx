import Image from "next/image";
import { InstagramIcon, YoutubeIcon } from "@/components/icons";
import { site } from "@/lib/site";

const socials = [
  { label: "YouTube", href: site.links.youtube, Icon: YoutubeIcon },
  { label: "Instagram", href: site.links.instagram, Icon: InstagramIcon },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 px-6 py-10">
      {/* thin gradient accent on the top border */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 mx-auto h-px w-2/3 bg-gradient-to-r from-transparent via-violet-500/50 to-transparent"
      />
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 text-sm text-white/40 sm:flex-row">
        <a href="#home" className="flex items-center gap-2 font-display font-semibold text-white/80">
          <Image src="/logo.svg" alt="" width={20} height={20} className="h-5 w-5 rounded-md" />
          {site.name}
        </a>
        <p>
          &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          {socials.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-white/40 transition-colors duration-300 hover:text-violet-300"
            >
              <Icon className="h-4.5 w-4.5" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
