import { describe, expect, it } from 'vitest'
import { createTrie } from '../src/trie'
import { AsciiMath, TokenTypes } from '../src'
import { AlignDirection, parser } from '../src/parser'
import { codegen } from '../src/codegen'
import type { PR } from './utils/remove-position'
import { removeTex } from './utils/remove-position'
import { flat, mat, root, u } from './utils/build-node'
import { $_ } from './utils/string-raw'
import { removeValue } from './utils/removeValue'

describe('partial and derivative', () => {
  it('should tokenize expressions', () => {
    const code = 'part f x'
    const trie = createTrie()
    const tokens = trie.tryParsingAll(code)
    expect(removeTex(structuredClone(tokens))).toEqual<PR[]>([
      { isKeyWord: true, type: TokenTypes.OperatorPartial, value: 'part' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'f' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'x' },
    ])
    const ast = parser(tokens)
    expect(removeValue(ast)).toEqual(root(u(TokenTypes.OperatorPartial, {
      up: flat(u('\\partial'), u('f')),
      down: flat(u('\\partial'), u('x')),
    })))
    expect(codegen(ast)).toMatchInlineSnapshot('"\\\\frac{ \\\\partial f }{ \\\\partial x }"')
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
    expect(removeValue(ast)).toEqual(root(u(TokenTypes.OperatorPartial, {
      up: flat(u('\\partial'), u(TokenTypes.OperatorSup, { tex: '^{ $1 }', param: u('3') }), u('f')),
      down: flat(u('\\partial'), u('x'), u('\\partial'), flat(u('y'), u(TokenTypes.OperatorSup, { tex: '^{ $1 }', param: u('2') }))),
    })))
  })

  it('should parse matrix', () => {
    const code = '[part^2 f x, part^2 f (x y); part^2 f (y x), part^2 f y]'
    const trie = createTrie()
    const tokens = trie.tryParsingAll(code)
    expect(removeTex(structuredClone(tokens))).toEqual<PR[]>([
      { isKeyWord: true, type: TokenTypes.LParen, value: '[' },
      { isKeyWord: true, type: TokenTypes.OperatorPartial, value: 'part' },
      { isKeyWord: true, type: TokenTypes.OperatorSup, value: '^' },
      { isKeyWord: false, type: TokenTypes.NumberLiteral, value: '2' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'f' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'x' },
      { isKeyWord: true, type: TokenTypes.Split, value: ',' },
      { isKeyWord: true, type: TokenTypes.OperatorPartial, value: 'part' },
      { isKeyWord: true, type: TokenTypes.OperatorSup, value: '^' },
      { isKeyWord: false, type: TokenTypes.NumberLiteral, value: '2' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'f' },
      { isKeyWord: true, type: TokenTypes.LParen, value: '(' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'x' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'y' },
      { isKeyWord: true, type: TokenTypes.RParen, value: ')' },
      { isKeyWord: true, type: TokenTypes.Split, value: ';' },
      { isKeyWord: true, type: TokenTypes.OperatorPartial, value: 'part' },
      { isKeyWord: true, type: TokenTypes.OperatorSup, value: '^' },
      { isKeyWord: false, type: TokenTypes.NumberLiteral, value: '2' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'f' },
      { isKeyWord: true, type: TokenTypes.LParen, value: '(' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'y' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'x' },
      { isKeyWord: true, type: TokenTypes.RParen, value: ')' },
      { isKeyWord: true, type: TokenTypes.Split, value: ',' },
      { isKeyWord: true, type: TokenTypes.OperatorPartial, value: 'part' },
      { isKeyWord: true, type: TokenTypes.OperatorSup, value: '^' },
      { isKeyWord: false, type: TokenTypes.NumberLiteral, value: '2' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'f' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'y' },
      { isKeyWord: true, type: TokenTypes.RParen, value: ']' },
    ])
    const ast = parser(tokens)
    expect(removeValue(ast)).toEqual(root(mat([
      [
        flat(u(TokenTypes.OperatorPartial, {
          up: flat(u('\\partial'), u(TokenTypes.OperatorSup, { tex: '^{ $1 }', param: u('2') }), u('f')),
          down: flat(u('\\partial'), u('x'), u(TokenTypes.OperatorSup, { tex: '^{ $1 }', param: u('2') })),
        })),
        flat(u(TokenTypes.OperatorPartial, {
          up: flat(u('\\partial'), u(TokenTypes.OperatorSup, { tex: '^{ $1 }', param: u('2') }), u('f')),
          down: flat(u('\\partial'), u('x'), u('\\partial'), u('y')),
        })),
      ],
      [
        flat(u(TokenTypes.OperatorPartial, {
          up: flat(u('\\partial'), u(TokenTypes.OperatorSup, { tex: '^{ $1 }', param: u('2') }), u('f')),
          down: flat(u('\\partial'), u('y'), u('\\partial'), u('x')),
        })),
        flat(u(TokenTypes.OperatorPartial, {
          up: flat(u('\\partial'), u(TokenTypes.OperatorSup, { tex: '^{ $1 }', param: u('2') }), u('f')),
          down: flat(u('\\partial'), u('y'), u(TokenTypes.OperatorSup, { tex: '^{ $1 }', param: u('2') })),
        })),
      ],
    ])))
    // expect(ast).toMatchSnapshot()
    expect(codegen(ast)).toBe($_`\left[ \begin{array}{cc} \frac{ \partial ^{ 2 } f }{ \partial x ^{ 2 } } & \frac{ \partial ^{ 2 } f }{ \partial x \partial y } \\ \frac{ \partial ^{ 2 } f }{ \partial y \partial x } & \frac{ \partial ^{ 2 } f }{ \partial y ^{ 2 } } \end{array} \right]`)
  })
})
