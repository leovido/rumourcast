import { createElysia } from '../utils'
import { t } from 'elysia'
import { neynar } from '../services/neynar'

export const farcasterRoutes = createElysia({ prefix: '/farcaster' })
  .get(
    '/casts',
    async ({ query }) => {
      const response = await neynar.getCast(query.identifier)
      return response.cast
    },
    {
      query: t.Object({
        identifier: t.String(),
      }),
    }
  )
  .get(
    '/channels/:channelId',
    async ({ params }) => {
      const response = await neynar.getChannel(params.channelId)
      return response.channel
    },
    {
      params: t.Object({
        channelId: t.String(),
      }),
    }
  )
  .get(
    '/identities',
    async ({ query }) => {
      try {
        const users = await neynar.getBulkUsers([query.address.toLowerCase()])
        const user = users?.[query.address.toLowerCase()]?.[0] || null
        return user
      } catch (error) {
        return null
      }
    },
    {
      query: t.Object({
        address: t.String(),
      }),
    }
  )
