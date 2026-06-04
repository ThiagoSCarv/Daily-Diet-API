import cookie from '@fastify/cookie'
import sensible from '@fastify/sensible'
import fastify from 'fastify'
import { env } from './config/env'
import { userRoutes } from './modules/users/user.routes'
import swaggerPlugin from './plugins/swagger'

// App factory: registers plugins and (later) feature routes. Kept as a factory
// so tests can build isolated instances when needed.
export function buildApp() {
  const app = fastify({
    logger: env.NODE_ENV === 'test' ? false : { level: 'info' },
    // Reject unknown body fields (`.strict()` schemas -> 400) instead of
    // silently stripping them, which is Fastify's Ajv default.
    ajv: { customOptions: { removeAdditional: false } },
  })

  app.register(cookie)
  app.register(sensible)
  app.register(swaggerPlugin)

  // Feature routes:
  app.register(userRoutes)
  // app.register(mealRoutes)

  return app
}

// Default singleton instance used by the server entry point and integration tests.
export const app = buildApp()
