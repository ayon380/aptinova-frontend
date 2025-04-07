import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental:{

    largePageDataBytes: 128 * 1024 * 1024, // 128MB
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
