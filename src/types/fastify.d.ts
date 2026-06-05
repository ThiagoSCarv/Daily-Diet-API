import type { UserRow } from './knex'

declare module 'fastify' {
  interface FastifyRequest {
    user: UserRow
  }
}
