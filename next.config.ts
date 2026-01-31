import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'https://backend-weld-pi-97.vercel.app/api/v1/:path*',
      },
    ];
  },
};

export default nextConfig;
