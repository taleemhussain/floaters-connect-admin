import type { NextConfig } from "next";

const allowedDevOrigins = ["127.0.0.1"];

if (process.env.REPLIT_DEV_DOMAIN) {
  allowedDevOrigins.push(process.env.REPLIT_DEV_DOMAIN);
}

const nextConfig: NextConfig = {
  allowedDevOrigins,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5005/api/:path*", // Proxy to NestJS
      },
    ];
  },
};

export default nextConfig;
