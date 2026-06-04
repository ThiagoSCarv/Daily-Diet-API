import { randomUUID } from 'node:crypto'
import type { UserRow } from '../../types/knex'
import { EmailAlreadyInUseError } from '../../utils/errors'
import { userModel } from './user.model'
import type { CreateUserInput } from './user.schema'

// Business logic for users. Depends on the model contract, never on Knex or
// Fastify directly.
export const userService = {
  async createUser(input: CreateUserInput): Promise<UserRow> {
    const existingUser = await userModel.findByEmail(input.email)

    if (existingUser) {
      throw new EmailAlreadyInUseError()
    }

    return userModel.create({
      name: input.name,
      email: input.email,
      session_id: randomUUID(),
    })
  },
}
