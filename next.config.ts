import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Disable webpack
    webpackBuildWorker:true,
  },
};

export default nextConfig;
