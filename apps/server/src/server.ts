import { env } from '@repo/env'
import { Elysia } from 'elysia'

const health = new Elysia().get('/health', 'OK')

const app = new Elysia().use(health).listen(env.API_PORT)

console.info(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
