import { describe, expect, it } from 'vitest'
import { createTrie } from '../src/trie'
import { parser } from '../src/parser'
import { codegen } from '../src/codegen'
import { AsciiMath } from '../src'

describe('minus edge cases', () => {
//   const am = new AsciiMath({ display: false })
  it('should parse `e^-x`', () => {
    const code = 'e^-x'
    const trie = createTrie()
    const tokens = trie.tryParsingAll(code)
    expect(tokens).toMatchSnapshot()
    const ast = parser(tokens)
    expect(ast).toMatchSnapshot()
    const res = codegen(ast)
    expect(res).toMatchSnapshot()
  })

  it('should parse int_(0_-)', () => {
    const code = 'int_(0_-) (asd)'
    const trie = createTrie()
    const tokens = trie.tryParsingAll(code)
    expect(tokens).toMatchSnapshot()
    const ast = parser(tokens)
    expect(ast).toMatchSnapshot()
    const res = codegen(ast)
    expect(res).toMatchSnapshot()
  })

  it('should parse common minus expressions', () => {
    const am = new AsciiMath({ display: false })
    expect(am.toTex('a - b + c')).toMatchSnapshot()
    expect(am.toTex('a - b - c')).toMatchSnapshot()
  })
})

describe('minus with other operators', () => {
  const am = new AsciiMath({ display: false })
  it('should parse div', () => {
    expect(am.toTex('a/-b')).toMatchInlineSnapshot('"\\\\frac{ a }{ {-b } }"')
    expect(am.toTex('-a/b')).toMatchInlineSnapshot('"- \\\\frac{ a }{ b }"')
    expect(am.toTex('c/d-a/b')).toMatchInlineSnapshot('"\\\\frac{ c }{ d } - \\\\frac{ a }{ b }"')
  })

  it('should parse abs', () => {
    expect(am.toTex('abs -x')).toMatchInlineSnapshot('"\\\\left|{-x }\\\\right|"')
  })

  it('should parse integral', () => {
    expect(am.toTex('int_0^+oo')).toMatchInlineSnapshot('"\\\\int _{ 0 } ^{ {+\\\\infty } }"')
  })
})

describe('superscript with parens', () => {
  it('should generate "e"^-(x+y)', () => {
    const trie = createTrie()
    const code = '"e"^-(x+y)'
    const tokens = trie.tryParsingAll(code)
    expect(tokens).toMatchSnapshot()
    const ast = parser(tokens)
    expect(ast).toMatchSnapshot()
    const res = codegen(ast)
    expect(res).toMatchInlineSnapshot('"\\\\text{e} ^{ {-\\\\left( x + y \\\\right) } }"')
  })

  it('should not remove the parens', () => {
    const am = new AsciiMath({ display: false })
    expect(am.toTex('(-(x+y))/2')).toMatchInlineSnapshot('"\\\\frac{ - \\\\left( x + y \\\\right) }{ 2 }"')
    expect(am.toTex('(x+y)/-(z+w)')).toMatchInlineSnapshot('"\\\\frac{ x + y }{ {-\\\\left( z + w \\\\right) } }"')
    expect(am.toTex('(z-((x+y)-(w-q)))')).toMatchInlineSnapshot('"\\\\left( z - \\\\left( \\\\left( x + y \\\\right) - \\\\left( w - q \\\\right) \\\\right) \\\\right)"')
    expect(am.toTex('(z-((x+y)+(w+q)))')).toMatchInlineSnapshot('"\\\\left( z - \\\\left( \\\\left( x + y \\\\right) + \\\\left( w + q \\\\right) \\\\right) \\\\right)"')
    expect(am.toTex('a^-(b+c)+d-e^-(f-(g+h)-(i+j))')).toMatchInlineSnapshot('"a ^{ {-\\\\left( b + c \\\\right) } } + d - e ^{ {-\\\\left( f - \\\\left( g + h \\\\right) - \\\\left( i + j \\\\right) \\\\right) } }"')
  })
})
