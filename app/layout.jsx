import { Inter, Space_Grotesk } from "next/font/google";
import Loader from "@/components/Loader";
import InspectGuard from "@/components/InspectGuard";
import { PlayerProvider } from "@/components/player/PlayerProvider";
import PlayerBar from "@/components/player/PlayerBar";
import { site } from "@/lib/site";
import { featuredRelease } from "@/data/music";
import { socialLinks } from "@/data/social";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const title = `${site.name} — Music Coded with Emotions`;

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: title,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [
    "HalfCodeMusic",
    "HalfCode Music",
    "independent music producer",
    "cinematic music",
    "romantic songs",
    "Hindi melody",
    "original music",
    featuredRelease.title,
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title,
    description: site.description,
    url: "/",
    siteName: site.name,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: featuredRelease.cover,
        width: 1280,
        height: 1280,
        alt: `${featuredRelease.title} — album artwork`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.description,
    images: [featuredRelease.cover],
  },
  verification: {
    google: "D1FqyoJiJ7CejLKJRsoGglSLOdDXe-ANEFq2ZqZ1icw",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport = {
  themeColor: "#f4f3ee",
  width: "device-width",
  initialScale: 1,
};

/** Schema.org structured data: the artist, primary channels and the site itself. */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MusicGroup",
      "@id": `${site.url}/#artist`,
      name: site.name,
      description: site.description,
      url: site.url,
      logo: `${site.url}/logo.svg`,
      sameAs: socialLinks.map((s) => s.href),
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      name: site.name,
      url: site.url,
      publisher: { "@id": `${site.url}/#artist` },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {/* Blanks the React DevTools bridge before the app bundle runs, so the
            component tree cannot be browsed. Inline and first, because it only
            works if it lands before React registers with the extension. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              'var h=window.__REACT_DEVTOOLS_GLOBAL_HOOK__;if(h){h.inject=function(){};h.onCommitFiberRoot=function(){};h.onCommitFiberUnmount=function(){};h.supportsFiber=false;}',
          }}
        />
        {/* The hero is scroll-scrubbed, so restoring the previous scroll on a
            reload drops you into the middle of the animation. Opting out here,
            inline and before hydration, beats doing it in an effect — the
            browser restores scroll early, and this runs before it can. Only on
            the home page; every other route keeps normal restoration. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              'if(location.pathname==="/"&&"scrollRestoration" in history){history.scrollRestoration="manual";}',
          }}
        />
        <InspectGuard />
        <Loader />
        <PlayerProvider>
          {children}
          <PlayerBar />
        </PlayerProvider>
      </body>
    </html>
  );
}
