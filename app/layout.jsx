import { Inter, Space_Grotesk } from "next/font/google";
import Loader from "@/components/Loader";
import { site, latestRelease } from "@/lib/site";
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
    "music producer",
    "cinematic music",
    "romantic songs",
    "Hindi melody",
    "Teri Payal",
    latestRelease.title,
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
        url: latestRelease.cover,
        width: 1280,
        height: 720,
        alt: `${latestRelease.title} — album artwork`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.description,
    images: [latestRelease.cover],
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
  themeColor: "#faf9fc",
  width: "device-width",
  initialScale: 1,
};

/** Schema.org structured data: the artist and the latest recording. */
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
      sameAs: Object.values(site.links),
    },
    {
      "@type": "MusicRecording",
      name: latestRelease.title,
      byArtist: { "@id": `${site.url}/#artist` },
      image: `${site.url}${latestRelease.cover}`,
      url: latestRelease.links.youtube,
    },
    {
      "@type": "WebSite",
      name: site.name,
      url: site.url,
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Loader />
        {children}
      </body>
    </html>
  );
}
