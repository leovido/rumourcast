import {
  Action,
  deletePost as deletePostDb,
  deletePostRelationship,
  getPostChildren,
} from '@anonworld/db'
import { neynar } from '../services/neynar'
import { twitter } from '../services/twitter'

export type DeletePostActionMetadata = {
  fid: number
  twitter?: string
}

export type DeletePostActionData = {
  hash: string
}

export class DeletePostAction {
  private metadata: DeletePostActionMetadata
  private data: DeletePostActionData

  constructor(action: Action, data: any) {
    this.metadata = action.metadata as DeletePostActionMetadata
    this.data = data
  }

  async execute() {
    const children = await getPostChildren([this.data.hash])
    for (const child of children) {
      if (child.target === 'farcaster') {
        if (this.metadata.fid === Number(child.target_account)) continue
        await neynar.deleteCast({
          fid: this.metadata.fid,
          hash: child.target_id,
        })
        await deletePostDb(child.target_id)
      } else if (child.target === 'twitter' && this.metadata.twitter) {
        await twitter.deleteTweet(this.metadata.twitter, child.target_id)
      } else {
        continue
      }

      await deletePostRelationship({
        post_hash: this.data.hash,
        target: child.target,
        target_account: child.target_account,
      })
    }

    return { success: true }
  }
}
