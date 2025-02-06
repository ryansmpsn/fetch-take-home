import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fetch.com'
      },
      {
        protocol: 'https',
        hostname: 'frontend-take-home.fetch.com'
      }
    ]
  },
  compiler: {
    styledComponents: true
  }
};

export default nextConfig;
