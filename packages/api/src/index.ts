import { Elysia } from 'elysia'
import cors from '@elysiajs/cors'
import { actionsRoutes } from './routes/actions'
import { merkleTreeRoutes } from './routes/merkle-tree'
import { postsRoutes } from './routes/posts'
import { feedsRoutes } from './routes/feeds'
import { uploadRoutes } from './routes/upload'
import { farcasterRoutes } from './routes/farcaster'

const app = new Elysia()
  .use(
    cors({
      origin: (request: Request): boolean => {
        const origin = request.headers.get('origin')
        return (
          origin === 'https://rumourcast.xyz' ||
          origin === 'https://api-new.rumourcast.xyz' ||
          origin === 'http://localhost:3000' ||
          (origin?.endsWith('.rumourcast.xyz') ?? false)
        )
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],
      credentials: true,
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Accept',
        'Origin',
        'X-Requested-With',
      ],
      exposeHeaders: ['Access-Control-Allow-Origin', 'Access-Control-Allow-Credentials'],
      maxAge: 86400, // 24 hours
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
