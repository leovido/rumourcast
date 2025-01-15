'use client'

import { Cast, Reveal } from '@anonworld/react'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useToast } from '@/lib/hooks/use-toast'
import { Heart, Loader2, MessageSquare, RefreshCcw } from 'lucide-react'
import { useState } from 'react'
import { useCreatePost } from '../create-post/context'
import { useAccount, useSignMessage } from 'wagmi'
import { Checkbox } from '../ui/checkbox'
import { useBalance } from '@/lib/hooks/use-balance'
import {
  DELETE_AMOUNT,
  PROMOTE_AMOUNT,
  LAUNCH_AMOUNT,
  LAUNCH_FID,
  DELETE_ACTION_ID,
  PROMOTE_ACTION_ID,
  LAUNCH_ACTION_ID,
} from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { hashMessage } from 'viem'
import { Input } from '../ui/input'
import { useQuery } from '@tanstack/react-query'
import { usePerformAction, useSDK } from '@anonworld/react'
import { ToastAction } from '@radix-ui/react-toast'

function formatNumber(num: number): string {
  if (num < 1000) return num.toString()
  const units = ['K', 'M', 'B', 'T']
  const unitIndex = Math.floor(Math.log10(num) / 3) - 1
  const unitValue = 1000 ** (unitIndex + 1)
  const formattedNumber = (num / unitValue).toFixed(1)
  return `${formattedNumber}${units[unitIndex]}`
}

export function Post({
  cast,
}: {
  cast: Cast
}) {
  const { variant } = useCreatePost()
  const { address } = useAccount()
  const { data: balance } = useBalance()
  const [reveal, setReveal] = useState(cast.reveal)

  const twitterSibling = cast.siblings.find((sibling) => sibling.target === 'twitter')
  const twitterChild = cast.children.find((child) => child.target === 'twitter')
  const tweetId = twitterSibling?.targetId || twitterChild?.targetId

  const launchChild = cast.children.find(
    (child) => child.target === 'farcaster' && Number(child.targetAccount) === LAUNCH_FID
  )
  const unableToPromoteRegex = [
    /.*@clanker.*launch.*/i,
    /.*dexscreener.com.*/i,
    /.*dextools.io.*/i,
    /.*0x[a-fA-F0-9]{40}.*/i,
    /(^|\s)\$(?!ANON\b)[a-zA-Z]+\b/i,
  ]

  const canDelete =
    address &&
    !!balance &&
    balance >= BigInt(DELETE_AMOUNT) &&
    (cast.parent || tweetId) &&
    cast.author.fid !== LAUNCH_FID

  const canPromote =
    address &&
    !!balance &&
    balance >= BigInt(PROMOTE_AMOUNT) &&
    !tweetId &&
    variant === 'anoncast' &&
    !unableToPromoteRegex.some((regex) => cast.text.match(regex)) &&
    !cast.embeds?.some((embed) =>
      unableToPromoteRegex.some((regex) => embed.url?.match(regex))
    )

  const canLaunch =
    cast.author.fid !== LAUNCH_FID &&
    address &&
    !!balance &&
    balance >= BigInt(LAUNCH_AMOUNT) &&
    !launchChild &&
    variant === 'anonfun' &&
    cast.text.match(/.*clanker.*launch.*/)

  const canReveal = address && !!cast.reveal && !cast.reveal?.phrase

  const { setParent, setQuote } = useCreatePost()
  const cleanText = (text: string) => {
    if (!text) return ''

    // Split text into characters and only normalize those that look suspicious
    return text
      .split('')
      .map((char) => {
        // Check if char is in a problematic Unicode range or looks unusual
        if (!/^[\x20-\x7E]$/.test(char)) {
          // Only normalize suspicious characters
          return char.normalize('NFKC')
        }
        return char
      })
      .join('')
  }

  const reply = () => {
    setParent(cast)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const quote = () => {
    setQuote(cast)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Usage in component
  const sanitizedText = cleanText(cast.text)

  return (
    <div className="relative [overflow-wrap:anywhere] border border-[#C848FF] rounded-2xl overflow-hidden">
      <div className="flex flex-row gap-4  p-4 sm:p-6  ">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-row gap-4 justify-between">
            <div className="flex flex-row items-center">
              <div className="flex flex-row items-center gap-2">
                <div className="text-sm font-medium text-zinc-400">
                  {timeAgo(cast.timestamp)}
                </div>
                {/* {cast.credentials.map((c) => (
                  <div
                    key={c.id}
                    className="text-xs font-medium border text-zinc-400 px-2 py-1 rounded-xl flex flex-row items-center gap-1"
                  >
                    <Coins size={12} />
                    {`${formatNumber(Number.parseFloat(formatEther(BigInt(c.metadata.minBalance))))}+ ${c.metadata.ticker}`}
                  </div>
                ))} */}
                {cast.parent_hash && (
                  <>
                    <div className="w-1 h-1 bg-zinc-400" />
                    <a
                      href={`https://warpcast.com/~/conversations/${cast.parent_hash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-zinc-400 flex flex-row items-center gap-2 underline decoration-dotted hover:text-zinc-300"
                    >
                      replying to a post
                    </a>
                  </>
                )}
              </div>
            </div>
            <div
              className=" flex flex-row gap-3 items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <a
                href={`https://warpcast.com/~/conversations/${cast.hash}`}
                target="_blank"
                rel="noreferrer"
              >
                <img src="/farcaster.svg" alt="Warpcast" className="w-4 h-4 invert" />
              </a>
              {tweetId && (
                <a
                  href={`https://x.com/i/status/${tweetId}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src="/x.svg" alt="Warpcast" className="w-4 h-4 invert" />
                </a>
              )}
            </div>
          </div>
          {reveal?.phrase && <RevealBadge reveal={reveal} />}
          <div className="font-normal whitespace-pre-wrap text-[#C848FF]">
            I heard a rumour...
          </div>
          <div className="font-semibold whitespace-pre-wrap">
            {sanitizedText.replace(/^I heard a rumour.*?\.{2,}(\s|$)/, '')}
          </div>
          {cast.embeds.map((embed) => {
            if (embed.metadata?.image) {
              return (
                <img
                  key={embed.url}
                  src={embed.url}
                  alt="embed"
                  className="rounded-2xl"
                />
              )
            }
            if (embed.metadata?.html) {
              return (
                <div
                  key={embed.url}
                  className="w-full border rounded-2xl overflow-hidden"
                >
                  {embed.metadata?.html?.ogImage &&
                    embed.metadata?.html?.ogImage.length > 0 && (
                      <img
                        src={embed.metadata?.html?.ogImage?.[0]?.url}
                        alt={embed.metadata?.html?.ogImage?.[0]?.alt}
                        className="object-cover aspect-video"
                      />
                    )}
                  <div className="p-2">
                    <h3 className="text-lg font-bold">{embed.metadata?.html?.ogTitle}</h3>
                    <p className="text-sm text-zinc-400">
                      {embed.metadata?.html?.ogDescription}
                    </p>
                  </div>
                </div>
              )
            }

            if (embed.cast) {
              return (
                <div
                  key={embed.cast.hash}
                  className="flex flex-row gap-4 border border-zinc-700 p-4 rounded-2xl"
                >
                  <img
                    src={embed.cast.author?.pfp_url}
                    className="w-10 h-10 rounded-full"
                    alt="pfp"
                  />
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex flex-row items-center gap-2">
                      <div className="text-md font-bold">
                        {embed.cast.author?.username}
                      </div>
                      <div className="text-sm font-semibold">
                        {timeAgo(embed.cast.timestamp)}
                      </div>
                    </div>
                    <div className="text-md">{embed.cast.text}</div>
                  </div>
                </div>
              )
            }

            return <div key={embed.url}>{embed.url}</div>
          })}
          <div className="flex flex-col gap-4 sm:flex-row justify-between">
            <div className="flex flex-row items-center gap-2 mt-2">
              <div className="flex flex-row items-center gap-1.5 ">
                <MessageSquare size={18} className="text-zinc-400" />
                <p className="text-sm font-medium">{formatNumber(cast.replies.count)}</p>
              </div>
              <div className="flex flex-row items-center gap-1.5 ">
                <RefreshCcw size={18} className="text-zinc-400" />
                <p className="text-sm font-medium ">
                  {formatNumber(cast.reactions.recasts_count)}
                </p>
              </div>
              <div className="flex flex-row items-center gap-1.5 w-16">
                <Heart size={18} className="text-zinc-400" />
                <p className="text-sm font-medium">
                  {formatNumber(cast.reactions.likes_count)}
                </p>
              </div>
            </div>

            <div
              className=" flex flex-row gap-3 items-center"
              onClick={(e) => e.preventDefault()}
            >
              {address && (
                <p
                  className="text-sm button-secondary rounded-full font-semibold cursor-pointer hover:text-zinc-400"
                  style={{
                    backgroundColor: 'rgba(124, 101, 193, 0.25)',
                    padding: '0.5rem 1rem',
                  }}
                  onClick={quote}
                >
                  Quote
                </p>
              )}
              {address && (
                <p
                  className="text-sm button-secondary rounded-full font-semibold cursor-pointer hover:text-zinc-400"
                  style={{
                    backgroundColor: 'rgba(124, 101, 193, 0.25)',
                    padding: '0.5rem 1rem',
                  }}
                  onClick={reply}
                >
                  Reply
                </p>
              )}
              {canReveal && <RevealButton cast={cast} onReveal={setReveal} />}
              {canPromote && <PromoteButton cast={cast} />}
              {canLaunch && <LaunchButton cast={cast} />}
              {(launchChild || cast.author.fid === LAUNCH_FID) && (
                <a
                  href={`https://warpcast.com/~/conversations/${cast.hash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm underline decoration-dotted font-semibold cursor-pointer hover:text-zinc-400"
                >
                  Launched
                </a>
              )}
              {canDelete && <DeleteButton cast={cast} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function timeAgo(timestamp: string): string {
  const now = new Date()
  const past = new Date(timestamp)
  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  const intervals = [
    { label: 'y', seconds: 31536000 },
    { label: 'mo', seconds: 2592000 },
    { label: 'd', seconds: 86400 },
    { label: 'h', seconds: 3600 },
    { label: 'm', seconds: 60 },
    { label: 's', seconds: 1 },
  ]

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds)
    if (count >= 1) {
      return `${count}${interval.label} ago`
    }
  }

  return 'just now'
}

function DeleteButton({ cast }: { cast: Cast }) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const { performAction, status } = usePerformAction({
    onSuccess: () => {
      toast({
        title: 'Post deleted',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Failed to delete',
        description: error,
      })
    },
  })

  const handleDelete = async () => {
    await performAction(DELETE_ACTION_ID, {
      hash: cast.hash,
    })
    setOpen(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <p className="text-sm text-red-500 underline decoration-dotted font-semibold cursor-pointer hover:text-red-400">
          Delete
        </p>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the post.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={!['idle', 'success', 'error'].includes(status.status)}
          >
            {status.status === 'loading' ? (
              <div className="flex flex-row items-center gap-2">
                <Loader2 className="animate-spin" />
                <p>Generating proof</p>
              </div>
            ) : (
              'Delete'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function PromoteButton({ cast }: { cast: Cast }) {
  const [open, setOpen] = useState(false)
  const [asReply, setAsReply] = useState(false)
  const { toast } = useToast()
  const { performAction, status } = usePerformAction({
    onSuccess: (response) => {
      toast({
        title: 'Post promoted',
        action: (
          <ToastAction
            altText="View post"
            onClick={() => {
              window.open(`https://x.com/i/status/${response.tweetId}`, '_blank')
            }}
          >
            View on X
          </ToastAction>
        ),
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Failed to promote',
        description: error,
      })
    },
  })

  const handlePromote = async () => {
    await performAction(PROMOTE_ACTION_ID, {
      hash: cast.hash,
      reply: asReply,
    })
    setOpen(false)
  }

  const twitterEmbed = cast.embeds?.find(
    (e) => e.url?.includes('x.com') || e.url?.includes('twitter.com')
  )

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <p className="text-sm underline decoration-dotted font-semibold cursor-pointer hover:text-zinc-400">
          Promote
        </p>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Promote to X/Twitter?</AlertDialogTitle>
          <AlertDialogDescription>
            You will need to delete the post if you want to remove it from X/Twitter.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {twitterEmbed && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="as-reply"
              checked={asReply}
              onCheckedChange={(checked) => setAsReply(checked as boolean)}
            />
            <label
              htmlFor="as-reply"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Promote as reply
            </label>
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            onClick={handlePromote}
            disabled={!['idle', 'success', 'error'].includes(status.status)}
          >
            {status.status === 'loading' ? (
              <div className="flex flex-row items-center gap-2">
                <Loader2 className="animate-spin" />
                <p>Generating proof</p>
              </div>
            ) : (
              'Promote'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function LaunchButton({ cast }: { cast: Cast }) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const { performAction, status } = usePerformAction({
    onSuccess: (response) => {
      toast({
        title: 'Post launched',
        action: (
          <ToastAction
            altText="View post"
            onClick={() => {
              window.open(
                `https://warpcast.com/~/conversations/${response.hash}`,
                '_blank'
              )
            }}
          >
            View on Warpcast
          </ToastAction>
        ),
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Failed to launch',
        description: error,
      })
    },
  })

  const handleLaunch = async () => {
    await performAction(LAUNCH_ACTION_ID, {
      hash: cast.hash,
    })
    setOpen(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <p className="text-sm text-green-500 underline decoration-dotted font-semibold cursor-pointer hover:text-green-400">
          Launch
        </p>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Launch token</AlertDialogTitle>
          <AlertDialogDescription>
            This will launch the token to @anonfun via @clanker.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            onClick={handleLaunch}
            disabled={!['idle', 'success', 'error'].includes(status.status)}
          >
            {status.status === 'loading' ? (
              <div className="flex flex-row items-center gap-2">
                <Loader2 className="animate-spin" />
                <p>Generating proof</p>
              </div>
            ) : (
              'Launch'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function RevealButton({
  cast,
  onReveal,
}: { cast: Cast; onReveal: (reveal: Reveal) => void }) {
  const { sdk } = useSDK()
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const [value, setValue] = useState('')
  const [isRevealing, setIsRevealing] = useState(false)
  const { signMessageAsync } = useSignMessage()
  const { address } = useAccount()
  const router = useRouter()

  const handleReveal = async () => {
    if (!cast.reveal || !address) return
    setIsRevealing(true)
    try {
      const inputHash = hashMessage(cast.reveal.input + value)
      if (inputHash !== cast.reveal.revealHash) {
        toast({
          title: 'Incorrect phrase',
        })
      } else {
        const message = JSON.stringify({
          revealHash: cast.reveal.revealHash,
          revealPhrase: value,
        })
        const signature = await signMessageAsync({
          message,
        })
        await sdk.revealPost({
          hash: cast.hash,
          message,
          phrase: value,
          signature,
          address,
        })
        onReveal({
          ...cast.reveal,
          phrase: value,
          signature,
          address,
          revealedAt: new Date().toISOString(),
        })
        router.push(`/posts/${cast.hash}`)
      }
    } catch {
      setIsRevealing(false)
      return
    }
    setIsRevealing(false)
    setOpen(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <p className="text-sm underline decoration-dotted font-semibold cursor-pointer hover:text-zinc-400">
          Reveal
        </p>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reveal your post</AlertDialogTitle>
          <AlertDialogDescription>
            Claim this post by revealing the phrase you chose when you created it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Input
          placeholder="Enter phrase"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={handleReveal} disabled={isRevealing}>
            {isRevealing ? (
              <div className="flex flex-row items-center gap-2">
                <Loader2 className="animate-spin" />
                <p>Revealing</p>
              </div>
            ) : (
              <p>Reveal</p>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function RevealBadge({ reveal }: { reveal: Reveal }) {
  const { sdk } = useSDK()
  const { data } = useQuery({
    queryKey: ['identity', reveal.address],
    queryFn: () => sdk.getFarcasterIdentity(reveal.address!),
  })

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="flex flex-row items-center w-full">
      {data?.data?.username && (
        <a
          href={`https://warpcast.com/${data.data.username}`}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-semibold cursor-pointer hover:text-zinc-400 flex flex-row items-center gap-1 text-green-400 hover:text-green-200"
        >
          <span>{`revealed as `}</span>
          <img src={data.data.pfp_url} className="w-4 h-4 rounded-full" alt="pfp" />
          <span>{data.data.username}</span>
          <span>{` ${timeAgo(reveal.revealedAt!)}`}</span>
        </a>
      )}
      {!data?.data?.username && (
        <a
          href={`https://basescan.org/address/${reveal.address}`}
          target="_blank"
          rel="noreferrer"
        >
          <span className="text-sm font-semibold cursor-pointer hover:text-zinc-400 text-green-400 hover:text-green-200">
            {`revealed as ${formatAddress(reveal.address!)} ${timeAgo(
              reveal.revealedAt!
            )}`}
          </span>
        </a>
      )}
    </div>
  )
}
