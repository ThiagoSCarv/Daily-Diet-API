import cookie from '@fastify/cookie'
import sensible from '@fastify/sensible'
import fastify from 'fastify'
import { env } from './config/env'
import { mealRoutes } from './modules/meals/meal.routes'
import { userRoutes } from './modules/users/user.routes'
import swaggerPlugin from './plugins/swagger'

export function buildApp() {
  const app = fastify({
    logger: env.NODE_ENV === 'test' ? false : { level: 'info' },
    ajv: { customOptions: { removeAdditional: false } },
  })

  app.register(cookie)
  app.register(sensible)
  app.register(swaggerPlugin)

  app.register(userRoutes)
  app.register(mealRoutes)

  return app
}

export const app = buildApp()
