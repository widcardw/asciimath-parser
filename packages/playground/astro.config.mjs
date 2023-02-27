import { defineConfig } from 'astro/config'
import solidJs from '@astrojs/solid-js'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'

// https://astro.build/config
export default defineConfig({
  integrations: [solidJs()],
  site: 'http://asciimath.widcard.win',
  markdown: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [rehypeKatex],
  },
})
