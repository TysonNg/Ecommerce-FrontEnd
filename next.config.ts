import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_BUILD_DIR || '.next',
  /* config options here */
  images: {
    domains: ['cdn.pixabay.com','static-00.iconduck.com','img.freepik.com','themewagon.github.io','websitedemos.net','res.cloudinary.com','www.google.com']
  },
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
