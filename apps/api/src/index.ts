import { cors } from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'

import { env } from '@repo/env'
import { Elysia, t } from 'elysia'

import { createQuestion } from '@/http/routes/create-question'
import { createRoom } from '@/http/routes/create-room'
import { getRoomQuestions } from '@/http/routes/get-room-questions'
import { getRooms } from '@/http/routes/get-rooms'
import { uploadAudio } from '@/http/routes/upload-audio'

const corsPlugin = cors({
  origin: `http://localhost:${env.WEB_PORT}`,
})

const swaggerPlugin = swagger({
  path: 'docs',
})

const healthRoute = new Elysia().get('/health', 'OK', {
  response: t.Literal('OK'),
})

const api = new Elysia()
  .use(corsPlugin)
  .use(swaggerPlugin)

  .use(healthRoute)
  .group('/rooms', (rooms) =>
    rooms
      .use(getRooms)
      .use(createRoom)
      .use(getRoomQuestions)
      .use(createQuestion)
      .use(uploadAudio)
  )

  .listen(env.API_PORT)

console.info(
  `🦊 Elysia is running at ${api.server?.hostname}:${api.server?.port}`
)
