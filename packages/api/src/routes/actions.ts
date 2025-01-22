import { createElysia } from '../utils'
import { t } from 'elysia'
import { logActionExecution } from '@anonworld/db'
import { getAction } from '../actions'
import { redis } from '../services/redis'
import { hashMessage } from 'viem'

export const actionsRoutes = createElysia({ prefix: '/actions' }).post(
  '/submit',
  async ({ body }) => {
    const proofs = body.proofs.map((proof) => ({
      proof: new Uint8Array(proof.proof),
      publicInputs: proof.publicInputs,
    }))

    try {
      const action = await getAction(body.actionId, proofs, body.data)

      const response = await action.execute()

      await logActionExecution({
        action_id: body.actionId,
        action_data: body.data,
        status: 'SUCCESS',
        response,
      })

      await redis.markActionOccurred(
        body.actionId,
        hashMessage(JSON.stringify(body.data))
      )

      return response
    } catch (error) {
      await logActionExecution({
        action_id: body.actionId,
        action_data: body.data,
        status: 'FAILED',
        error: error,
      })
      throw error
    }
  },
  {
    body: t.Object({
      actionId: t.String(),
      data: t.Any(),
      proofs: t.Array(
        t.Object({
          proof: t.Array(t.Number()),
          publicInputs: t.Array(t.String()),
        })
      ),
    }),
  }
)
