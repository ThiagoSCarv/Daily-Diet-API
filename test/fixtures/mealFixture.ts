import type { CreateMealBody } from '../../src/modules/meals/meal.schema'

export function makeMeal(overrides: Partial<CreateMealBody> = {}): CreateMealBody {
  return {
    name: 'Frango grelhado',
    description: 'Peito de frango com legumes',
    datetime: '2026-06-05T12:00:00.000Z',
    is_on_diet: true,
    ...overrides,
  }
}
