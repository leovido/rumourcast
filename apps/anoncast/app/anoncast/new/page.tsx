'use client'

import ActionComponent from '@/components/action'
import { PostFeed, PromotedFeed } from '@/components/post-feed'
import AnimatedTabs from '@/components/post-feed/animated-tabs'
import { CreatePostProvider, useCreatePost } from '@/components/create-post/context'

export default function Home() {
  return (
    <CreatePostProvider initialVariant="anoncast">
      <Inner />
    </CreatePostProvider>
  )
}

function Inner() {
  const { variant, setVariant } = useCreatePost()
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <ActionComponent variant="post" />
      </div>
      {variant === 'anoncast' && <PostFeed defaultTab="👀 Fresh rumours" />}
    </div>
  )
}
