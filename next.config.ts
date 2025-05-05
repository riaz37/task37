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
  // Disable unnecessary features
  poweredByHeader: false,
  generateEtags: false,
  // Completely disable webpack cache
  webpack: (config) => {
    // Disable webpack cache entirely
    config.cache = false;
    return config;
  },
};

module.exports = nextConfig;
