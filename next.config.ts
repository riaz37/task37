import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: ".next",
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  poweredByHeader: false,
  generateEtags: false,
};

module.exports = nextConfig;
