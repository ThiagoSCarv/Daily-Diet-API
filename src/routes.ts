import type { FastifyInstance } from 'fastify'
import { mealRoutes } from './modules/meals/meal.routes'
import { userRoutes } from './modules/users/user.routes'

export async function registerRoutes(app: FastifyInstance) {
  app.register(userRoutes)
  app.register(mealRoutes)
}
