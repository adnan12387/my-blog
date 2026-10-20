/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    '/**/*': ['./node_modules/.prisma/client/**/*'],
  },
  turbopack: {},
};

export default nextConfig;