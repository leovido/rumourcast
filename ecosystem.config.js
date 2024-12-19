module.exports = {
  apps: [
    {
      name: "rumourcast-api",
      script: "bun",
      args: "run index.ts",
      cwd: "packages/api/src",
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
    },
  ],
};
