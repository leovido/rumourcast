module.exports = {
  apps: [
    {
      name: "rumourcast-api",
      script: "bun",
      args: "run api:start", // or your API start script
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
    },
    {
      name: "rumourcast-queue",
      script: "bun",
      args: "run queue:start", // or your queue start script
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
