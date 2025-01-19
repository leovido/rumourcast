import cors from '@elysiajs/cors'
import { Elysia } from 'elysia'
import { Logestic } from 'logestic'
import { Cast } from './services/neynar/types'
import {
  getBulkCredentials,
  getPostChildren,
  getPostParentAndSiblings,
} from '@anonworld/db'
import { getBulkPosts } from '@anonworld/db'

export const createElysia = (config?: ConstructorParameters<typeof Elysia>[0]) =>
  new Elysia(config)
    .use(cors({
      origin: [
        'https://rumourcast.xyz', 
        'https://api.rumourcast.xyz',
        'https://api2.rumourcast.xyz',
        /^https:\/\/.*--rumourcast\.vercel\.app$/  // Allow all Vercel preview URLs
      ],
      credentials: true,
      allowedHeaders: ['content-type', 'x-forwarded-proto'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      preflight: true,
      maxAge: 5 * 60 // Cache preflight requests for 5 minutes
    }))
    .onRequest(({ request }) => {
      // Log the protocol being used
      console.log('[request]', {
        url: request.url,
        proto: request.headers.get('x-forwarded-proto'),
        host: request.headers.get('host')
      })
    })
    .listen({
      port: 3001,
      hostname: '0.0.0.0',
      development: process.env.NODE_ENV !== 'production',
      idleTimeout: 10,
    })

export const augmentCasts = async (casts: Cast[]) => {
  const hashes = casts.map((cast) => cast.hash)
  const [posts, children, relationships, credentials] = await Promise.all([
    getBulkPosts(hashes),
    getPostChildren(hashes),
    getPostParentAndSiblings(hashes),
    getBulkCredentials(hashes),
  ])

  return casts.map((cast) => {
    const post = posts.find((p) => p.hash === cast.hash)
    const castChildren = children.filter((r) => r.post_hash === cast.hash)
    const castRelationships = relationships[cast.hash]
    const castCredentials = credentials.filter(
      (c) => c.post_credentials.post_hash === cast.hash
    )

    return {
      ...cast,
      reveal: post?.reveal_hash
        ? {
            ...(post?.reveal_metadata || {}),
            revealHash: post.reveal_hash,
            input: JSON.stringify(post?.data),
            revealedAt: post?.updated_at.toISOString(),
          }
        : undefined,
      children: castChildren.map((c) => ({
        target: c.target,
        targetAccount: c.target_account,
        targetId: c.target_id,
      })),
      siblings:
        castRelationships?.siblings.map((s) => ({
          target: s.target,
          targetAccount: s.target_account,
          targetId: s.target_id,
        })) ?? [],
      parent: castRelationships?.parent
        ? {
            target: castRelationships.parent.target,
            targetAccount: castRelationships.parent.target_account,
            targetId: castRelationships.parent.target_id,
          }
        : undefined,
      credentials: castCredentials.map((c) => c.credentials),
    }
  })
}
