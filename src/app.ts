import cookie from '@fastify/cookie'
import sensible from '@fastify/sensible'
import fastify from 'fastify'
import { env } from './config/env'
import swaggerPlugin from './plugins/swagger'

// App factory: registers plugins and (later) feature routes. Kept as a factory
// so tests can build isolated instances when needed.
export function buildApp() {
  const app = fastify({
    logger: env.NODE_ENV === 'test' ? false : { level: 'info' },
  })

  app.register(cookie)
  app.register(sensible)
  app.register(swaggerPlugin)

  // Feature routes are registered here as modules are implemented:
  // app.register(userRoutes)
  // app.register(mealRoutes)

  return app
}

// Default singleton instance used by the server entry point and integration tests.
export const app = buildApp()
