import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts'],
    globalSetup: ['test/globalSetup.ts'],
    // Integration tests share a single test database, so run files
    // sequentially to avoid races on truncation/inserts.
    fileParallelism: false,
  },
})
