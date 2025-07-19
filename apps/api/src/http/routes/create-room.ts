import { Elysia, t } from 'elysia'
import { db } from '@/db/connection'
import { rooms } from '@/db/schema/rooms'

const bodySchema = t.Object({
  name: t.String({ minLength: 1 }),
  description: t.Optional(t.String({ minLength: 1 })),
})

const response201Schema = t.Object({
  roomId: t.String({ format: 'uuid' }),
})

export const createRoom = new Elysia().post(
  '/',
  async ({ body, status }) => {
    const { name, description } = body

    const result = await db
      .insert(rooms)
      .values({ name, description })
      .returning()

    const insertedRoom = result[0]

    if (!insertedRoom) {
      throw new Error('Failed to create new room.')
    }

    return status(201, { roomId: insertedRoom.id })
  },
  {
    body: bodySchema,
    response: {
      201: response201Schema,
    },
  }
)
