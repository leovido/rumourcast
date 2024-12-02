import { useBalance } from '@/hooks/use-balance'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { CircleCheckIcon } from 'lucide-react'
import { CircleXIcon } from 'lucide-react'
import { CircleMinusIcon } from 'lucide-react'
import { CreatePost } from '../create-post'
import { ANON_ADDRESS, TOKEN_CONFIG } from '@anon/utils/src/config'
import { useAccount } from 'wagmi'

export default function ActionComponent({
  tokenAddress,
}: {
  tokenAddress: string
}) {
  const { address } = useAccount()
  const { data, isLoading } = useBalance(tokenAddress)

  const BALANCE = data ? data / BigInt(10 ** 18) : BigInt(0)
  const FARCASTER_POST = BigInt(TOKEN_CONFIG[ANON_ADDRESS].postAmount) / BigInt(10 ** 18)

  const DELETE_POST = BigInt(TOKEN_CONFIG[ANON_ADDRESS].deleteAmount) / BigInt(10 ** 18)

  return (
    <div className="rounded-2xl">
      <Alert className="flex flex-col px-6 py-8 gap-4 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-2xl border-none shadow-lg shadow-black-500/50">
        <AlertTitle className="font-semibold text-3xl">
          Heard a rumour? 👀<br /> Share it!
        </AlertTitle>
        <AlertDescription>
          <p className="text-zinc-200">
            Rumours are made anonymous using zk proofs. Due to the complex calculations
            required, it could take up to a few minutes for your rumour to be posted.
            Do not post porn, doxes, shills, or threats. This is for sharing rumours - not enabling bad behaviour.
          </p>
          <br />
          <p className="text-zinc-200 ">Rumour posting requirements:</p>
          <ul className="flex flex-col gap-1 mt-3">
            <TokenRequirement
              tokenAmount={data}
              tokenNeeded={FARCASTER_POST}
              string="Post to Farcaster"
              isConnected={!!address && !isLoading}
            />
            <TokenRequirement
              tokenAmount={data}
              tokenNeeded={DELETE_POST}
              string="Delete rumours"
              isConnected={!!address && !isLoading}
            />
          </ul>
        </AlertDescription>
        <div className="flex flex-row gap-2 justify-between ">
          <div className="flex flex-row gap-4">

            <a
              href="https://warpcast.com/rumour"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm button-secondary px-3 py-2 rounded-full font-medium"
            >
              <span className="hidden sm:inline">Farcaster</span>
              <img
                src="/farcaster.svg"
                alt="Farcaster"
                className="w-4 h-4 sm:hidden invert"
              />
            </a>
          </div>

          <div className="flex flex-row gap-4 justify-end">
            <a
              href="https://dexscreener.com/base/0xe43e9d214a4bcb01c2fade45359bea37e74f314e"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm button-secondary px-4 py-2 rounded-full font-medium"
            >
              DEX
            </a>
            <a
              href="https://app.uniswap.org/swap?outputCurrency=0x1CEcCbE4d3a19cB62DbBd09756A52Cfe5394Fab8&chain=base"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm button-secondary px-4 py-2 rounded-full font-medium"
            >
              Uniswap
            </a>
            <a
              href="https://github.com/leovido/rumourcast"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm button-secondary px-4 py-2 rounded-full font-medium"
            >
              Github
            </a>
          </div>
        </div>
        {address && !isLoading ? (
          FARCASTER_POST > BALANCE ? (
            <a
              href={`https://app.uniswap.org/swap?outputCurrency=${tokenAddress}&chain=base`}
              target="_blank"
              rel="noreferrer"
            >
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex flex-row items-center justify-between gap-2">
                <p className="font-bold">{`Not enough tokens to post. Buy ${
                  FARCASTER_POST - BALANCE
                } more.`}</p>
              </div>
            </a>
          ) : (
            <CreatePost />
          )
        ) : (
          <></>
        )}
      </Alert>
    </div>
  )
}

function TokenRequirement({
  tokenAmount,
  tokenNeeded,
  oldTokenNeeded,
  string,
  isConnected,
}: {
  tokenAmount: bigint | undefined
  tokenNeeded: bigint
  oldTokenNeeded?: bigint
  string: string
  isConnected: boolean
}) {
  const tokenAmountInTokens = tokenAmount ? tokenAmount / BigInt(10 ** 18) : BigInt(0)

  return (
    <li className="flex flex-row items-center gap-2 font-medium text-xs sm:text-base">
      {isConnected ? (
        tokenAmountInTokens >= tokenNeeded ? (
          <CircleCheckIcon className="text-green-500 w-4 h-4" />
        ) : (
          <CircleXIcon className="text-red-500 w-4 h-4" />
        )
      ) : (
        <CircleMinusIcon className="text-gray-400 w-4 h-4" />
      )}
      <p>
        {oldTokenNeeded && (
          <>
            <span className="line-through text-zinc-500">{`${oldTokenNeeded.toLocaleString()}`}</span>
            <span>{'  '}</span>
          </>
        )}
        {`${tokenNeeded.toLocaleString()} $RUMOUR: ${string}`}
      </p>
    </li>
  )
}