import createError from '@fastify/error'

export const EmailAlreadyInUseError = createError(
  'EMAIL_ALREADY_IN_USE',
  'A user with this email already exists',
  409,
)

export const MealNotFoundError = createError(
  'MEAL_NOT_FOUND',
  'Meal not found',
  404,
)

export const MealForbiddenError = createError(
  'MEAL_FORBIDDEN',
  'You do not have access to this meal',
  403,
)
