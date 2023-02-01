import { defineConfig } from 'tsup'

export default defineConfig({
  format: ['esm', 'cjs'],
  entry: [
    'cli.ts',
  ],
  clean: true,
})
