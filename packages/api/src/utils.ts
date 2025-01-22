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
        exposeHeaders: [
          'Access-Control-Allow-Origin',
          'Access-Control-Allow-Credentials',
        ],
        maxAge: 86400, // 24 hours
        preflight: true,
      })
    )
    .use(Logestic.preset('common'))
    .onError(({ server, error, path }) => {
      console.error(path, error)
      if (error.message.includes('Out of memory')) {
        server?.stop()
        process.exit(1)
      }
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
