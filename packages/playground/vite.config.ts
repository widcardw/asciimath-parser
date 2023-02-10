import path from 'path'
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
  plugins: [
    solidPlugin(),
  ],
  build: {
    target: 'esnext',
  },
  resolve: {
    alias: {
      '@am': path.resolve(__dirname, '../core'),
      '~': path.resolve(__dirname, './src'),
    },
  },
})
