import { describe, expect, it } from 'vitest'
import { AsciiMath } from '../src'
import { createTrie } from '../src/trie'
import { parser } from '../src/parser'
import { codegen } from '../src/codegen'

describe('asciimath', () => {
  it('should parse integrals', () => {
    const trie = createTrie()
    const code = 'int "e"^-x dx '
    const tokens = trie.tryParsingAll(code)
    expect(tokens).toMatchSnapshot()
    const ast = parser(tokens)
    expect(ast).toMatchSnapshot()
    const res = codegen(ast)
    expect(res).toMatchSnapshot()
  })
})
