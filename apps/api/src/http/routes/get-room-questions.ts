import { desc, eq } from 'drizzle-orm'
import { Elysia, t } from 'elysia'
import { db } from '@/db/connection'
import { questions } from '@/db/schema/questions'

const paramsSchema = t.Object({
  roomId: t.String({ format: 'uuid' }),
})

const responseSchema = t.Array(
  t.Object({
    id: t.String({ format: 'uuid' }),
    question: t.String(),
    answer: t.Nullable(t.String()),
    createdAt: t.Date(),
  })
)

export const getRoomQuestions = new Elysia().get(
  '/:roomId/questions',
  async ({ params }) => {
    const { roomId } = params

    const result = await db
      .select({
        id: questions.id,
        question: questions.question,
        answer: questions.answer,
        createdAt: questions.createdAt,
      })
      .from(questions)
      .where(eq(questions.roomId, roomId))
      .orderBy(desc(questions.createdAt))

    return result
  },
  {
    detail: {
      operationId: 'getRoomQuestions',
    },
    params: paramsSchema,
    response: responseSchema,
  }
)
