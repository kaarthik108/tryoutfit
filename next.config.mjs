/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "replicate.delivery",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname:
          "amplify-tryoutfit-kaarthikand-tryoutbucketccc32003-bhgw6f11banb.s3.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
