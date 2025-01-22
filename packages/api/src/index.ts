import { Elysia } from 'elysia'
import cors from '@elysiajs/cors'
import { actionsRoutes } from './routes/actions'
import { merkleTreeRoutes } from './routes/merkle-tree'
import { postsRoutes } from './routes/posts'
import { feedsRoutes } from './routes/feeds'
import { uploadRoutes } from './routes/upload'
import { farcasterRoutes } from './routes/farcaster'

const app = new Elysia()
  .use(cors())
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
