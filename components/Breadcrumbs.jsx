import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { site } from "@/lib/site";

/** Visible breadcrumb trail + matching BreadcrumbList structured data. */
export default function Breadcrumbs({ items }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: `${site.url}${item.href}`,
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="mx-auto max-w-6xl px-6 pt-24 sm:pt-28">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-dim">
        {items.map((item, i) => (
          <li key={item.href} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3 w-3 text-ink/30" />}
            {i === items.length - 1 ? (
              <span aria-current="page" className="text-ink/70">
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className="transition-colors hover:text-ink">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
