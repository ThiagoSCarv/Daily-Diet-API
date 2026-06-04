import type { Knex } from 'knex'

// Row shapes as stored in PostgreSQL (what a SELECT returns).
export interface UserRow {
  id: string
  name: string
  email: string
  session_id: string | null
  created_at: Date
  updated_at: Date
}

export interface MealRow {
  id: string
  user_id: string
  name: string
  description: string
  datetime: Date
  is_on_diet: boolean
  created_at: Date
  updated_at: Date
}

// Augments Knex so `knex('users')` / `knex('meals')` are fully typed.
// CompositeTableType<Base, Insert, Update> keeps DB-generated columns
// (id, created_at, updated_at) optional on insert and update.
declare module 'knex/types/tables' {
  interface Tables {
    users: Knex.CompositeTableType<
      UserRow,
      Pick<UserRow, 'name' | 'email'> & Partial<Pick<UserRow, 'session_id'>>,
      Partial<Omit<UserRow, 'id' | 'created_at'>>
    >
    meals: Knex.CompositeTableType<
      MealRow,
      Pick<
        MealRow,
        'user_id' | 'name' | 'description' | 'datetime' | 'is_on_diet'
      >,
      Partial<Omit<MealRow, 'id' | 'user_id' | 'created_at'>>
    >
  }
}
