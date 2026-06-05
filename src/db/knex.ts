import path from 'node:path'
import { type Knex, knex as setupKnex } from 'knex'
import { env } from '../config/env'

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
