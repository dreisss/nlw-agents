import { and, eq, sql } from 'drizzle-orm'
import { Elysia, t } from 'elysia'
import { db } from '@/db/connection'
import { audioChunks } from '@/db/schema/audio-chunks'
import { questions } from '@/db/schema/questions'
import { generateAnswer, generateEmbeddings } from '@/services/gemini'

const paramsSchema = t.Object({
  roomId: t.String({ format: 'uuid' }),
})

const bodySchema = t.Object({
  question: t.String(),
})

const responseSchema = t.Object({
  questionId: t.String({ format: 'uuid' }),
  answer: t.Nullable(t.String()),
})

export const createQuestion = new Elysia().post(
  '/:roomId/questions',
  async ({ params, body, status }) => {
    const { roomId } = params
    const { question } = body

    const embeddings = await generateEmbeddings(question)

    const embeddingsAsString = `[${embeddings.join(',')}]`

    const chunks = await db
      .select({
        id: audioChunks.id,
        transcription: audioChunks.transcription,
        similariry: sql<number>`1 - (${audioChunks.embeddings} <=> ${embeddingsAsString}::vector)`,
      })
      .from(audioChunks)
      .where(
        and(
          eq(audioChunks.roomId, roomId),
          sql`1 - (${audioChunks.embeddings} <=> ${embeddingsAsString}::vector) > 0.7`
        )
      )
      .orderBy(sql`${audioChunks.embeddings} <=> ${embeddingsAsString}::vector`)
      .limit(3)

    let answer =
      'Não foi possível gerar uma resposta com as informações disponíveis.'

    if (chunks.length > 0) {
      const transcriptions = chunks.map((chunk) => chunk.transcription)

      answer = await generateAnswer(question, transcriptions)
    }

    const result = await db
      .insert(questions)
      .values({
        question,
        roomId,
        answer,
      })
      .returning()

    const insertedQuestion = result[0]

    if (!insertedQuestion) {
      throw new Error('Failed to create new question.')
    }

    return status(201, { questionId: insertedQuestion.id, answer })
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
