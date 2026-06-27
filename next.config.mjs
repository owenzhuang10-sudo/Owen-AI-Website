/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure the daily data JSON is bundled with the serverless functions that
  // read it at request time (otherwise Vercel can return ENOENT).
  outputFileTracingIncludes: {
    "/": ["./data/*.json"],
    "/news": ["./data/*.json"],
    "/rankings": ["./data/*.json"],
  },
};

export default nextConfig;
