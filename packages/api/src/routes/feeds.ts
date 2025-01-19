import { augmentCasts, createElysia } from '../utils'
import { t } from 'elysia'
import { redis } from '../services/redis'
import { neynar } from '../services/neynar'
import { Cast } from '../services/neynar/types'

export const feedsRoutes = createElysia({ prefix: '/feeds' })
  .get(
    '/:fid/trending',
    async ({ params }) => {
      try {
        let casts: Array<Cast>
        console.log('[feeds] Getting trending feed for FID:', params.fid)

        const cached = await redis.getTrendingFeed(params.fid)
        if (cached) {
          console.log('[feeds] Using cached trending feed')
          casts = JSON.parse(cached)
        } else {
          console.log('[feeds] Cache miss, fetching from Neynar')
          const response = await neynar.getUserCasts(params.fid, 150)
          casts = await buildTrendingFeed(params.fid, response.casts)
        }

        return { data: await augmentCasts(casts) }
      } catch (error) {
        console.error('[feeds] Error getting trending feed:', error)
        throw error
      }
    },
    {
      params: t.Object({
        fid: t.Number(),
      }),
    }
  )
  .get(
    '/:fid/new',
    async ({ params }) => {
      let casts: Array<Cast>

      const cached = await redis.getNewFeed(params.fid)
      if (cached) {
        casts = JSON.parse(cached)
      } else {
        const response = await neynar.getUserCasts(params.fid, 150)
        casts = await buildNewFeed(params.fid, response.casts)
      }

      return { data: await augmentCasts(casts) }
    },
    {
      params: t.Object({ fid: t.Number() }),
    }
  )

const buildTrendingFeed = async (fid: number, casts: Array<Cast>) => {
  const now = Date.now()

  const castScores: Record<string, number> = {}
  for (const cast of casts) {
    const ageInHours = (now - new Date(cast.timestamp).getTime()) / 3600000
    const score = (cast.reactions.likes_count || 0) / (ageInHours + 2) ** 1.5
    castScores[cast.hash] = score
  }

  const sortedCasts = Object.entries(castScores)
    .sort((a, b) => b[1] - a[1])
    .map(([hash]) => casts.find((c) => c.hash === hash)!)
    .slice(0, 50)

  await redis.setTrendingFeed(fid, JSON.stringify(sortedCasts))

  return sortedCasts
}

const buildNewFeed = async (fid: number, casts: Array<Cast>) => {
  await redis.setNewFeed(fid, JSON.stringify(casts))
  return casts
}

export const buildFeeds = async (fid: number) => {
  const response = await neynar.getUserCasts(fid, 150)
  await buildTrendingFeed(fid, response.casts)
  await buildNewFeed(fid, response.casts)
}
