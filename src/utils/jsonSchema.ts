import { z } from 'zod'

// Zod 4 ships a native JSON Schema converter. We target draft-07 to match
// Fastify's default Ajv dialect, used for route validation and Swagger docs.
// NOTE: `zod-to-json-schema` does not support Zod 4 — do not use it here.
export function toJsonSchema(schema: z.ZodType) {
  return z.toJSONSchema(schema, { target: 'draft-7' })
}
