import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@vercel/blob", "@vercel/oidc"],
};

export default nextConfig;
