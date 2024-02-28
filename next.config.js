/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // TODO: Remove experimental flag once Suspense with SSR is stable
  experimental: {
    missingSuspenseWithCSRBailout: false
  }
}

module.exports = nextConfig
