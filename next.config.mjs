/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
          {
            source: '/',
            destination: '/f/file',
            permanent: true,
          },
        ]
      },
};

export default nextConfig;
