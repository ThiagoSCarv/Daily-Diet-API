import { execFileSync } from 'node:child_process'

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
