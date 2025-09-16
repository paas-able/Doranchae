import type { NextConfig } from 'next'

const urls = {
  auth:      process.env.AUTH_INTERNAL_URL      ?? 'http://auth:8080',
  community: process.env.COMMUNITY_INTERNAL_URL ?? 'http://community:8081',
  penpal:    process.env.PENPAL_INTERNAL_URL    ?? 'http://penpal:8082',
  welfare:   process.env.WELFARE_INTERNAL_URL   ?? 'http://welfare:8083',
}

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: '/api/auth/:path*',      destination: `${urls.auth}/api/auth/:path*` },
      { source: '/api/community/:path*', destination: `${urls.community}/api/community/:path*` },
      { source: '/api/penpal/:path*',    destination: `${urls.penpal}/api/penpal/:path*` },
      { source: '/api/welfare/:path*',   destination: `${urls.welfare}/api/welfare/:path*` },

      // (선택) 공통 헬스 확인을 auth로 위임하고 싶으면:
      // { source: '/api/healthz', destination: `${urls.auth}/healthz` },
    ]
  },
}

export default nextConfig
