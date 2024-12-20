import {
  Action,
  createPost,
  createPostRelationship,
  getPost,
  getPostChildren,
} from '@anonworld/db'
import { neynar } from '../services/neynar'
import { twitter } from '../services/twitter'
import { Cast } from '../services/neynar/types'

export type PromotePostActionMetadata = {
  fid: number
  twitter?: string
}

export type PromotePostActionData = {
  hash: string
  reply?: boolean
}

export class PromotePostAction {
  private metadata: PromotePostActionMetadata
  private data: PromotePostActionData

  constructor(action: Action, data: any) {
    this.metadata = action.metadata as PromotePostActionMetadata
    this.data = data
  }

  async isAbleToPromote(cast: Cast) {
    if (!this.metadata.twitter) return true

    const unableToPromoteRegex = [
      /.*@clanker.*launch.*/i,
      /.*dexscreener.com.*/i,
      /.*dextools.io.*/i,
      /.*0x[a-fA-F0-9]{40}.*/i,
      /(^|\s)\$(?!ANON\b)[a-zA-Z]+\b/i,
    ]

    const isValidText = !unableToPromoteRegex.some((regex) => cast.text.match(regex))
    const isValidEmbeds = !cast.embeds?.some((embed) =>
      unableToPromoteRegex.some((regex) => embed.url?.match(regex))
    )

    return isValidText && isValidEmbeds
  }

  async getOriginalPost(cast: Cast) {
    const post = await getPost(this.data.hash)
    if (post) return post

    await createPost({
      hash: this.data.hash,
      fid: cast.author.fid,
      data: {
        text: cast.text,
        embeds: cast.embeds.filter((embed) => embed.url).map((embed) => embed.url),
        quote: cast.embeds.find((e) => e.cast)?.cast?.hash ?? null,
        channel: cast.channel?.id ?? null,
        parent: cast.parent_hash ?? null,
      },
      reveal_hash: null,
    })

    return await getPost(this.data.hash)
  }

  async promoteToFarcaster(cast: Cast) {
    const parentHash = cast.parent_hash
    const channelId = cast.channel?.id
    const embeds: string[] = []
    let quoteHash: string | undefined
    for (const embed of cast.embeds || []) {
      if (embed.url) {
        embeds.push(embed.url)
      } else if (embed.cast) {
        quoteHash = embed.cast.hash
      }
    }

    const response = await neynar.createCast({
      fid: this.metadata.fid,
      text: cast.text,
      embeds,
      quote: quoteHash,
      parent: parentHash,
      channel: channelId,
    })
    if (!response.success) {
      return
    }

    const post = await this.getOriginalPost(cast)

    await createPost({
      hash: response.cast.hash,
      fid: this.metadata.fid,
      data: post.data,
      reveal_hash: post.reveal_hash,
    })

    await createPostRelationship({
      post_hash: this.data.hash,
      target: 'farcaster',
      target_account: this.metadata.fid.toString(),
      target_id: response.cast.hash,
    })

    return response.cast.hash
  }

  async promoteToTwitter(cast: Cast) {
    if (cast.text.includes('@bankr') || !this.metadata.twitter) return

    let text = cast.text
    const usedUrls = new Set<string>()
    let quoteTweetId: string | undefined
    let replyToTweetId: string | undefined
    const images: string[] = []

    for (const embed of cast.embeds ?? []) {
      if (embed.url?.includes('x.com') || embed.url?.includes('twitter.com')) {
        const url = new URL(embed.url)
        const tweetId = url.pathname.split('/').pop()
        if (tweetId) {
          if (this.data.reply) {
            replyToTweetId = tweetId
          } else {
            quoteTweetId = tweetId
          }
        }
      } else if (embed.cast) {
        images.push(
          `https://client.warpcast.com/v2/cast-image?castHash=${embed.cast.hash}`
        )
      } else if (embed.url && embed.metadata?.content_type?.startsWith('image')) {
        images.push(embed.url)
      } else if (embed.url) {
        if (!usedUrls.has(embed.url)) {
          text += `\n\n${embed.url}`
          usedUrls.add(embed.url)
        }
      }
    }

    const mentions = text.match(/@[\w-]+(?:\.eth)?/g)
    if (mentions) {
      for (const mention of mentions) {
        try {
          const farcasterUser = await neynar.getUserByUsername(mention.slice(1))

          if (!farcasterUser.user) {
            continue
          }

          const connectedTwitter = farcasterUser.user.verified_accounts?.find(
            (va) => va.platform === 'x'
          )

          if (connectedTwitter) {
            text = text.replace(mention, `@${connectedTwitter.username}`)
          }
        } catch {
          continue
        }
      }
    }

    const response = await twitter.postTweet(this.metadata.twitter, {
      text,
      images,
      quoteTweetId,
      replyToTweetId,
    })

    if (!response.tweetId) return

    await createPostRelationship({
      post_hash: cast.hash,
      target: 'twitter',
      target_account: this.metadata.twitter,
      target_id: response.tweetId,
    })

    await createPostRelationship({
      post_hash: this.data.hash,
      target: 'twitter',
      target_account: this.metadata.twitter,
      target_id: response.tweetId,
    })

    return response.tweetId
  }

  async execute() {
    const cast = await neynar.getCast(this.data.hash)
    if (!cast) {
      return { success: false }
    }

    if (!this.isAbleToPromote(cast.cast)) {
      return { success: false }
    }

    const children = await getPostChildren([this.data.hash])

    const promoteToFarcaster =
      this.metadata.fid &&
      !children.some(
        (r) =>
          r.target === 'farcaster' && r.target_account === this.metadata.fid?.toString()
      )

    const promoteToTwitter =
      this.metadata.twitter &&
      !children.some(
        (r) => r.target === 'twitter' && r.target_account === this.metadata.twitter
      )

    let hash: string | undefined
    let tweetId: string | undefined

    if (promoteToFarcaster) {
      hash = await this.promoteToFarcaster(cast.cast)
      if (!hash) {
        return { success: false }
      }
    }

    if (promoteToTwitter) {
      tweetId = await this.promoteToTwitter(cast.cast)
    }

    return { success: true, hash, tweetId }
  }
}
