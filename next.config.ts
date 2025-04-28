import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    },
    optimizePackageImports: [
      '@prisma/client',
      'date-fns',
      'next-auth',
      'swagger-ui-react'
    ]
  },
  typescript: {
    ignoreBuildErrors: true
  }
};

export default nextConfig;
