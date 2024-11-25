import { useBalance } from '@/lib/hooks/use-balance'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { CircleCheckIcon, ExternalLink } from 'lucide-react'
import { CircleXIcon } from 'lucide-react'
import { CircleMinusIcon } from 'lucide-react'
import { CreatePost } from '../create-post'
import { POST_AMOUNT, PROMOTE_AMOUNT, DELETE_AMOUNT } from '@/lib/utils'
import { useAccount } from 'wagmi'

export default function ActionComponent({
  variant = 'post',
  title,
  description,
  requirements,
}: {
  variant?: 'post' | 'launch'
  title?: string
  description?: string
  requirements?: Array<{ amount: number; label: string }>
}) {
  const { address } = useAccount()
  const { data, isLoading } = useBalance()

  const BALANCE = data ? data / BigInt(10 ** 18) : BigInt(0)
<<<<<<< HEAD:apps/anoncast/components/action/index.tsx
  const FARCASTER_POST = BigInt(POST_AMOUNT) / BigInt(10 ** 18)
  const TWITTER_PROMOTE = BigInt(PROMOTE_AMOUNT) / BigInt(10 ** 18)
  const DELETE_POST = BigInt(DELETE_AMOUNT) / BigInt(10 ** 18)

  // Default values for post variant
  const defaultTitle = 'Post anonymously to Farcaster and X/Twitter'
  const defaultDescription =
    "Posts are made anonymous using zk proofs. Due to the complex calculations required, it could take up to a few minutes. Do not post porn, doxes, shills, or threats. This is not about censorship resistance - it's about great anonymous posts."
  const defaultRequirements = [
    { amount: Number(FARCASTER_POST), label: 'Post to @rawanon' },
    {
      amount: Number(TWITTER_PROMOTE),
      label: 'Promote posts to @anoncast and X/Twitter',
    },
    { amount: Number(DELETE_POST), label: 'Delete posts' },
  ]

  const displayTitle = title || defaultTitle
  const displayDescription = description || defaultDescription
  const displayRequirements = requirements || defaultRequirements

  return (
    <Alert className="flex flex-col gap-4 bg-zinc-900 border border-zinc-700">
      <AlertTitle className="font-semibold text-xl">{displayTitle}</AlertTitle>
      <AlertDescription>
        <p className="text-zinc-400">{displayDescription}</p>
        <br />
        <p className="text-zinc-400">Holder requirements:</p>
        <ul className="flex flex-col gap-1 mt-3">
          {displayRequirements.map((req, index) => (
            <TokenRequirement
              key={index}
              tokenAmount={data}
              tokenNeeded={BigInt(req.amount)}
              string={req.label}
              isConnected={!!address && !isLoading}
            />
          ))}
        </ul>
      </AlertDescription>
      <div className="flex flex-row gap-2 justify-between ">
        <div className="flex flex-row gap-4">
          <a
            href="https://x.com/anoncast_"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm decoration-dotted underline font-medium"
          >
            <span className="hidden sm:inline">X/Twitter</span>
            <img src="/x.svg" alt="X/Twitter" className="w-4 h-4 sm:hidden invert" />
          </a>

          <a
            href="https://warpcast.com/anoncast"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm decoration-dotted underline font-medium"
          >
            <span className="hidden sm:inline">Farcaster</span>
            <img
              src="/farcaster.svg"
              alt="Farcaster"
              className="w-4 h-4 sm:hidden invert"
            />
          </a>
          <a
            href="https://github.com/Slokh/anoncast"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm decoration-dotted underline font-medium"
          >
            Github
          </a>
        </div>
        <div className="flex flex-row gap-4 justify-end">
          <a
            href="https://app.interface.social/token/8453/0x0db510e79909666d6dec7f5e49370838c16d950f"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm decoration-dotted underline font-medium"
          >
            <span className="hidden sm:inline">Interface</span>
            <img
              src="/farcaster.svg"
              alt="Farcaster"
              className="w-4 h-4 sm:hidden invert"
            />
          </a>
          <a
            href="https://dexscreener.com/base/0xc4ecaf115cbce3985748c58dccfc4722fef8247c"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm decoration-dotted underline font-medium"
          >
            DEX Screener
          </a>
          <a
            href="https://app.uniswap.org/swap?outputCurrency=0x0Db510e79909666d6dEc7f5e49370838c16D950f&chain=base"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm decoration-dotted underline font-medium"
          >
            Uniswap
          </a>
        </div>
      </div>
      {address && !isLoading ? (
        FARCASTER_POST > BALANCE ? (
          <a
            href={`https://app.uniswap.org/swap?exactAmount=5000&exactField=output&inputCurrency=ETH&outputCurrency=0x0db510e79909666d6dec7f5e49370838c16d950f&chain=base`}
            target="_blank"
            rel="noreferrer"
          >
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex flex-row items-center justify-between gap-2">
              <p className="font-bold flex flex-row items-center gap-2">
                {`You need 5000 $ANON to post. Click here to buy.`}
                <ExternalLink size={16} />
              </p>
            </div>
          </a>
        ) : (
          <CreatePost variant={variant} />
        )
      ) : (
        <></>
      )}
    </Alert>
=======
  const FARCASTER_POST = BigInt(TOKEN_CONFIG[ANON_ADDRESS].postAmount) / BigInt(10 ** 18)

  const DELETE_POST = BigInt(TOKEN_CONFIG[ANON_ADDRESS].deleteAmount) / BigInt(10 ** 18)

  return (
    <div className="rounded-2xl">
      <Alert className="flex flex-col px-6 py-8 gap-4 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-2xl border-none shadow-lg shadow-black-500/50">
        <AlertTitle className="font-semibold text-3xl">
          I heard a rumour... 👀<br /> Gossip on Farcaster!
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
  <div className="flex flex-row gap-2">
    <a
      href="https://x.com/Rumour_Cast"
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm button-secondary px-3 py-3 rounded-full font-medium"
    >
      <span className="hidden">X/Twitter</span>
      <img src="/x.svg" alt="X/Twitter" className="w-5 h-5 invert" />
    </a>

    <a
      href="https://warpcast.com/rumour"
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm button-secondary px-3 py-3 rounded-full font-medium"
    >
      <span className="hidden">Farcaster</span>
      <img
        src="/farcaster.svg"
        alt="Farcaster"
        className="w-5 h-5 invert"
      />
    </a>
  </div>

          <div className="flex flex-row gap-2 justify-end">
            <a
              href="https://dexscreener.com/base/0xe43e9d214a4bcb01c2fade45359bea37e74f314e"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm button-secondary px-3 py-3 rounded-full font-medium"
            >
              DEX
            </a>
            <a
              href="https://app.uniswap.org/swap?outputCurrency=0x1CEcCbE4d3a19cB62DbBd09756A52Cfe5394Fab8&chain=base"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm button-secondary px-3 py-3 rounded-full font-medium"
            >
              Uniswap
            </a>
            <a
              href="https://github.com/leovido/rumourcast"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm button-secondary px-3 py-3 rounded-full font-medium"
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
>>>>>>> 83222ce (feat: hello rumourcast):apps/next/components/action/index.tsx
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
        {!!oldTokenNeeded && (
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