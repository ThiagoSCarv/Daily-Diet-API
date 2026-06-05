import createError from '@fastify/error'

export const EmailAlreadyInUseError = createError(
  'EMAIL_ALREADY_IN_USE',
  'A user with this email already exists',
  409,
)
