import { createMerkleRoot, getCredential } from '@anonworld/db'
import { createElysia } from '../utils'
import { t } from 'elysia'
import { redis } from '../services/redis'
import { simplehash } from '../services/simplehash'
import { LeanIMT } from '@zk-kit/lean-imt'
import { pad, zeroAddress } from 'viem'
import { buildHashFunction } from '@anonworld/zk'

const MAX_LEAVES = 2 ** 13

export const merkleTreeRoutes = createElysia({ prefix: '/merkle-tree' })
  .post(
    '/',
    async ({ body }) => {
      const cached = await redis.getMerkleTree(getMerkleTreeKey(body))
      if (cached) {
        return JSON.parse(cached)
      }

      const tree = await buildMerkleTree(body)
      return JSON.parse(tree.export())
    },
    {
      body: t.Object({
        chainId: t.Number(),
        tokenAddress: t.String(),
        minBalance: t.BigInt(),
      }),
    }
  )
  .get(
    '/:credentialId',
    async ({ params }) => {
      const cached = await redis.getMerkleTreeForCredential(params.credentialId)
      if (cached) {
        console.log('merkle-tree.ts /:credentialId using cached result')
        return JSON.parse(cached)
      }

      console.log('querying DB for credentialID', params.credentialId);
      const credential = await getCredential(params.credentialId)
      if (!credential) {
        throw new Error('Credential not found')
      }

      const { chainId, tokenAddress, minBalance } = credential.metadata as {
        chainId: number
        tokenAddress: string
        minBalance: string
      }

      const tree = await buildMerkleTree({
        chainId,
        tokenAddress,
        minBalance: BigInt(minBalance),
        credentialId: credential.id,
      })

      return tree
    },
    {
      params: t.Object({
        credentialId: t.String(),
      }),
    }
  )

export const buildMerkleTree = async (params: {
  chainId: number
  tokenAddress: string
  minBalance: bigint
  credentialId?: string
}) => {
  const owners = await simplehash.getTokenOwners(params)

  const leaves = owners.map((owner) => pad(owner)).slice(0, MAX_LEAVES)
  while (leaves.length < MAX_LEAVES) {
    leaves.push(pad(zeroAddress))
  }

  const hasher = await buildHashFunction()
  const tree = new LeanIMT(
    hasher,
    leaves.sort((a, b) => a.localeCompare(b))
  )

  const exportedTree = tree.export()

  await redis.setMerkleTree(getMerkleTreeKey(params), exportedTree)
  if (params.credentialId) {
    await redis.setMerkleTreeForCredential(params.credentialId, exportedTree)
  }

  await createMerkleRoot(params, tree.root)

  return JSON.parse(exportedTree)
}

const getMerkleTreeKey = (params: {
  chainId: number
  tokenAddress: string
  minBalance: bigint
}) => {
  return `merkle-tree:${params.chainId}:${params.tokenAddress}:${params.minBalance}`
}
