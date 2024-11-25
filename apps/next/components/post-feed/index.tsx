import { Cast } from '@/lib/types'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { api } from '@/lib/api'
import AnimatedTabs from './animated-tabs'
import { Skeleton } from '../ui/skeleton'
import { Post } from '../post'
import Link from 'next/link'

export default function PostFeed({
  tokenAddress,
  defaultTab = 'hot',
}: {
  tokenAddress: string
  defaultTab?: 'Fresh rumours' | 'hot'
}) {
  const [selected, setSelected] = useState<'Fresh rumours' | 'hot'>(defaultTab)

  const { data: trendingPosts, isLoading: isTrendingLoading } = useQuery({
    queryKey: ['hot', tokenAddress],
    queryFn: async (): Promise<Cast[]> => {
      const response = await api.getTrendingPosts(tokenAddress)
      return response?.casts || []
    },
  })

  const { data: newPosts, isLoading: isNewLoading } = useQuery({
    queryKey: ['Fresh rumours', tokenAddress],
    queryFn: async (): Promise<Cast[]> => {
      const response = await api.getNewPosts(tokenAddress)
      return response?.casts || []
    },
  })

  return (
    <div className="flex flex-col gap-4 ">
      <div className="flex flex-row justify-start">
        <AnimatedTabs
          tabs={['hot', 'Fresh rumours']}
          activeTab={selected}
          onTabChange={(tab) => setSelected(tab as 'Fresh rumours' | 'hot')}
        />
      </div>
      {selected === 'Fresh rumours' ? (
        isNewLoading ? (
          <SkeletonPosts />
        ) : newPosts?.length && newPosts?.length > 0 ? (
          <Posts casts={newPosts} tokenAddress={tokenAddress} />
        ) : (
          <h1>Something went wrong. Please refresh rumours the page.</h1>
        )
      ) : isTrendingLoading ? (
        <SkeletonPosts />
      ) : trendingPosts?.length && trendingPosts?.length > 0 ? (
        <Posts casts={trendingPosts} tokenAddress={tokenAddress} />
      ) : (
        <h1>Something went wrong. Please refresh rumours the page.</h1>
      )}
    </div>
  )
}

function SkeletonPosts() {
  return (
    <div className="flex flex-col gap-4">
      <SkeletonPost />
      <SkeletonPost />
      <SkeletonPost />
      <SkeletonPost />
    </div>
  )
}

function SkeletonPost() {
  return (
    <div className="rounded-2xl bg-zinc-950/90">
      <div className="relative [overflow-wrap:anywhere] bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl overflow-hidden">
        <div className="flex flex-col gap-4 border p-4 sm:p-6 rounded-2xl">
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>

          <Skeleton className="h-4 w-[100px]" />
        </div>
      </div>
    </div>
  )
}

function Posts({
  casts,
  tokenAddress,
}: {
  casts?: Cast[]
  tokenAddress: string
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl">
      {casts?.map((cast) => (
        <Link href={`/posts/${cast.hash}`} key={cast.hash}>
          <Post cast={cast} tokenAddress={tokenAddress} />
        </Link>
      ))}
    </div>
  )
}