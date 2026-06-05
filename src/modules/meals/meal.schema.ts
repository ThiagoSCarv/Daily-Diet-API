import { z } from 'zod'

export const createMealBodySchema = z
  .object({
    name: z.string().min(1),
    description: z.string().min(1),
    datetime: z.string().datetime(),
    is_on_diet: z.boolean(),
  })
  .strict()

export const updateMealBodySchema = createMealBodySchema.partial().strict()

export const mealParamsSchema = z.object({
  id: z.string().uuid(),
})

export const mealResponseSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  datetime: z.string(),
  is_on_diet: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
})

export const mealsListResponseSchema = z.array(mealResponseSchema)

export const metricsResponseSchema = z.object({
  total: z.number().int().nonnegative(),
  on_diet: z.number().int().nonnegative(),
  off_diet: z.number().int().nonnegative(),
  best_streak: z.number().int().nonnegative(),
})

export type CreateMealBody = z.infer<typeof createMealBodySchema>
export type UpdateMealBody = z.infer<typeof updateMealBodySchema>
export type MealParams = z.infer<typeof mealParamsSchema>
export type MealResponse = z.infer<typeof mealResponseSchema>
export type MetricsResponse = z.infer<typeof metricsResponseSchema>
