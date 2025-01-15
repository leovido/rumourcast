import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/toaster'
import { GeistSans } from 'geist/font/sans'
import { ConnectButton } from '@/components/connect-button'
import { Logo } from '@/components/logo'
import BackToTopButton from '@/components/ui/back-to-top-button'
import HamburgerMenuButton from '@/components/ui/hamburger-menu-button'


export const metadata: Metadata = {
  title: "Yoink!",
  description: "Click to yoink the flag.",
};


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
      <body
        className={`${GeistSans.className} antialiased min-h-screen w-full overflow-x-hidden`}
      >
        <Providers>
          {/* Fixed Header */}
          <header className="sticky top-0 z-50 backdrop-blur-md w-full px-4 xl:px-8 py-4">
            <div className="flex items-center justify-between">
              <Logo />
              <div className="flex items-center gap-4">
                <ConnectButton />
                <HamburgerMenuButton />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex flex-col min-h-screen max-w-screen-sm mx-auto p-4 xl:p-8 gap-8">
            <main className="flex-1 w-full">{children}</main>
          </div>
        </Providers>
        <Toaster />
        <BackToTopButton />
      </body>
    </html>
  )
}
