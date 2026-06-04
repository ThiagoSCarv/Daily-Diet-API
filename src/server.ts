import { app } from './app'
import { env } from './config/env'

app
  .listen({ port: env.PORT, host: '0.0.0.0' })
  .then(() => {
    app.log.info(`HTTP server running on http://localhost:${env.PORT}`)
    app.log.info(`API docs available at http://localhost:${env.PORT}/docs`)
  })
  .catch((err) => {
    app.log.error(err)
    process.exit(1)
  })
