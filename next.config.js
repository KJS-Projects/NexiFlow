/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  images: {
    remotePatterns: [new URL("https://czstpktgqcfq1gox.public.blob.vercel-storage.com/store_cZSTpKtGqcFq1goX")],
  },
};

module.exports = nextConfig;
