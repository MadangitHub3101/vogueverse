/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
 env: {
  NEXT_PUBLIC_CART_URL:     process.env.NEXT_PUBLIC_CART_URL,
  NEXT_PUBLIC_SEARCH_URL:   process.env.NEXT_PUBLIC_SEARCH_URL,
  NEXT_PUBLIC_WISHLIST_URL: process.env.NEXT_PUBLIC_WISHLIST_URL,
  NEXT_PUBLIC_REC_URL:      process.env.NEXT_PUBLIC_REC_URL,
  NEXT_PUBLIC_PAYMENT_URL:  process.env.NEXT_PUBLIC_PAYMENT_URL,
  },
  images: {
    domains: ['images.unsplash.com'],
  },
}

module.exports = nextConfig
