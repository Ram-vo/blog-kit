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
  typedRoutes: !isStaticExport,
  webpack(config) {
    config.resolve.extensionAlias = {
      ...config.resolve.extensionAlias,
      ".js": [".ts", ".tsx", ".js"]
    };

    return config;
  }
};

export default nextConfig;
