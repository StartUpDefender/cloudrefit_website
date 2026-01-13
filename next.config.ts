import type { NextConfig } from "next";

const isTurbopack = process.env.TURBOPACK === "1";

// Conditionally add webpack configuration only when NOT using turbopack
const nextConfig: NextConfig = {
  transpilePackages: ["mui-one-time-password-input"],
  reactStrictMode: false,
  eslint: {
    // Only enable ESLint in development
    ignoreDuringBuilds: process.env.NODE_ENV === "production",
  },
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // ignoreBuildErrors: true
  },
  turbopack: {
    rules: {},
    resolveAlias: {
      'dayjs/plugin/localizedFormat.js': 'dayjs/plugin/localizedFormat',
      'dayjs/plugin/weekOfYear.js': 'dayjs/plugin/weekOfYear',
      'dayjs/plugin/customParseFormat.js': 'dayjs/plugin/customParseFormat',
      'dayjs/plugin/isBetween.js': 'dayjs/plugin/isBetween',
      'dayjs/plugin/advancedFormat.js': 'dayjs/plugin/advancedFormat',
    },
  },
  ...(!isTurbopack && {
    webpack: (config) => {
      if (config.module && config.module.rules) {
        config.module.rules.push({
          test: /\.(json|js|ts|tsx|jsx)$/,
          resourceQuery: /raw/,
          use: "raw-loader",
        });
      }

      // Fix for dayjs plugin resolution in webpack builds
      if (config.resolve) {
        config.resolve.alias = {
          ...config.resolve.alias,
          'dayjs/plugin/localizedFormat.js': 'dayjs/plugin/localizedFormat',
          'dayjs/plugin/weekOfYear.js': 'dayjs/plugin/weekOfYear',
          'dayjs/plugin/customParseFormat.js': 'dayjs/plugin/customParseFormat',
          'dayjs/plugin/isBetween.js': 'dayjs/plugin/isBetween',
          'dayjs/plugin/advancedFormat.js': 'dayjs/plugin/advancedFormat',
        };
      }

      return config;
    },
  }),
};

export default nextConfig;
