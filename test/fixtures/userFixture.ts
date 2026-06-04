import type { CreateUserInput } from '../../src/modules/users/user.schema'

// Minimal factory for the POST /users request body.
export function makeUser(
  overrides: Partial<CreateUserInput> = {},
): CreateUserInput {
  return {
    name: 'John Doe',
    email: 'john@example.com',
    ...overrides,
  }
}
