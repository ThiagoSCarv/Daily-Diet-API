import type { FastifyInstance } from 'fastify'
import { authenticate } from '../../middlewares/authenticate'
import { toJsonSchema } from '../../utils/jsonSchema'
import { mealController } from './meal.controller'
import type { CreateMealBody, MealParams, UpdateMealBody } from './meal.schema'
import { createMealBodySchema, mealParamsSchema, mealResponseSchema, mealsListResponseSchema, updateMealBodySchema } from './meal.schema'

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

  app.get<{ Params: MealParams }>('/meals/:id', {
    schema: {
      tags: ['Meals'],
      summary: 'Get a single meal by ID',
      params: toJsonSchema(mealParamsSchema),
      response: {
        200: toJsonSchema(mealResponseSchema),
        401: { description: 'Unauthorized' },
        403: { description: 'Forbidden' },
        404: { description: 'Not found' },
      },
    },
    preHandler: [authenticate],
    handler: mealController.getOne,
  })

  app.put<{ Params: MealParams; Body: UpdateMealBody }>('/meals/:id', {
    schema: {
      tags: ['Meals'],
      summary: 'Edit an existing meal',
      params: toJsonSchema(mealParamsSchema),
      body: toJsonSchema(updateMealBodySchema),
      response: {
        200: toJsonSchema(mealResponseSchema),
        400: { description: 'Validation error' },
        401: { description: 'Unauthorized' },
        403: { description: 'Forbidden' },
        404: { description: 'Not found' },
      },
    },
    preHandler: [authenticate],
    handler: mealController.update,
  })
}
