import { describe, expect, it } from 'vitest'
import { AsciiMath, TokenTypes } from '../src'
import { createTrie } from '../src/trie'
import { parser } from '../src/parser'
import { codegen } from '../src/codegen'
import type { PR } from './utils/remove-position'
import { removeTex } from './utils/remove-position'
import { flat, opOA, root, sup, u } from './utils/build-node'
import { removeValue } from './utils/removeValue'

describe('asciimath', () => {
  it('should parse integrals', () => {
    const trie = createTrie({
      symbols: { dx: { type: TokenTypes.Const, tex: '\\text{dx}' } },
    })
    const code = 'int "e"^-x dx '
    const tokens = trie.tryParsingAll(code)
    expect(removeTex(structuredClone(tokens))).toEqual<PR[]>([
      { isKeyWord: true, type: TokenTypes.Const, value: 'int' },
      { isKeyWord: false, type: TokenTypes.Text, value: 'e' },
      { isKeyWord: true, type: TokenTypes.OperatorSup, value: '^' },
      { isKeyWord: true, type: TokenTypes.OperatorMinus, value: '-' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'x' },
      { isKeyWord: true, type: TokenTypes.Const, value: 'dx' },
    ])
    const ast = parser(tokens)
    expect(removeValue(ast)).toEqual(root(
      u('\\int'),
      // TODO
      flat(
        u('\\text{e}'),
        sup('^', opOA('{-$1 }', u('x'))),
      ),
      u('\\text{dx}'),
    ))
    const res = codegen(ast)
    expect(res).toMatchInlineSnapshot('"\\\\int \\\\text{e} ^{ {-x } } \\\\text{dx}"')
  })
})
