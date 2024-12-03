const withPWA = require("next-pwa")({
  dest: "public",
  disable: false,
});

const nextConfig = withPWA({
  experimental: {
    appDir: true,
  },
});

module.exports = nextConfig;
