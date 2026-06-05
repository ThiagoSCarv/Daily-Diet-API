import type { MealRow } from '../../types/knex'
import { MealForbiddenError, MealNotFoundError } from '../../utils/errors'
import { mealModel } from './meal.model'
import type { CreateMealBody, UpdateMealBody } from './meal.schema'

export const mealService = {
  async createMeal(userId: string, input: CreateMealBody): Promise<MealRow> {
    return mealModel.create({
      user_id: userId,
      name: input.name,
      description: input.description,
      datetime: new Date(input.datetime),
      is_on_diet: input.is_on_diet,
    })
  },

  async listMeals(userId: string): Promise<MealRow[]> {
    return mealModel.findAllByUserId(userId)
  },

  async getMeal(userId: string, id: string): Promise<MealRow> {
    const meal = await mealModel.findById(id)
    if (!meal) throw new MealNotFoundError()
    if (meal.user_id !== userId) throw new MealForbiddenError()
    return meal
  },

  async updateMeal(userId: string, id: string, input: UpdateMealBody): Promise<MealRow> {
    const meal = await mealModel.findById(id)
    if (!meal) throw new MealNotFoundError()
    if (meal.user_id !== userId) throw new MealForbiddenError()
    return mealModel.update(id, {
      name: input.name,
      description: input.description,
      datetime: input.datetime ? new Date(input.datetime) : undefined,
      is_on_diet: input.is_on_diet,
    })
  },
}
