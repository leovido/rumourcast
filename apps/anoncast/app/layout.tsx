import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/toaster'
import { GeistSans } from 'geist/font/sans'
import { ConnectButton } from '@/components/connect-button'
import { Logo } from '@/components/logo'
import BackToTopButton from '@/components/ui/back-to-top-button'

export const metadata: Metadata = {
  title: 'Rumourcast',
  description: 'Spread rumours anonymously to Farcaster.',
  openGraph: {
    title: 'Rumourcast',
    description: 'Spread rumours anonymously to Farcaster.',
    images: ['/rumour.webp'],
  },
  other: {
    ['fc:frame']: JSON.stringify({
      version: 'next',
      imageUrl: 'https://anoncast.org/banner.png',
      button: {
        title: 'Post anonymously',
        action: {
          type: 'launch_frame',
          name: 'RumourCast',
          url: 'https://frame.anoncast.org',
          splashImageUrl: 'https://anoncast.org/anon.png',
          splashBackgroundColor: '#151515',
        },
      },
    }),
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${GeistSans.className} antialiased min-h-screen w-full`}>
        <Providers>
          <div className="flex h-screen flex-col p-4 xl:p-8 xl:pt-16 max-w-screen-sm mx-auto gap-8">
            <div className="flex items-center justify-between xl:absolute xl:top-0 xl:left-0 xl:right-0 xl:p-8 xl:pt-16 xl:max-w-screen-xl xl:mx-auto">
              <Logo />
              <ConnectButton />
            </div>
            <div className="z-10">{children}</div>
          </div>
        </Providers>
        <Toaster />
        <BackToTopButton />
      </body>
    </html>
  )
}
