/**
 * Site-wide config: brand identity, domain and primary navigation.
 * Release, video, social and artist content live in `/data` — this file
 * only holds what every page needs regardless of content type.
 */

export const site = {
  name: "HalfCodeMusic",
  tagline: "Music Coded with Emotions.",
  description:
    "Cinematic soundscapes where technology meets feeling. Modern, emotional music — engineered note by note, felt beat by beat.",
  /** Production domain — update if the site is deployed elsewhere. Used for SEO tags, sitemap and canonical URLs. */
  url: "https://halfcodemusic.com",
  links: {
    youtube: "https://www.youtube.com/@halfcodemusic",
    instagram: "https://www.instagram.com/halfcodemusic?igsh=MWlweTgxYW1yMXgx",
  },
};

/** Primary navigation in the navbar. */
export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Music", href: "/music" },
  { label: "Videos", href: "/videos" },
  { label: "Connect", href: "/connect" },
];

export const footerLinks = {
  /** About and Gallery are still live pages — off the navbar, kept discoverable here. */
  explore: [
    { label: "Home", href: "/" },
    { label: "Music", href: "/music" },
    { label: "Videos", href: "/videos" },
    { label: "About", href: "/about" },
    { label: "Gallery", href: "/gallery" },
    { label: "Connect", href: "/connect" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms", href: "/terms" },
  ],
};
