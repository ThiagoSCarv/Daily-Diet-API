import { knex } from '../../src/db/knex'

export async function cleanTestDatabase(): Promise<void> {
  await knex.raw('TRUNCATE TABLE meals, users RESTART IDENTITY CASCADE')
}

export async function destroyTestDatabase(): Promise<void> {
  await knex.destroy()
}
