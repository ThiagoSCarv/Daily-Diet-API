import type { FastifyInstance } from 'fastify'
import { authenticate } from '../../middlewares/authenticate'
import { toJsonSchema } from '../../utils/jsonSchema'
import { mealController } from './meal.controller'
import type { CreateMealBody } from './meal.schema'
import { createMealBodySchema, mealResponseSchema, mealsListResponseSchema } from './meal.schema'

export async function mealRoutes(app: FastifyInstance) {
  app.post<{ Body: CreateMealBody }>('/meals', {
    schema: {
      tags: ['Meals'],
      summary: 'Register a new meal',
      body: toJsonSchema(createMealBodySchema),
      response: {
        201: toJsonSchema(mealResponseSchema),
        400: { description: 'Validation error' },
        401: { description: 'Unauthorized' },
      },
    },
    preHandler: [authenticate],
    handler: mealController.create,
  })

  app.get('/meals', {
    schema: {
      tags: ['Meals'],
      summary: 'List all meals for the authenticated user',
      response: {
        200: toJsonSchema(mealsListResponseSchema),
        401: { description: 'Unauthorized' },
      },
    },
    preHandler: [authenticate],
    handler: mealController.list,
  })
}
