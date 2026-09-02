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
        // The hero pack is immutable: its filename carries a content hash, so a
        // rebuild ships under a new URL rather than mutating this one. Without
        // this Next serves public/ as `max-age=0` and every repeat visit
        // re-downloads the whole animation.
        //
        // The generic content type is deliberate — nothing in the response
        // should hint that these bytes are frames.
        source: "/_seq/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
          { key: "Content-Type", value: "application/octet-stream" },
        ],
      },
    ];
  },
};

export default nextConfig;
