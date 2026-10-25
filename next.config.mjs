/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // AdGuard / adblock friendly — tandai site tanpa iklan
          { key: 'X-Ad-Block-Friendly', value: 'true' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Biar cover & embed Bstation tidak ke-block filter kosmetik
          { key: 'Content-Security-Policy', value: "frame-ancestors 'self' https://wibu-id.vercel.app https://wibu.id; img-src 'self' data: https: blob:; media-src 'self' https: blob:; connect-src 'self' https://api.bilibili.tv https://www.bilibili.tv;" },
        ],
      },
    ];
  },
};
export default nextConfig;
