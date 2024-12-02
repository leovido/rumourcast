const withPWA = require('next-pwa')({
    dest: 'public', // Output directory for PWA assets
    disable: process.env.NODE_ENV === 'development', // Disable in dev
  });
  
  const nextConfig = withPWA({
    experimental: {
      appDir: true, // Enable App Directory support
    },
  });
  
  module.exports = nextConfig;