import path from 'node:path'
import { config as loadEnv } from 'dotenv'
import { z } from 'zod'

// Resolve the env file from the project root regardless of the current working
// directory — the Knex CLI chdir's into the knexfile's folder, so a plain
// relative path would not resolve. Tests use `.env.test`.
const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
loadEnv({ path: path.resolve(__dirname, '../..', envFile) })

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.url(),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Invalid environment variables:')
  console.error(z.flattenError(parsed.error).fieldErrors)
  throw new Error('Invalid environment variables')
}

export const env = parsed.data
