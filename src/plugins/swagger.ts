import swagger from '@fastify/swagger'
import scalar from '@scalar/fastify-api-reference'
import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'

// Registered with `fastify-plugin` so the Swagger instance is NOT encapsulated
// and can collect the schemas of routes declared in the parent scope.
export default fp(async (app: FastifyInstance) => {
  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Daily Diet API',
        description: 'API for tracking meals and diet metrics',
        version: '1.0.0',
      },
    },
  })

  await app.register(scalar, {
    routePrefix: '/docs',
  })
})
