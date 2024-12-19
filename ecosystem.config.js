module.exports = {
  apps: [
    {
      name: "rumourcast-api",
      script: "./packages/api/src/index.ts",
      interpreter: "bun",
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
    },
  ],
};
