/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Disable Next.js image optimization
    remotePatterns: [],
    domains: [],
  },
  // Disable console output in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error'] // Keep console.error for debugging
    } : false,
  },
  // Additional production optimizations
  ...(process.env.NODE_ENV === 'production' && {
    swcMinify: true,
    compress: true,
  }),
};

module.exports = nextConfig;
