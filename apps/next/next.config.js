const withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
  });
  
  const nextConfig = withPWA({
    experimental: {
      appDir: true,
    },
  });
  
  module.exports = nextConfig;