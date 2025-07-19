import { count, eq } from 'drizzle-orm'
import { Elysia, t } from 'elysia'
import { db } from '@/db/connection'
import { questions } from '@/db/schema/questions'
import { rooms } from '@/db/schema/rooms'

export const getRooms = new Elysia().get(
  '/',
  async () => {
    const results = await db
      .select({
        id: rooms.id,
        name: rooms.name,
        createdAt: rooms.createdAt,
        questionsCount: count(questions.id),
      })
      .from(rooms)
      .leftJoin(questions, eq(questions.roomId, rooms.id))
      .groupBy(rooms.id)
      .orderBy(rooms.createdAt)

    return results
  },
  {
    response: t.Array(
      t.Object({
        id: t.String({ format: 'uuid' }),
        name: t.String(),
        createdAt: t.Date(),
        questionsCount: t.Number(),
      })
    ),
  }
)
