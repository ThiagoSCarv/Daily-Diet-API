import cookie from '@fastify/cookie'
import sensible from '@fastify/sensible'
import fastify from 'fastify'
import { env } from './config/env'
import swaggerPlugin from './plugins/swagger'
import { registerRoutes } from './routes'

export function buildApp() {
  const app = fastify({
    logger: env.NODE_ENV === 'test' ? false : { level: 'info' },
    ajv: { customOptions: { removeAdditional: false } },
  })

  app.register(cookie)
  app.register(sensible)
  app.register(swaggerPlugin)

  registerRoutes(app)

  return app
}

export const app = buildApp()
