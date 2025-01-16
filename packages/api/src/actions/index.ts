import { ProofData } from '@anonworld/zk'
import { merkleMembership } from '@anonworld/zk'
import { redis } from '../services/redis'
import { hashMessage } from 'viem'
import { getAction as getActionDb, validateMerkleRoots } from '@anonworld/db'
import { CreatePostAction } from './create-post'
import { DeletePostAction } from './delete-post'
import { PromotePostAction } from './promote-post'

export enum ActionType {
  CREATE_POST = 'CREATE_POST',
  DELETE_POST = 'DELETE_POST',
  PROMOTE_POST = 'PROMOTE_POST',
}

export const getAction = async (actionId: string, proofs: ProofData[], data: any) => {
  console.log('getAction called with:', { actionId, proofs, data })
  
  const roots = []
  for (const proof of proofs) {
    console.log('Verifying proof:', proof)
    const verified = await merkleMembership.verify(proof)
    console.log('Proof verification result:', verified)
    roots.push(proof.publicInputs[0])
  }

  const rootValidations = await validateMerkleRoots(roots)
  if (rootValidations.length === 0) {
    throw new Error('Invalid merkle tree root')
  }

  if (await redis.actionOccurred(actionId, hashMessage(JSON.stringify(data)))) {
    throw new Error('Action already occurred')
  }

  const action = await getActionDb(actionId)

  switch (action.type) {
    case ActionType.CREATE_POST: {
      return new CreatePostAction(action, { ...data, roots })
    }
    case ActionType.DELETE_POST: {
      return new DeletePostAction(action, { ...data, roots })
    }
    case ActionType.PROMOTE_POST: {
      return new PromotePostAction(action, { ...data, roots })
    }
  }

  throw new Error('Invalid action type')
}
