import { cors } from '@elysiajs/cors'
import { env } from '@repo/env'
import { Elysia } from 'elysia'
import { getRooms } from '@/http/routes/get-rooms'

const corsPlugin = cors({
  origin: `localhost:${env.WEB_PORT}`,
})

const healthRoute = new Elysia().get('/health', 'OK')

const api = new Elysia()
  .use(corsPlugin)
  .use(healthRoute)
  .use(getRooms)
  .listen(env.API_PORT)

console.info(
  `🦊 Elysia is running at ${api.server?.hostname}:${api.server?.port}`
)
