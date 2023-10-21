import fs from 'fs/promises'
import type { Completion } from '@codemirror/autocomplete'
import katex from 'katex'
import type { SymbolValueType } from '../../../core/src/symbols'
import { SYMBOLMAP, TokenTypes } from '../../../core/src/symbols'

function buildCompletionsFromSymbols() {
  const completions: Completion[] = []
  for (const [key, value] of SYMBOLMAP.entries()) {
    if (key.length === 1)
      continue
    let tex = (value as SymbolValueType).tex
    if ((value as SymbolValueType).type === TokenTypes.Text) {
      tex = tex.replace(/^(\\quad)?(.+?)(\\quad)?$/, (_match, $1, $2, $3) => {
        return `${$1 || ''}\\text{${$2}}${$3 || ''}`
      })
    }

    const completion: Completion = {
      label: key,
      detail: tex,
    }
    try {
      completion.info = katex.renderToString(tex.replace('$1', 'a').replace('$2', 'b'), { displayMode: true })
    }
    catch (e) {}
    completions.push(completion)
  }
  return completions
}

const completions = buildCompletionsFromSymbols()
await fs.writeFile('./public/snippets.json', JSON.stringify(completions), { encoding: 'utf8' })
