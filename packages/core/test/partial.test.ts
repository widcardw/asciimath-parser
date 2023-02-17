import { describe, expect, it } from 'vitest'
import { createTrie } from '../src/trie'
import { AsciiMath } from '../src'
import { parser } from '../src/parser'
import { codegen } from '../src/codegen'

describe('partial and derivative', () => {
  it('should tokenize expressions', () => {
    const code = 'part f x'
    const trie = createTrie()
    const tokens = trie.tryParsingAll(code)
    expect(tokens).toMatchSnapshot()
    const ast = parser(tokens)
    expect(ast).toMatchSnapshot()
    expect(codegen(ast)).toMatchSnapshot()
  })
  it('should generate partial expressions', () => {
    const am = new AsciiMath({ display: false })
    expect(am.toTex('part f x = 2x'))
      .toMatchInlineSnapshot('"\\\\frac{ \\\\partial f }{ \\\\partial x } = 2 x"')
    expect(am.toTex('part^3 f (x y^2) = 2x^2 y'))
      .toMatchInlineSnapshot('"\\\\frac{ \\\\partial ^{ 3 } f }{ \\\\partial x \\\\partial y ^{ 2 } } = 2 x ^{ 2 } y"')
    expect(am.toTex('part^3 f x = 3x^2'))
      .toMatchInlineSnapshot('"\\\\frac{ \\\\partial ^{ 3 } f }{ \\\\partial x ^{ 3 } } = 3 x ^{ 2 }"')
    expect(am.toTex('dd^3 f x = 3x^2'))
      .toMatchInlineSnapshot('"\\\\frac{ \\\\mathrm{d} ^{ 3 } f }{ \\\\mathrm{d} x ^{ 3 } } = 3 x ^{ 2 }"')
  })
  it('should parse x^2', () => {
    const code = 'part^3 f (x y^2)'
    const trie = createTrie()
    const tokens = trie.tryParsingAll(code)
    const ast = parser(tokens)
    expect(ast).toMatchSnapshot()
  })

  it('should parse matrix', () => {
    const code = '[part^2 f x, part^2 f (x y); part^2 f (y x), part^2 f y]'
    const trie = createTrie()
    const tokens = trie.tryParsingAll(code)
    expect(tokens).toMatchSnapshot()
    const ast = parser(tokens)
    expect(ast).toMatchSnapshot()
    expect(codegen(ast)).toMatchSnapshot()
  })
})
