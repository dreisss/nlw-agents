import { Elysia, t } from 'elysia'
import { db } from '@/db/connection'
import { questions } from '@/db/schema/questions'

const paramsSchema = t.Object({
  roomId: t.String({ format: 'uuid' }),
})

const bodySchema = t.Object({
  question: t.String(),
})

const responseSchema = t.Object({
  questionId: t.String({ format: 'uuid' }),
})

export const createQuestion = new Elysia().post(
  '/:roomId/questions',
  async ({ params, body, status }) => {
    const { roomId } = params
    const { question } = body

    const result = await db
      .insert(questions)
      .values({
        question,
        roomId,
      })
      .returning()

    const insertedQuestion = result[0]

    if (!insertedQuestion) {
      throw new Error('Failed to create new question.')
    }

    return status(201, { questionId: insertedQuestion.id })
  },
  {
    detail: {
      operationId: 'postRoomQuestion',
    },
    params: paramsSchema,
    body: bodySchema,
    response: {
      201: responseSchema,
    },
  }
)
