import { useEffect, useState } from 'react'
import { useAccount, useSignMessage } from 'wagmi'
import { hashMessage } from 'viem'
import { AnonWorldSDK } from '@anonworld/sdk'

const LOCAL_STORAGE_KEY = 'anon:credentials:v0'

export type Credential = {
  id: string
  proof: {
    proof: number[]
    publicInputs: string[]
  }
}

export function useCredentials(sdk: AnonWorldSDK) {
  const [isInitializing, setIsInitializing] = useState(true)
  const [credentials, setCredentials] = useState<Credential[]>([])
  const { signMessageAsync } = useSignMessage()
  const { address } = useAccount()

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (stored) {
      try {
        setCredentials(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse stored credentials:', e)
      }
    }
    setIsInitializing(false)
  }, [])

  useEffect(() => {
    if (isInitializing) return
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(credentials))
  }, [credentials])

  const add = async (credentialId: string) => {
    if (!address) return

    try {
      const signature = await signMessageAsync({ message: credentialId })
      const proof = await sdk.verifyCredential(credentialId, {
        address,
        signature,
        messageHash: hashMessage(credentialId),
      })

      const credential = {
        id: credentialId,
        proof: {
          proof: Array.from(proof.proof),
          publicInputs: proof.publicInputs,
        },
      }

      setCredentials((prev) => [...prev, credential])

      return credential
    } catch (e) {
      console.error('Failed to add credential:', e)
    }
  }

  const remove = (id: string) => {
    setCredentials((prev) => prev.filter((cred) => cred.id !== id))
  }

  const get = (id: string) => {
    return credentials.find((cred) => cred.id === id)
  }

  const list = () => {
    return credentials
  }

  return {
    list,
    add,
    remove,
    get,
  }
}
