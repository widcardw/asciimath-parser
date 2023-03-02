import { describe, expect, it } from 'vitest'
import { codegen } from '../src/codegen'
import { parser } from '../src/parser'
import { createTrie } from '../src/trie'

const code = `
[1, 0, cdots, 0;
s_1, b_11, cdots, b_(1n);
vdots, vdots, , vdots;
s_n, b_(n1), cdots, b_(n n)]`

describe('matrix with empty el', () => {
//   const am = new AsciiMath({ display: false })
  it('should generate ast', () => {
    const trie = createTrie()
    const tokens = trie.tryParsingAll(code)
    const ast = parser(tokens)
    expect(tokens).toMatchSnapshot()
    expect(ast).toMatchSnapshot()
    expect(codegen(ast)).toMatchInlineSnapshot('"\\\\left[ \\\\begin{array}{cccc} 1 & 0 & \\\\cdots & 0\\\\\\\\s _{ 1 } & b _{ 11 } & \\\\cdots & b _{ 1 n }\\\\\\\\\\\\vdots & \\\\vdots &  & \\\\vdots\\\\\\\\s _{ n } & b _{ n 1 } & \\\\cdots & b _{ n n } \\\\\\\\ \\\\end{array} \\\\right]"')
  })
})
