import type { MealRow } from '../../types/knex'
import { mealModel } from './meal.model'
import type { CreateMealBody } from './meal.schema'

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
}
