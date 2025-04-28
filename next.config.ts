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
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), "bcryptjs"];
    }
    return config;
  },
  poweredByHeader: false,
  generateEtags: false,
};

module.exports = nextConfig;
