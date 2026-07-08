import { AudioLines } from "lucide-react";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-white/40 sm:flex-row">
        <a href="#home" className="flex items-center gap-2 font-display font-semibold text-white/80">
          <AudioLines className="h-4 w-4 text-violet-400" />
          {site.name}
        </a>
        <p>
          &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
        <p>
          Made with <span aria-label="love">❤️</span>
        </p>
      </div>
    </footer>
  );
}
