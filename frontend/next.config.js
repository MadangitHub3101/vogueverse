/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE,
  },
  images: {
    domains: ['vogueverse-assets.s3.amazonaws.com'],
  },
}
module.exports = nextConfig