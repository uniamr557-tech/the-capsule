/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.VERCEL ? '../../.next' : '.next',
  reactStrictMode: true,
  transpilePackages: [
    '@capsule/ui',
    '@capsule/domain',
    '@capsule/api-contracts',
    '@capsule/auth',
    '@capsule/config',
  ],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
