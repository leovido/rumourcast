import { Elysia, cors } from 'elysia'
import { createElysia } from './utils'
import { actionsRoutes } from './routes/actions'
import { merkleTreeRoutes } from './routes/merkle-tree'
import { postsRoutes } from './routes/posts'
import { feedsRoutes } from './routes/feeds'
import { uploadRoutes } from './routes/upload'
import { farcasterRoutes } from './routes/farcaster'

const app = new Elysia()
  .use(
    cors({
      origin: [
        'https://rumourcast.xyz',
        'http://localhost:3000',
        'https://www.rumourcast.xyz',
        'http://rumourcast.xyz',
        'https://rumourcast.xyz',
        /\.rumourcast\.xyz$/, // This will match all subdomains
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      credentials: true,
      allowHeaders: [
        'Content-Type',
        'Authorization',
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Credentials',
      ],
      exposedHeaders: ['*'],
      preflight: true,
    })
  )
  .use(actionsRoutes)
  .use(merkleTreeRoutes)
  .use(postsRoutes)
  .use(feedsRoutes)
  .use(uploadRoutes)
  .use(farcasterRoutes)

app.listen({
  port: process.env.PORT || 3001,
  hostname: '0.0.0.0',
})

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
