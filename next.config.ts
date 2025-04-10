import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // experimental: {
  //   ppr: "incremental",
  // },

  /* */

  // If you do not want ESLint to run during next build, you can set the eslint.ignoreDuringBuilds option in next.config.js to true:
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
