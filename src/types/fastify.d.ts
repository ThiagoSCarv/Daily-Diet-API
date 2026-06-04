// Extends Fastify's request type with the authenticated user, populated by the
// `authenticate` preHandler on protected routes.
// TODO: replace the inline shape with the `User` type from modules/users once built.
declare module 'fastify' {
  interface FastifyRequest {
    user: {
      id: string
      name: string
      email: string
      session_id: string | null
      created_at: Date
      updated_at: Date
    }
  }
}

export {}
