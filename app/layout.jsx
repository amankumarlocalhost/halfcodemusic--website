import { Inter, Space_Grotesk } from "next/font/google";
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

export const metadata = {
  title: "HalfCodeMusic — Music Coded with Emotions",
  description:
    "HalfCodeMusic creates emotional, cinematic and modern music blending technology with creativity. Listen to the latest release now.",
  openGraph: {
    title: "HalfCodeMusic — Music Coded with Emotions",
    description:
      "Emotional, cinematic and modern music blending technology with creativity.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
