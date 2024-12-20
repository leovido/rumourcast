import type { ProofManager } from '@anonworld/zk'
import { toArray } from './utils'
import { Api } from './api'
import { getPublicKey } from './utils'
import { LeanIMT } from '@zk-kit/lean-imt'
import { pad } from 'viem'

export type Signature = {
  address: `0x${string}`
  signature: `0x${string}`
  messageHash: `0x${string}`
}

export class AnonWorldSDK extends Api {
  private merkleMembership!: ProofManager
  private hasher!: (a: string, b: string) => string

  constructor(apiUrl?: string) {
    super(apiUrl || 'http://localhost:3001')
  }

  async instantiate() {
    if (this.merkleMembership) return
    const { buildHashFunction, merkleMembership } = await import('@anonworld/zk')
    this.hasher = await buildHashFunction()
    this.merkleMembership = merkleMembership
  }

  async verifyCredential(credentialId: string, signature: Signature) {
    await this.instantiate()

    const response = await this.getMerkleTreeForCredential(credentialId)
    if (response.error) throw new Error(response.error.message)

    const tree = LeanIMT.import(
      this.hasher,
      JSON.stringify(response.data),
      (value) => value
    )

    const paddedAddress = pad(signature.address).toLowerCase()
    const leafIndex = tree.leaves.indexOf(paddedAddress)
    const { root, index, siblings } = tree.generateProof(leafIndex)
    const { pubKeyX, pubKeyY } = await getPublicKey(
      signature.signature,
      signature.messageHash
    )

    const input = {
      signature: toArray(signature.signature).slice(0, 64),
      message_hash: toArray(signature.messageHash),
      pub_key_x: pubKeyX,
      pub_key_y: pubKeyY,
      root,
      index,
      path: siblings,
    }

    return await this.merkleMembership.generate(input)
  }
}
