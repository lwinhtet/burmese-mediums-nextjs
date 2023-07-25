/** @type {import('next').NextConfig} */
// next.config.js is a regular Node.js module,
// not a JSON file. It gets used by the Next.js server and build phases,
// and it's not included in the browser build.
const nextConfig = {
  reactStrictMode: true,
  images: {
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: process.env.SPACES_ENDPOINT,
    //     port: '',
    //     pathname: ''
    //   }
    // ],
    domains: [
      'storage.googleapis.com',
      'lh1.googleusercontent.com',
      'lh2.googleusercontent.com',
      'lh3.googleusercontent.com',
      'lh4.googleusercontent.com',
      'lh5.googleusercontent.com',
      'lh6.googleusercontent.com',
      'burmesemediums-storage.sgp1.digitaloceanspaces.com'
    ]
  }

  // rewrites: async function() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: 'http://localhost:8080/:path*'
  //     }
  //   ];
  // }
  // exportPathMap: async function(
  //   defaultPathMap,
  //   { dev, dir, outDir, distDir, buildId }
  // ) {
  //   return {
  //     '/': { page: '/' },
  //     '/about': { page: '/about' },
  //     '/p/hello-nextjs': { page: '/post', query: { title: 'hello-nextjs' } },
  //     '/p/learn-nextjs': { page: '/post', query: { title: 'learn-nextjs' } },
  //     '/p/deploy-nextjs': { page: '/post', query: { title: 'deploy-nextjs' } }
  //   };
  // }
};

module.exports = nextConfig;
