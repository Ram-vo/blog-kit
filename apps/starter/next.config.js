const isStaticExport = process.env.STARTER_OUTPUT_MODE === "export";
const basePath = process.env.STARTER_BASE_PATH ?? "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: isStaticExport ? "export" : undefined,
  trailingSlash: isStaticExport,
  basePath,
  assetPrefix: basePath || undefined,
  images: {
    unoptimized: isStaticExport
  },
  experimental: {
    typedRoutes: true
  }
};

export default nextConfig;
