'use client'

import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit'
import { Button } from './ui/button'
import { useBalance } from '@/lib/hooks/use-balance'
import { formatEther } from 'viem'

export const ConnectButton = () => {
  return (
    <RainbowConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading'
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated')
        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    onClick={openConnectModal}
                    className="font-bold text-md rounded-full hover:scale-105 transition-all duration-300 h-14"
                  >
                    Connect
                  </Button>
                )
              }
              if (chain.unsupported) {
                return (
                  <Button
                    onClick={openChainModal}
                    className="font-bold text-md rounded-full hover:scale-105 transition-all duration-300"
                  >
                    Switch Network
                  </Button>
                )
              }
              return (
                <button
                  type="button"
                  onClick={openAccountModal}
                  className="flex flex-row rounded-full overflow-hidden items-center hover:scale-105 transition-all duration-300 gradient-border-wrapper sm:space-x-2 space-x-1 h-14"
                >
                  <Balance />
                  <div
                    className="text-md font-bold text-primary rounded-full py-2 px-3 m-0.5 truncate"
                    style={{ maxWidth: '85px' }}
                  >
                    {account.displayName}
                  </div>
                </button>
              )
            })()}
          </div>
        )
      }}
    </RainbowConnectButton.Custom>
  )
}

function Balance() {
  const { data } = useBalance()

  const amount = Number.parseFloat(formatEther(data ?? BigInt(0)))

  return (
    <div className="flex items-center">
      <span className="text-md font-bold text-white md:inline hidden pl-3 pr-2">
        {`${formatNumber(amount)} RUMOUR`}
      </span>
      <span
        className="text-sm font-bold text-white md:hidden flex-shrink-0 pl-2 pr-2"
        style={{ maxWidth: '80px', whiteSpace: 'nowrap' }} // Increased maxWidth for visibility
      >
        {`${formatNumber(amount)} R..`}
      </span>
    </div>
  )
}

function formatNumber(num: number) {
  if (num >= 1e9) {
    return `${(num / 1e9).toFixed(2)}B` // Billion
  }
  if (num >= 1e6) {
    return `${(num / 1e6).toFixed(2)}M` // Million
  }
  if (num >= 1e3) {
    return `${(num / 1e3).toFixed(2)}K` // Thousand
  }
  return num.toFixed(2)
}
