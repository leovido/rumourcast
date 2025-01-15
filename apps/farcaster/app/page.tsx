'use client'
import type { Metadata } from 'next'
import ActionComponent from '@/components/action'
import { PostFeed, PromotedFeed } from '@/components/post-feed'
import { CreatePostProvider, useCreatePost } from '@/components/create-post/context'


export default function Home() {
  return (
    <CreatePostProvider>
      <Inner />
    </CreatePostProvider>
  )
}

export const metadata: Metadata = {
  title: 'anoncast',
  description: 'Post anonymously to Farcaster.',
  openGraph: {
    title: 'anoncast',
    description: 'Post anonymously to Farcaster.',
    images: ['/anon.png'],
  },
  other: {
    ['fc:frame']: JSON.stringify({
      version: 'next',
      imageUrl: 'https://anoncast.org/banner.png',
      button: {
        title: 'Post anonymously',
        action: {
          type: 'launch_frame',
          name: 'anoncast',
          url: 'https://rumourcast-frame.vercel.app/',
          splashImageUrl: 'https://anoncast.org/anon.png',
          splashBackgroundColor: '#151515',
        },
      },
    }),
  },
}

function Inner() {
  const { variant } = useCreatePost()
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <ActionComponent variant="post" />
      </div>
      {variant === 'anoncast' && <PostFeed />}
      {variant === 'anonfun' && <PromotedFeed />}
    </div>
  )
}

