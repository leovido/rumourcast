const dotenv = require('dotenv');
const path = require('path');

const env = dotenv.config({
  path: path.resolve(__dirname, 'packages/api/.env')
}).parsed;

module.exports = {
  apps: [
    {
      name: "rumourcast-api",
      script: "bun",
      args: "run packages/api/src/index.ts",
      cwd: "/app",
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 3001,
        ...env,
      },
    },
    {
      name: "rumourcast-updates",
      script: "bun",
      args: "run packages/api/scripts/updates.ts",
      cwd: "/app",
      watch: false,
      env: {
        NODE_ENV: "production",
        ...env,
      },
    }
  ],
};
