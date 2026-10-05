import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@vercel/blob", "@vercel/oidc"],
  // App autonoma dentro la repo: non risalire al package-lock della cartella principale.
  turbopack: { root: path.join(__dirname) },
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
