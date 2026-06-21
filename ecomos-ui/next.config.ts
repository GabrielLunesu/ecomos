import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // UI-only prototype: no remote images, no backend rewrites.
  experimental: {
    viewTransition: true,
  },
  reactStrictMode: true,
};

export default nextConfig;
