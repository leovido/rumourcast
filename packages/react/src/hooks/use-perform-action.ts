import { useState } from 'react'
import { useSDK } from '../sdk'
import { useAccount } from 'wagmi'

export type PerformActionStatus =
  | {
      status: 'idle' | 'loading' | 'success'
    }
  | {
      status: 'error'
      error: string
    }

type CreatePostActionData = {
  text?: string
  embeds?: string[]
  quote?: string
  channel?: string
  parent?: string
  revealHash?: string
}

type DeletePostActionData = {
  hash: string
}

type PromotePostActionData = {
  hash: string
  reply?: boolean
}

type PerformActionData =
  | CreatePostActionData
  | DeletePostActionData
  | PromotePostActionData

export const usePerformAction = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (response: {
    success: boolean
    hash?: string
    tweetId?: string
  }) => void
  onError?: (error: string) => void
} = {}) => {
  const { sdk, credentials } = useSDK()
  const [status, setStatus] = useState<PerformActionStatus>({ status: 'idle' })
  const { address } = useAccount()

  const performAction = async (actionId: string, data: PerformActionData) => {
    try {
      if (!address) {
        throw new Error('Not connected')
      }

      setStatus({ status: 'loading' })

      const credentialId =
        actionId === '4de8ac8d-b90c-4926-98cd-123925736145'
          ? 'rumour-holder-10M'
          : 'delete-post'

      let credential = credentials.get(credentialId)
      if (!credential) {
        credential = await credentials.add(credentialId)
      }

      if (!credential) {
        throw new Error('No credential found')
      }

      const response = await sdk.submitAction({
        data,
        actionId,
        proofs: [credential.proof],
      })

      if (!response.data?.success) {
        throw new Error('Failed to perform action')
      }

      setStatus({ status: 'success' })
      onSuccess?.(response.data)
    } catch (e) {
      console.error('failed to perform action:', e)
      setStatus({ status: 'error', error: 'Failed to perform action' })
      onError?.('Failed to perform action')
    }
  }

  return {
    performAction,
    status,
  }
}
