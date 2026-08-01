import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['169.254.83.107', 'localhost', '127.0.0.1'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Images are pre-processed by Sharp before upload; 100mb was a DoS risk
    },
    proxyClientMaxBodySize: '10mb',
  },
};

export default nextConfig;
