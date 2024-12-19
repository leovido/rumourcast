import { augmentCasts, createElysia } from '../utils'
import { t } from 'elysia'
import { verifyMessage } from 'viem'
import { neynar } from '../services/neynar'
import { getPostChildren, getBulkPosts, getPost, revealPost } from '@anonworld/db'

export const postsRoutes = createElysia({ prefix: '/posts' })
  .get(
    '/:hash',
    async ({ params }) => {
      const cast = await neynar.getCast(params.hash)
      if (!cast) {
        throw new Error('Cast not found')
      }
      return (await augmentCasts([cast.cast]))[0]
    },
    {
      params: t.Object({
        hash: t.String(),
      }),
    }
  )
  .post(
    '/reveal',
    async ({ body }) => {
      const post = await getPost(body.hash)
      if (!post) {
        throw new Error('Post not found')
      }

      const isValidSignature = await verifyMessage({
        message: body.message,
        signature: body.signature as `0x${string}`,
        address: body.address as `0x${string}`,
      })
      if (!isValidSignature) {
        return {
          success: false,
        }
      }

      const address = body.address.toLowerCase()
      let username: string | undefined

      try {
        const users = await neynar.getBulkUsers([address])
        username = users?.[address]?.[0]?.username
      } catch (error) {
        console.error(error)
      }

      await revealPost(body.hash, {
        message: body.message,
        phrase: body.phrase,
        signature: body.signature,
        address: body.address,
      })

      const response = await neynar.createCast({
        fid: post.fid,
        text: `REVEALED: Posted by ${username ? `@${username}` : `${address}`}`,
        embeds: [`https://anoncast.org/posts/${body.hash}`],
        quote: body.hash,
      })

      if (!response.success) {
        throw new Error('Failed to create cast')
      }

      return {
        success: true,
        hash: response.cast.hash,
      }
    },
    {
      body: t.Object({
        hash: t.String(),
        message: t.String(),
        phrase: t.String(),
        signature: t.String(),
        address: t.String(),
      }),
    }
  )
  .post(
    '/bulk-metadata',
    async ({ body }) => {
      const [posts, relationships] = await Promise.all([
        getBulkPosts(body.hashes),
        getPostChildren(body.hashes),
      ])

      type RevealMetadata = {
        input: string
        phrase?: string
        signature?: string
        address?: string
        revealedAt: string
      } | null

      const data: Record<
        string,
        {
          hash: string
          revealHash: string | null
          revealMetadata: RevealMetadata
          relationships: {
            target: string
            targetAccount: string
            targetId: string
          }[]
        }
      > = {}

      for (const post of posts) {
        data[post.hash] = {
          hash: post.hash,
          revealHash: post.reveal_hash,
          revealMetadata: {
            input: JSON.stringify(post.data),
            ...(post.reveal_metadata as RevealMetadata),
            revealedAt: post.updated_at.toISOString(),
          },
          relationships: [],
        }
      }

      for (const relationship of relationships) {
        data[relationship.post_hash].relationships.push({
          target: relationship.target,
          targetAccount: relationship.target_account,
          targetId: relationship.target_id,
        })
      }

      return {
        data: Object.values(data),
      }
    },
    {
      body: t.Object({
        hashes: t.Array(t.String()),
      }),
    }
  )
