import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Disable webpack
    webpackBuildWorker: false,
  },
};

export default nextConfig;
