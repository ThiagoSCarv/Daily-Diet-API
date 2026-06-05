import { z } from 'zod'

export const createUserBodySchema = z
  .object({
    name: z.string().min(1),
    email: z.email(),
  })
  .strict()

export const userResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  created_at: z.string(),
  updated_at: z.string(),
})

export type CreateUserInput = z.infer<typeof createUserBodySchema>
export type UserResponse = z.infer<typeof userResponseSchema>
