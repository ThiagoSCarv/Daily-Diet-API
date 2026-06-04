import path from 'node:path'
import { type Knex, knex as setupKnex } from 'knex'
import { env } from '../config/env'

// Shared Knex configuration. Also consumed by the Knex CLI as the knexfile
// (see the `migrate` / `seed` scripts in package.json), which reads the
// default export below. Directories are resolved from this file's location so
// they work regardless of the CLI's working directory.
export const knexConfig: Knex.Config = {
  client: 'pg',
  connection: env.DATABASE_URL,
  migrations: {
    extension: 'ts',
    directory: path.join(__dirname, 'migrations'),
  },
  seeds: {
    extension: 'ts',
    directory: path.join(__dirname, 'seeds'),
  },
}

export const knex = setupKnex(knexConfig)

export default knexConfig
