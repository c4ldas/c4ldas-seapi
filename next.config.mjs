/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["jsdom"],
  reactStrictMode: false,
  images: {
    qualities: [75, 100],
  }
  /* eslint: { ignoreDuringBuilds: true } */
};

export default nextConfig;
