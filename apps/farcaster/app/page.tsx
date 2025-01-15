'use client'

import ActionComponent from '@/components/action'
import { ConnectButton } from '@/components/connect-button'
import { Logo } from '@/components/logo'
import { CreatePostProvider } from '@/components/create-post/context'
import { useEffect, useState } from 'react'
import { sdk } from '@farcaster/frame-sdk'

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const load = async () => {
      await sdk.actions.ready()
      setIsLoaded(true)
    }
    if (sdk && !isLoaded) {
      load()
    }
  }, [isLoaded])

  return (
    <div className="flex flex-col items-center justify-center grow min-h-screen">
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        {' '}
        <Content />
      </div>
    </div>
  )
}

function Content() {
  return (
    <CreatePostProvider>
      <div className="flex h-screen flex-col p-4 xl:p-8 max-w-screen-sm mx-auto gap-4">
        <div className="flex items-center justify-between xl:absolute xl:top-0 xl:left-0 xl:right-0 xl:p-8 xl:max-w-screen-xl xl:mx-auto">
          <Logo />
          <ConnectButton />
        </div>
        <div className="z-10 pb-8">
          <ActionComponent variant="post" />
        </div>
      </div>
    </CreatePostProvider>
  )
}
