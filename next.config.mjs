/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"], // Optimize Chakra UI imports
  },
  async headers() {
    return [
      {
        source: "/api/:path*", // ✅ Apply to all API routes
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*", // ✅ Allow requests from any origin (adjust for security)
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, OPTIONS", // ✅ Allow GET & POST requests
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization", // ✅ Allow common headers
          },
        ],
      },
      {
        source: "/landing",
        headers: [
          {
            key: "landing-custom-header",
            value: "landing header",
          },
          {
            key: "non-landing-custom-header",
            value: "non-landing header",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
