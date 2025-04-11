import { createJiti } from "jiti";

import { fileURLToPath } from "node:url";
import createNextIntlPlugin from "next-intl/plugin";

const jiti = createJiti(fileURLToPath(import.meta.url));
const withNextIntl = createNextIntlPlugin();

const serverEnvPath = "./src/env/serverEnvs";
const clientEnvPath = "./src/env/clientEnvs";

const { env } = jiti(serverEnvPath);
jiti(clientEnvPath);

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: env.STANDALONE === 1 ? "standalone" : undefined,
  reactStrictMode: true,
  experimental: {
    typedRoutes: ["1", "true"].includes(process.env.TYPED_ROUTES ?? ""),
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ["@node-rs/argon2"],
  images: {
    remotePatterns: [
      { hostname: "azxhasnfullerxp7.public.blob.vercel-storage.com" },
      { hostname: "*" },
    ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.m?js$/,
      type: "javascript/auto",
      resolve: {
        fullySpecified: false,
      },
    });

    return config;
  },
};

export default withNextIntl(nextConfig);
