import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Map root to the exported static site's root page
      { source: "/", destination: "/site/page.html" },
      // Map any nested path to its corresponding static HTML page
      { source: "/:path*", destination: "/site/:path*/page.html" },
    ];
  },
};

export default nextConfig;
