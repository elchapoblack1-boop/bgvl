/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // better-sqlite3 must not be bundled by webpack - it's a native module
  serverExternalPackages: ['better-sqlite3'],
}

module.exports = nextConfig
