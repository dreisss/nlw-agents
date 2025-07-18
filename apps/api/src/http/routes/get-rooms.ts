import { Elysia, t } from 'elysia'
import { db } from '@/db/connection'
import { rooms } from '@/db/schema/rooms'

export const getRooms = new Elysia({ prefix: '/rooms' }).get(
  '/',
  async () => {
    const results = await db
      .select({
        id: rooms.id,
        name: rooms.name,
      })
      .from(rooms)
      .orderBy(rooms.createdAt)

    return results
  },
  {
    response: t.Array(
      t.Object({
        id: t.String({ format: 'uuid' }),
        name: t.String(),
      })
    ),
  }
)
