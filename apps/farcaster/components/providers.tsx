'use client'

import { createConfig, http, WagmiProvider } from 'wagmi'
import { base } from 'wagmi/chains'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { frameConnector } from '@/lib/connector'
import { SDKProvider } from '@anonworld/react'

export const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
  connectors: [frameConnector()],
  ssr: true,
})

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      forcedTheme="dark"
      disableTransitionOnChange
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <SDKProvider apiUrl={process.env.NEXT_PUBLIC_API_URL}>{children}</SDKProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  )
}
