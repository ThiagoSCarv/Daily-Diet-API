import type { MealRow } from '../../types/knex'
import { MealForbiddenError, MealNotFoundError } from '../../utils/errors'
import type { UpdateMealData } from './interfaces/updateMealData'
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
    const patch: UpdateMealData = {}
    if (input.name !== undefined) patch.name = input.name
    if (input.description !== undefined) patch.description = input.description
    if (input.datetime !== undefined) patch.datetime = new Date(input.datetime)
    if (input.is_on_diet !== undefined) patch.is_on_diet = input.is_on_diet

    return mealModel.update(id, patch)
  },

  async deleteMeal(userId: string, id: string): Promise<void> {
    const meal = await mealModel.findById(id)
    if (!meal) throw new MealNotFoundError()
    if (meal.user_id !== userId) throw new MealForbiddenError()
    await mealModel.deleteById(id)
  },
}
