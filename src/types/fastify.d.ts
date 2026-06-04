import type { UserRow } from './knex'

// Extends Fastify's request with the authenticated user, populated by the
// `authenticate` preHandler on protected routes. Carries the full DB row;
// never serialize `session_id` into responses.
declare module 'fastify' {
  interface FastifyRequest {
    user: UserRow
  }
}
