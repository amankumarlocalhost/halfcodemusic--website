/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
    ],
  },

  async headers() {
    return [
      {
        // Hero frames are immutable: the path carries a version segment, so a
        // re-encode ships under a new URL rather than mutating these. Without
        // this Next serves public/ as `max-age=0`, which makes every repeat
        // visit revalidate all 600 frames — hundreds of round trips before the
        // animation can run.
        source: "/hero-frames/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
