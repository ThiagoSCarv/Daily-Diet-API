import type { FastifyInstance } from 'fastify'
import { toJsonSchema } from '../../utils/jsonSchema'
import { userController } from './user.controller'
import type { CreateUserInput } from './user.schema'
import { createUserBodySchema, userResponseSchema } from './user.schema'

export async function userRoutes(app: FastifyInstance) {
  app.post<{ Body: CreateUserInput }>('/users', {
    schema: {
      tags: ['Users'],
      summary: 'Create a new user and set the session cookie',
      body: toJsonSchema(createUserBodySchema),
      response: {
        201: toJsonSchema(userResponseSchema),
        409: { description: 'Email already in use' },
      },
    },
    handler: userController.create,
  })
}
