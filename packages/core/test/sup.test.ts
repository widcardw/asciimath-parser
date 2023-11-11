import { describe, expect, it } from 'vitest'
import { parser } from '../src/parser'
import { codegen } from '../src/codegen'
import { createTrie } from '../src/trie'
import { TokenTypes } from '../src'
import { type PR, removeTex } from './utils/remove-position'
import { flat, root, sup, u } from './utils/build-node'
import { removeValue } from './utils/removeValue'

describe('sup sub', () => {
  it('should parse a formula that has both sup and sub', () => {
    const code = 'x^x_x'
    const trie = createTrie()
    const tokens = trie.tryParsingAll(code)
    expect(removeTex(structuredClone(tokens))).toEqual<PR[]>([
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'x' },
      { isKeyWord: true, type: TokenTypes.OperatorSup, value: '^' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'x' },
      { isKeyWord: true, type: TokenTypes.OperatorSup, value: '_' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'x' },
    ])
    const ast = parser(tokens)
    expect(removeValue(ast)).toEqual(root(flat(
      u('x'),
      sup('^', u('x')),
      sup('_', u('x')),
    )))
    const res = codegen(ast)
    expect(res).toMatchInlineSnapshot('"x ^{ x } _{ x }"')
  })

  it('should add sub to sup because the `+` causes the parser to look forward', () => {
    const code = 'x^+x_x'
    const trie = createTrie()
    const tokens = trie.tryParsingAll(code)
    expect(removeTex(structuredClone(tokens))).toEqual<PR[]>([
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'x' },
      { isKeyWord: true, type: TokenTypes.OperatorSup, value: '^' },
      { isKeyWord: true, type: TokenTypes.OperatorMinus, value: '+' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'x' },
      { isKeyWord: true, type: TokenTypes.OperatorSup, value: '_' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'x' },
    ])
    const ast = parser(tokens)
    expect(removeValue(ast)).toEqual(root(flat(
      u('x'),
      u(TokenTypes.OperatorSup, {
        tex: '^{ $1 }',
        param: u(TokenTypes.OperatorMinus, {
          tex: '{+$1 }',
          param: flat(
            u('x'),
            u(TokenTypes.OperatorSup, { tex: '_{ $1 }', param: u('x') }),
          ),
        }),
      }),
    )))
    const res = codegen(ast)
    expect(res).toMatchInlineSnapshot('"x ^{ {+x _{ x } } }"')
  })
})
