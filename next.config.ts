import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fetch.com'
      }
    ]
  },
  compiler: {
    styledComponents: true
  }
};

export default nextConfig;
