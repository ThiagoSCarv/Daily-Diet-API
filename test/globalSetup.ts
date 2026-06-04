import { execFileSync } from 'node:child_process'

// Runs once before the whole test suite. Migrations are applied via the tsx
// Knex CLI (a child process) because Knex loads `.ts` migration files through
// Node's runtime loader, which Vitest's in-process transform does not cover.
// NODE_ENV=test makes the knexfile resolve `.env.test` (the test database).
export default function setup(): void {
  execFileSync(
    'node_modules/.bin/tsx',
    [
      'node_modules/knex/bin/cli.js',
      'migrate:latest',
      '--knexfile',
      'src/db/knex.ts',
    ],
    {
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'test' },
    },
  )
}
