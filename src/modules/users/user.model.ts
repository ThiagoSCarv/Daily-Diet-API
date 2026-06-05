import { knex } from '../../db/knex'
import type { UserRow } from '../../types/knex'
import type { CreateUserData } from './interfaces/createUserData'

export const userModel = {
  async create(data: CreateUserData): Promise<UserRow> {
    const [user] = await knex('users').insert(data).returning('*')

    if (!user) {
      throw new Error('Failed to create user')
    }

    return user
  },

  async findByEmail(email: string): Promise<UserRow | undefined> {
    return knex('users').where({ email }).first()
  },

  async findBySessionId(sessionId: string): Promise<UserRow | undefined> {
    return knex('users').where({ session_id: sessionId }).first()
  },
}
