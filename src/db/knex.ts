import { type Knex, knex as setupKnex } from 'knex'
import { env } from '../config/env'

// Shared Knex configuration. Also consumed by the Knex CLI as the knexfile
// (see the `migrate` / `seed` scripts in package.json), which reads the
// default export below.
export const knexConfig: Knex.Config = {
  client: 'pg',
  connection: env.DATABASE_URL,
  migrations: {
    extension: 'ts',
    directory: './src/db/migrations',
  },
  seeds: {
    extension: 'ts',
    directory: './src/db/seeds',
  },
}

export const knex = setupKnex(knexConfig)

export default knexConfig
