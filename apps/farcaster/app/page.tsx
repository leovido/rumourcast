'use client'

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
