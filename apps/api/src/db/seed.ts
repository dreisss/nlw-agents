import { reset, seed } from 'drizzle-seed'
import { db, sql } from './connection'
import { schema } from './schema'

await reset(db, schema)

await seed(db, schema).refine((f) => ({
  rooms: {
    count: 20,
    columns: {
      name: f.companyName(),
      description: f.loremIpsum(),
    },
  },
}))

await sql.end()

console.info('Database seeded! 🌱')
