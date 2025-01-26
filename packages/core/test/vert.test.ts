import { describe, expect, it } from 'vitest'
import { AsciiMath, TokenTypes } from '../src'
import { parser } from '../src/parser'
import { createTrie } from '../src/trie'
import { flat, mat, root, u } from './utils/build-node'
import type { PR } from './utils/remove-position'
import { removeTex } from './utils/remove-position'
import { removeValue } from './utils/removeValue'
import { $_ } from './utils/string-raw'

const c1 = '||a,b;c,d||'

describe('left and right vert', () => {
  it('should generate left and right vert', () => {
    const trie = createTrie()
    const tokens = trie.tryParsingAll(c1)
    expect(removeTex(structuredClone(tokens))).toEqual<PR[]>([
      { isKeyWord: true, type: TokenTypes.Paren, value: '||' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'a' },
      { isKeyWord: true, type: TokenTypes.Split, value: ',' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'b' },
      { isKeyWord: true, type: TokenTypes.Split, value: ';' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'c' },
      { isKeyWord: true, type: TokenTypes.Split, value: ',' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'd' },
      { isKeyWord: true, type: TokenTypes.Paren, value: '||' },
    ])
    const ast = parser(tokens)
    // TODO FIX
    expect(removeValue(ast)).toEqual(root(
      mat([
        [u('a'), u('b')],
        [u('c'), u('d')],
      ], { l: '\\Vert', r: '\\Vert' }),
    ))
  })

  it('should not generate left and right vert', () => {
    const am = new AsciiMath({ display: false })
    expect(am.toTex('||a,b|')).toBe($_`\Vert a , b \mid`)
    expect(am.toTex('|a,b||')).toBe($_`\mid a , b \Vert`)
    expect(am.toTex('|a,b||c,d|')).toBe($_`\left| a , b \Vert c , d \right|`)
    expect(am.toTex('||a,b|c;d,e|f||')).toBe($_`\left\Vert \begin{array}{cc} a & b \left| \begin{array}{cc} c \\ d & e \end{array} \right| f \end{array} \right\Vert`)
    expect(am.toTex('[a,b|c;d,e|f]')).toBe($_`\left[ \begin{array}{cc|c} a & b & c \\ d & e & f \end{array} \right]`)
    expect(am.toTex('[a,b||c;d,e||f]')).toBe($_`\left[ \begin{array}{cc|c} a & b & c \\ d & e & f \end{array} \right]`)
  })
})
