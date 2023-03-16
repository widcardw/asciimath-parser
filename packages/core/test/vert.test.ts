import { describe, expect, it } from 'vitest'
import { parser } from '../src/parser'
import { codegen } from '../src/codegen'
import { createTrie } from '../src/trie'
import { AsciiMath } from '../src'

const c1 = '||a,b;c,d||'

describe('left and right vert', () => {
  it('should generate left and right vert', () => {
    const trie = createTrie()
    const tokens = trie.tryParsingAll(c1)
    expect(tokens).toMatchSnapshot()
    const ast = parser(tokens)
    expect(ast).toMatchSnapshot()
  })

  it('should not generate left and right vert', () => {
    const am = new AsciiMath({ display: false })
    expect(am.toTex('||a,b|')).toMatchInlineSnapshot('"\\\\Vert a , b \\\\mid"')
    expect(am.toTex('|a,b||')).toMatchInlineSnapshot('"\\\\mid a , b \\\\Vert"')
    expect(am.toTex('|a,b||c,d|')).toMatchInlineSnapshot('"\\\\left| a , b \\\\Vert c , d \\\\right|"')
    expect(am.toTex('||a,b|c;d,e|f||')).toMatchInlineSnapshot('"\\\\left\\\\Vert \\\\begin{array}{cc} a & b \\\\left| \\\\begin{array}{cc} c \\\\\\\\ d & e \\\\end{array} \\\\right| f \\\\end{array} \\\\right\\\\Vert"')
    expect(am.toTex('[a,b|c;d,e|f]')).toMatchInlineSnapshot('"\\\\left[ \\\\begin{array}{cc|c} a & b & c \\\\\\\\ d & e & f \\\\end{array} \\\\right]"')
    expect(am.toTex('[a,b||c;d,e||f]')).toMatchInlineSnapshot('"\\\\left[ \\\\begin{array}{cc|c} a & b & c \\\\\\\\ d & e & f \\\\end{array} \\\\right]"')
  })
})
