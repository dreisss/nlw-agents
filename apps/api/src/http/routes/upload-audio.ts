import { Elysia, t } from 'elysia'
import { transcribeAudio } from '@/services/gemini'

const paramsSchema = t.Object({
  roomId: t.String({ format: 'uuid' }),
})

const bodySchema = t.File({
  type: 'audio',
})

const responseSchema = t.Object({
  questionId: t.String({ format: 'uuid' }),
})

export const uploadAudio = new Elysia().post(
  '/:roomId/audio',
  async ({ params, body }) => {
    const { roomId } = params
    const audio = body

    const audioBuffer = Buffer.from(await audio.arrayBuffer())
    const audioAsBase64 = audioBuffer.toBase64()

    const transcription = await transcribeAudio(audioAsBase64, audio.type)

    return transcription
  },
  {
    detail: {
      operationId: 'postUploadAudio',
    },
    params: paramsSchema,
    body: bodySchema,
    response: {
      201: responseSchema,
    },
  }
)
