import createError from '@fastify/error'

export const MealNotFoundError = createError('MEAL_NOT_FOUND', 'Meal not found', 404)

export const MealForbiddenError = createError(
  'MEAL_FORBIDDEN',
  'You do not have access to this meal',
  403,
)
