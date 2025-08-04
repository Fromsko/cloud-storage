/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // serverComponentsExternalPackages is deprecated, use serverExternalPackages instead
  },
  serverExternalPackages: ['pocketbase'],
  images: {
    domains: ['localhost', '127.0.0.1'],
  },
}

module.exports = nextConfig