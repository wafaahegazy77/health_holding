import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  reactCompiler: true,
  // output: "export",
  // basePath: "",
  // assetPrefix: "",
  trailingSlash: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.inspire-sa.com",
        pathname: "/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);