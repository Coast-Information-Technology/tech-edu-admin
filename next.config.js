/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Disable Next.js image optimization
    remotePatterns: [],
    domains: [],
  },
};

module.exports = nextConfig;
