'use client'

import { useBalance } from '@/lib/hooks/use-balance'
import { formatEther } from 'viem'
import { useEffect, useState } from 'react'
import sdk, { FrameContext } from '@farcaster/frame-sdk'

export const ConnectButton = () => {
  const [context, setContext] = useState<FrameContext>()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const load = async () => {
      setContext(await sdk.context)
      sdk.actions.ready()
    }
    if (sdk && !isLoaded) {
      setIsLoaded(true)
      load()
    }
  }, [isLoaded])

  return (
    <div className="flex flex-row rounded-md overflow-hidden bg-white items-center hover:scale-105 transition-all duration-300 cursor-pointer">
      <Balance />
      <div className="text-md font-bold bg-gray-200 text-black rounded-md py-1.5 px-3 m-0.5">
        {context?.user?.username}
      </div>
    </div>
  )
}

function Balance() {
  const { data } = useBalance()

  const amount = Number.parseFloat(formatEther(data ?? BigInt(0)))

  return (
    <div className="text-md font-bold bg-white text-black pl-3 pr-2">
      {`${formatNumber(amount)} ANON`}
    </div>
  )
}

function formatNumber(num: number) {
  if (num >= 1e9) {
    return `${(num / 1e9).toFixed(2)}B`
  }
  if (num >= 1e6) {
    return `${(num / 1e6).toFixed(2)}M`
  }
  if (num >= 1e3) {
    return `${(num / 1e3).toFixed(2)}K`
  }
  return num.toFixed(2)
}
