import { cors } from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'

import { env } from '@repo/env'
import { Elysia, t } from 'elysia'

import { getRooms } from '@/http/routes/get-rooms'

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

  .use(getRooms)
  .use(healthRoute)

  .listen(env.API_PORT)

console.info(
  `🦊 Elysia is running at ${api.server?.hostname}:${api.server?.port}`
)
