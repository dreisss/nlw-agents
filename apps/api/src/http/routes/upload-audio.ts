import { Elysia, t } from 'elysia'
import { db } from '@/db/connection'
import { audioChunks } from '@/db/schema/audio-chunks'
import { generateEmbeddings, transcribeAudio } from '@/services/gemini'

const paramsSchema = t.Object({
  roomId: t.String({ format: 'uuid' }),
})

const bodySchema = t.Object({
  file: t.File(),
})

const response201Schema = t.Object({
  chunkId: t.String({ format: 'uuid' }),
})

export const uploadAudio = new Elysia().post(
  '/:roomId/audio',
  async ({ params, body, status }) => {
    const { roomId } = params

    const audio = body.file

    const audioBuffer = Buffer.from(await audio.arrayBuffer())
    const audioAsBase64 = audioBuffer.toString('base64')

    const transcription = await transcribeAudio(
      audioAsBase64,
      'audio/webm;codec=opus'
    )
    const embeddings = await generateEmbeddings(transcription)

    const result = await db
      .insert(audioChunks)
      .values({
        roomId,
        transcription,
        embeddings,
      })
      .returning()

    const chunk = result[0]

    if (!chunk) {
      throw new Error('Erro ao salvar chunk de áudio')
    }

    return status(201, { chunkId: chunk.id })
  },
  {
    detail: {
      operationId: 'postUploadAudio',
    },
    params: paramsSchema,
    body: bodySchema,
    response: {
      201: response201Schema,
    },
  }
)
