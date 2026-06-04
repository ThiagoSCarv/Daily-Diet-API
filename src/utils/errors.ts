import createError from '@fastify/error'

// Domain errors defined with Fastify's `createError`. They carry a `statusCode`,
// so Fastify's error handler maps them to the right HTTP response automatically.
// Importing this (not FastifyRequest/Reply) keeps services free of HTTP plumbing.
export const EmailAlreadyInUseError = createError(
  'EMAIL_ALREADY_IN_USE',
  'A user with this email already exists',
  409,
)
