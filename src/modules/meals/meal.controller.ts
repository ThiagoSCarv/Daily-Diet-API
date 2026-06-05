import type { RouteHandler } from 'fastify'
import type { MealRow } from '../../types/knex'
import type { CreateMealBody, MealParams, MealResponse, UpdateMealBody } from './meal.schema'
import { mealService } from './meal.service'

function serializeMeal(meal: MealRow): MealResponse {
  return {
    id: meal.id,
    user_id: meal.user_id,
    name: meal.name,
    description: meal.description,
    datetime: meal.datetime.toISOString(),
    is_on_diet: meal.is_on_diet,
    created_at: meal.created_at.toISOString(),
    updated_at: meal.updated_at.toISOString(),
  }
}

export const mealController = {
  create: (async (request, reply) => {
    const meal = await mealService.createMeal(request.user.id, request.body)
    return reply.status(201).send(serializeMeal(meal))
  }) satisfies RouteHandler<{ Body: CreateMealBody }>,

  list: (async (request, reply) => {
    const meals = await mealService.listMeals(request.user.id)
    return reply.send(meals.map(serializeMeal))
  }) satisfies RouteHandler,

  getOne: (async (request, reply) => {
    const meal = await mealService.getMeal(request.user.id, request.params.id)
    return reply.send(serializeMeal(meal))
  }) satisfies RouteHandler<{ Params: MealParams }>,

  update: (async (request, reply) => {
    const meal = await mealService.updateMeal(
      request.user.id,
      request.params.id,
      request.body,
    )
    return reply.send(serializeMeal(meal))
  }) satisfies RouteHandler<{ Params: MealParams; Body: UpdateMealBody }>,

  remove: (async (request, reply) => {
    await mealService.deleteMeal(request.user.id, request.params.id)
    return reply.status(204).send()
  }) satisfies RouteHandler<{ Params: MealParams }>,
}
