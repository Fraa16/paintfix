import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  devIndicators: false,
  experimental: {
    // Two root layouts (html lang="de" and lang="en") need a 404 page outside both layouts.
    globalNotFound: true,
  },
  images: {
    // AVIF zuerst (deutlich kleiner als WebP, wichtig für das LCP auf Mobilgeräten), sonst WebP.
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
