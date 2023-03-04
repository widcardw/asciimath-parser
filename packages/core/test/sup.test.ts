import { describe, expect, it } from 'vitest'
import { parser } from '../src/parser'
import { codegen } from '../src/codegen'
import { createTrie } from '../src/trie'

describe('sup sub', () => {
  it('should parse a formula that has both sup and sub', () => {
    const code = 'x^x_x'
    const trie = createTrie()
    const tokens = trie.tryParsingAll(code)
    expect(tokens).toMatchSnapshot()
    const ast = parser(tokens)
    expect(ast).toMatchSnapshot()
    const res = codegen(ast)
    expect(res).toMatchSnapshot()
  })

  it('should add sub to sup because the `+` causes the parser to look forward', () => {
    const code = 'x^+x_x'
    const trie = createTrie()
    const tokens = trie.tryParsingAll(code)
    expect(tokens).toMatchSnapshot()
    const ast = parser(tokens)
    expect(ast).toMatchSnapshot()
    const res = codegen(ast)
    expect(res).toMatchSnapshot()
  })
})
