/** @type {import('next').NextConfig} */
const nextConfig = {
  // Explicitly set output to export
  distDir: '.next',
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
};

module.exports = nextConfig;