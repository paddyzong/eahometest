import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.0.228'],
  devIndicators: false,
  "compilerOptions": {
    "forceConsistentCasingInFileNames": true
  },
};

export default nextConfig;
