import { z } from 'zod'

// Request body for creating a user. `.strict()` rejects unknown fields (400).
export const createUserBodySchema = z
  .object({
    name: z.string().min(1),
    email: z.email(),
  })
  .strict()

// Public user representation. Never includes `session_id`.
export const userResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  created_at: z.string(),
  updated_at: z.string(),
})

export type CreateUserInput = z.infer<typeof createUserBodySchema>
export type UserResponse = z.infer<typeof userResponseSchema>
