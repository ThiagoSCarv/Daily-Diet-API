import { knex } from '../../db/knex'
import type { MealRow } from '../../types/knex'
import type { CreateMealData } from './interfaces/createMealData'

export const mealModel = {
  async create(data: CreateMealData): Promise<MealRow> {
    const [meal] = await knex('meals').insert(data).returning('*')
    if (!meal) throw new Error('Failed to create meal')
    return meal
  },

  async findAllByUserId(userId: string): Promise<MealRow[]> {
    return knex('meals').where({ user_id: userId }).orderBy('datetime', 'desc')
  },

  async findById(id: string): Promise<MealRow | undefined> {
    return knex('meals').where({ id }).first()
  },
}
