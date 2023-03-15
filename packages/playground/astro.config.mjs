import { defineConfig } from 'astro/config'
import solidJs from '@astrojs/solid-js'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

// https://astro.build/config
export default defineConfig({
  integrations: [solidJs()],
  site: 'http://asciimath.widcard.win/',
  markdown: {
    gfm: true,
    smartypants: true,
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      theme: 'nord',
    },
  },
})
