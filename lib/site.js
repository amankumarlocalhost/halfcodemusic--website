/**
 * Central site content & links.
 * Replace the placeholder URLs, numbers and quotes here — every section reads from this file.
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

export const latestRelease = {
  title: "Love at First Sight",
  artist: "Teri Payal · HalfCodeMusic",
  description:
    "Teri Payal — a soulful, romantic melody that captures the magic of first love. Warm vocals, delicate textures and a rhythm that feels like falling in love all over again.",
  cover: "/latest-release.jpg",
  links: {
    youtube: "https://www.youtube.com/watch?v=gVaVjpZ080I",
  },
  /** Genre tags shown under the description */
  tags: ["Romantic", "Melody", "Hindi"],
};

/**
 * Real channel figures — update these as the channel grows.
 * `value` is the number counted up to; `suffix` is appended after it.
 */
export const stats = [
  { label: "Videos Released", value: 27, suffix: "" },
  { label: "YouTube Views", value: 12, suffix: "K+" },
  { label: "Subscribers", value: 90, suffix: "+" },
];

/**
 * PLACEHOLDER quotes — replace with real listener / collaborator feedback.
 */
export const testimonials = [
  {
    quote:
      "Teri Payal has been on repeat all week. The melody feels warm and personal — like it was written just for you.",
    name: "Aarav S.",
    role: "Listener · YouTube",
  },
  {
    quote:
      "A rare mix of technical precision and real emotion. Every layer in the mix has a purpose.",
    name: "Priya M.",
    role: "Independent Vocalist",
  },
  {
    quote:
      "Clean production, cinematic builds, and hooks that stay with you. HalfCodeMusic is one to watch.",
    name: "Rohan K.",
    role: "Music Blogger",
  },
];

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Latest Release", href: "#music" },
  { label: "About", href: "#about" },
  { label: "Connect", href: "#connect" },
];
