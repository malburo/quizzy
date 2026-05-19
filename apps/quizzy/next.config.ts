import type { NextConfig } from 'next'
import path from 'node:path'

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname, '../..'),
  typedRoutes: true,
  reactCompiler: true,
  cacheComponents: true,
}

export default nextConfig
