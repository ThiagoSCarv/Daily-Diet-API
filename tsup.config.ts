import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/server.ts'],
  outDir: 'dist',
  format: ['cjs'],
  target: 'node22',
  platform: 'node',
  clean: true,
  sourcemap: true,
  minify: false,
  splitting: false,
  dts: false,
})
