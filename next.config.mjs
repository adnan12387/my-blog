/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    '/api/**/*': ['./src/generated/prisma/**/*'],
    '/**/*': ['./src/generated/prisma/**/*'],
  },
  turbopack: {},
};

export default nextConfig;