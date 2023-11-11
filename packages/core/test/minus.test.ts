import { describe, expect, it } from 'vitest'
import { createTrie } from '../src/trie'
import { parser } from '../src/parser'
import { codegen } from '../src/codegen'
import { AsciiMath, TokenTypes } from '../src'
import type { PR } from './utils/remove-position'
import { removeTex } from './utils/remove-position'
import { $_ } from './utils/string-raw'
import { removeValue } from './utils/removeValue'
import { flat, lp, opOA, root, rp, sup, u } from './utils/build-node'

describe('minus edge cases', () => {
//   const am = new AsciiMath({ display: false })
  it('should parse `e^-x`', () => {
    const code = 'e^-x'
    const trie = createTrie()
    const tokens = trie.tryParsingAll(code)
    expect(removeTex(structuredClone(tokens))).toEqual<PR[]>([
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'e' },
      { isKeyWord: true, type: TokenTypes.OperatorSup, value: '^' },
      { isKeyWord: true, type: TokenTypes.OperatorMinus, value: '-' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'x' },
    ])
    const ast = parser(tokens)
    expect(removeValue(ast)).toEqual(
      root(
        flat(
          u('e'),
          sup('^', opOA('{-$1 }', u('x'))),
        ),
      ),
    )
    const res = codegen(ast)
    expect(res).toEqual('e ^{ {-x } }')
  })

  it('should parse int_(0_-)', () => {
    const code = 'int_(0_-) (asd)'
    const trie = createTrie()
    const tokens = trie.tryParsingAll(code)
    expect(removeTex(structuredClone(tokens))).toEqual<PR[]>([
      { isKeyWord: true, type: TokenTypes.Const, value: 'int' },
      { isKeyWord: true, type: TokenTypes.OperatorSup, value: '_' },
      { isKeyWord: true, type: TokenTypes.LParen, value: '(' },
      { isKeyWord: false, type: TokenTypes.NumberLiteral, value: '0' },
      { isKeyWord: true, type: TokenTypes.OperatorSup, value: '_' },
      { isKeyWord: true, type: TokenTypes.OperatorMinus, value: '-' },
      { isKeyWord: true, type: TokenTypes.RParen, value: ')' },
      { isKeyWord: true, type: TokenTypes.LParen, value: '(' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'as' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'd' },
      { isKeyWord: true, type: TokenTypes.RParen, value: ')' },
    ])
    const ast = parser(tokens)
    expect(removeValue(ast)).toEqual(
      root(
        flat(
          u('\\int'),
          sup('_',
            flat(
              flat(
                u('0'),
                sup('_', u('-')),
              ),
            ),
          ),
        ),
        flat(lp('('), u('as'), u('d'), rp(')')),
      ),
    )
    const res = codegen(ast)
    expect(res).toBe($_`\int _{ 0 _{ - } } \left( as d \right)`)
  })

  it('should parse common minus expressions', () => {
    const am = new AsciiMath({ display: false })
    expect(am.toTex('a - b + c')).toEqual('a - b + c')
    expect(am.toTex('a - b - c')).toEqual('a - b - c')
  })
})

describe('minus with other operators', () => {
  const am = new AsciiMath({ display: false })
  it('should parse div', () => {
    expect(am.toTex('a/-b')).toBe($_`\frac{ a }{ {-b } }`)
    expect(am.toTex('-a/b')).toBe($_`- \frac{ a }{ b }`)
    expect(am.toTex('c/d-a/b')).toBe($_`\frac{ c }{ d } - \frac{ a }{ b }`)
  })

  it('should parse abs', () => {
    expect(am.toTex('abs -x')).toBe($_`\left|{-x }\right|`)
  })

  it('should parse integral', () => {
    expect(am.toTex('int_0^+oo')).toBe($_`\int _{ 0 } ^{ {+\infty } }`)
  })
})

describe('superscript with parens', () => {
  it('should generate "e"^-(x+y)', () => {
    const trie = createTrie()
    const code = '"e"^-(x+y)'
    const tokens = trie.tryParsingAll(code)
    expect(removeTex(structuredClone(tokens))).toEqual<PR[]>([
      { isKeyWord: false, type: TokenTypes.Text, value: 'e' },
      { isKeyWord: true, type: TokenTypes.OperatorSup, value: '^' },
      { isKeyWord: true, type: TokenTypes.OperatorMinus, value: '-' },
      { isKeyWord: true, type: TokenTypes.LParen, value: '(' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'x' },
      { isKeyWord: true, type: TokenTypes.OperatorMinus, value: '+' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'y' },
      { isKeyWord: true, type: TokenTypes.RParen, value: ')' },
    ])
    const ast = parser(tokens)
    expect(removeValue(ast)).toEqual(
      root(
        flat(
          u('\\text{e}'),
          sup(
            '^',
            opOA('{-$1 }',
              flat(
                lp('('), u('x'), u('+'), u('y'), rp(')'),
              ),
            ),
          ),
        ),
      ),
    )
    const res = codegen(ast)
    expect(res).toEqual($_`\text{e} ^{ {-\left( x + y \right) } }`)
  })

  it('should not remove the parens', () => {
    const am = new AsciiMath({ display: false })
    expect(am.toTex('(-(x+y))/2')).toEqual($_`\frac{ - \left( x + y \right) }{ 2 }`)
    expect(am.toTex('(x+y)/-(z+w)')).toEqual($_`\frac{ x + y }{ {-\left( z + w \right) } }`)
    expect(am.toTex('(z-((x+y)-(w-q)))')).toEqual($_`\left( z - \left( \left( x + y \right) - \left( w - q \right) \right) \right)`)
    expect(am.toTex('(z-((x+y)+(w+q)))')).toEqual($_`\left( z - \left( \left( x + y \right) + \left( w + q \right) \right) \right)`)
    expect(am.toTex('a^-(b+c)+d-e^-(f-(g+h)-(i+j))')).toEqual($_`a ^{ {-\left( b + c \right) } } + d - e ^{ {-\left( f - \left( g + h \right) - \left( i + j \right) \right) } }`)
  })
})
