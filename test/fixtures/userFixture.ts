import type { CreateUserInput } from '../../src/modules/users/user.schema'

export function makeUser(
  overrides: Partial<CreateUserInput> = {},
): CreateUserInput {
  return {
    name: 'John Doe',
    email: 'john@example.com',
    ...overrides,
  }
}
