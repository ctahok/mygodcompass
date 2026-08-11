/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for GitHub Pages / Vercel static hosting
  output: "export",
  // GitHub Pages serves the repo under /<repo-name>/ — set via env in CI
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  // Keep asset URLs consistent with basePath
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
