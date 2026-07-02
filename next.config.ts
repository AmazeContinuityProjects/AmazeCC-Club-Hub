import type { NextConfig } from "next";

const API_TARGET = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
    }
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_TARGET}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
