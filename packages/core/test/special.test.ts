import { describe, expect, it } from 'vitest'
import { parser } from '../src/parser'
import { codegen } from '../src/codegen'
import { createTrie } from '../src/trie'
import { AsciiMath, TokenTypes } from '../src'
import type { PR } from './utils/remove-position'
import { removeTex } from './utils/remove-position'
import { flat, root, u } from './utils/build-node'
import { removeValue } from './utils/removeValue'

describe('special cases', () => {
  const am = new AsciiMath({ display: false })
  it('should not cause infinite loop in color', () => {
    expect(am.toTex('color(😀\''))
      .toMatchInlineSnapshot('"{ \\\\color{😀\'}  }"')
    expect(am.toTex('color (pink) (123)'))
      .toMatchInlineSnapshot('"{ \\\\color{pink} 123 }"')
  })
  it('should parse e to the 3.14159', () => {
    expect(am.toTex('"e"^3.1415'))
      .toMatchInlineSnapshot('"\\\\text{e} ^{ 3.1415 }"')
  })
  it('should parse minus', () => {
    expect(am.toTex('a-b-c/d'))
      .toMatchInlineSnapshot('"a - b - \\\\frac{ c }{ d }"')
  })
  it('should parse pink color', () => {
    expect(am.toTex('color(pink)(abc)'))
      .toMatchInlineSnapshot('"{ \\\\color{pink} ab c }"')
  })
})

describe('matrix', () => {
  const am = new AsciiMath({ display: false })
  it('should parse matrix without right paren', () => {
    expect(am.toTex('[[a,b;c,d]')).toMatchInlineSnapshot('"\\\\left[ \\\\left[ \\\\begin{array}{cc} a & b \\\\\\\\ c & d \\\\end{array} \\\\right] \\\\right."')
  })
})

describe('emoji', () => {
  const am = new AsciiMath({ display: false })
  it('should parse emoji', () => {
    expect(am.toTex('😀😀'))
      .toMatchInlineSnapshot('"😀😀"')
  })
})

describe('backslash', () => {
  it('should parse backslash', () => {
    const trie = createTrie()
    const tokens = trie.tryParsingAll('\\')
    expect(removeTex(structuredClone(tokens))).toEqual<PR[]>([{ value: '\\', isKeyWord: false, type: TokenTypes.StringLiteral }])
    const ast = parser(tokens)
    expect(ast).toEqual({
      body: [{ tex: '\\', type: 'Const', value: '\\' }],
      type: 'Root',
    })
    expect(codegen(ast)).toMatchInlineSnapshot('"\\\\"')
  })
})

describe('replace laws', () => {
  it('should replace all', () => {
    const am = new AsciiMath({
      display: false,
      replaceBeforeTokenizing: [
        ['123', '456'],
        ['ref', 'text(reference)'],
      ],
    })
    expect(am.toTex('123456123ref')).toMatchInlineSnapshot('"456456456 \\\\text{reference}"')
    expect(am.toTex('123456ref ref')).toMatchInlineSnapshot('"456456 \\\\text{reference} \\\\text{reference}"')
  })
})

describe('spaces', () => {
  const am = new AsciiMath({ display: false })
  it('should parse spaces', () => {
    expect(am.toTex('a\\;b')).toMatchInlineSnapshot('"a \\\\; b"')
    expect(am.toTex('a\\,b')).toMatchInlineSnapshot('"a \\\\, b"')
    expect(am.toTex('a\\:b')).toMatchInlineSnapshot('"a \\\\: b"')
    expect(am.toTex('a enspace b')).toMatchInlineSnapshot('"a \\\\enspace b"')
    expect(am.toTex('a hspace(12pt) b')).toMatchInlineSnapshot('"a \\\\hspace{12pt} b"')
  })
  it('should not recognize as matrix', () => {
    expect(am.toTex('a |\\;| b')).toMatchInlineSnapshot('"a \\\\left| \\\\; \\\\right| b"')
  })
  it('should parse over arrow', () => {
    expect(am.toTex('Vec(AB)')).toMatchInlineSnapshot('"\\\\overrightarrow{ A B }"')
    expect(am.toTex('Vec(AB) + Vec(CD)')).toMatchInlineSnapshot('"\\\\overrightarrow{ A B } + \\\\overrightarrow{ C D }"')
  })
  it('should parse factorial', () => {
    expect(am.toTex('(mn)!')).toMatchInlineSnapshot('"{\\\\left( m n \\\\right) !}"')
    expect(am.toTex('(mn)!!')).toMatchInlineSnapshot('"{\\\\left( m n \\\\right) !!}"')
    expect(am.toTex('(mn)!!/n!')).toMatchInlineSnapshot('"\\\\frac{ {\\\\left( m n \\\\right) !!} }{ {n !} }"')
  })
})

describe('aligned environment', () => {
  const am = new AsciiMath({ display: false })
  it('should generate aligned env', () => {
    expect(am.toTex('a=b\n\nc=d')).toMatchInlineSnapshot('"\\\\begin{aligned}a = b \\\\\\\\ c = d\\\\end{aligned}"')
  })
})

describe('operator name', () => {
  const am = new AsciiMath({ display: false })
  it('should eat next of op', () => {
    expect(am.toTex('op(div)')).toMatchInlineSnapshot('"\\\\operatorname{ div }"')
    expect(am.toTex('op"div"')).toMatchInlineSnapshot('"\\\\operatorname{ div }"')
    expect(am.toTex('op pi')).toMatchInlineSnapshot('"\\\\operatorname{ pi }"')
  })
})

describe('limits style', () => {
  const am = new AsciiMath({ display: false })
  it('should build limits style', () => {
    expect(am.toTex('limits(||)_(k=1)^K')).toMatchInlineSnapshot('"\\\\mathop{ \\\\Vert }\\\\limits _{ k = 1 } ^{ K }"')
  })
})
