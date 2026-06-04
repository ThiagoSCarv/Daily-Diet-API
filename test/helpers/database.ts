import { knex } from '../../src/db/knex'

// Migrations are applied once in test/globalSetup.ts (via the tsx Knex CLI).

// Wipes all rows between tests. CASCADE handles the meals → users FK.
export async function cleanTestDatabase(): Promise<void> {
  await knex.raw('TRUNCATE TABLE meals, users RESTART IDENTITY CASCADE')
}

// Closes the connection pool when a suite finishes.
export async function destroyTestDatabase(): Promise<void> {
  await knex.destroy()
}
