import { Elysia } from 'elysia'
import { db } from '@/db/connection'
import { rooms } from '@/db/schema/rooms'

export const getRooms = new Elysia({ prefix: '/rooms' }).get('/', async () => {
  const results = await db
    .select({
      id: rooms.id,
      name: rooms.name,
    })
    .from(rooms)
    .orderBy(rooms.createdAt)

  return results
})
