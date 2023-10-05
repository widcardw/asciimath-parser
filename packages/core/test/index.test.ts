import { describe, expect, it } from 'vitest'
import { AsciiMath, TokenTypes } from '../src'

describe('asciimath', () => {
  const am = new AsciiMath({
    symbols: [['d0', { type: TokenTypes.Const, tex: '{\\text{d}\\theta}' }]],
    replaceBeforeTokenizing: [
      [/dp/g, '{:"d"p:}'],
    ],
  })
  it('should parse integrals', () => {
    expect(am.toTex('int _0 ^(+oo) "e"^-x dx = 1')).toMatchSnapshot()
    expect(am.toTex('theta d0')).toMatchInlineSnapshot('"\\\\displaystyle{ \\\\theta {\\\\text{d}\\\\theta} }"')
    expect(am.toTex('a dp b dp')).toMatchInlineSnapshot('"\\\\displaystyle{ a { \\\\text{d} p } b { \\\\text{d} p } }"')
  })
})

describe('display', () => {
  it('should in display mode', () => {
    const am = new AsciiMath({ display: true })
    expect(am.toTex('int')).toMatchInlineSnapshot('"\\\\displaystyle{ \\\\int }"')
  })

  it('should not in display mode', () => {
    const am = new AsciiMath({ display: false })
    expect(am.toTex('int')).toMatchInlineSnapshot('"\\\\int"')
  })
})

describe('codegen xlongequal', () => {
  const am = new AsciiMath()
  it('should generate xlongequal', () => {
    expect(am.toTex('==_(123)^456')).toMatchSnapshot()
    expect(am.toTex('==_(123)')).toMatchInlineSnapshot('"\\\\displaystyle{ \\\\xlongequal[ 123 ]{  } }"')
    expect(am.toTex('==^(123)')).toMatchInlineSnapshot('"\\\\displaystyle{ \\\\xlongequal[  ]{ 123 } }"')
    expect(am.toTex('==')).toMatchInlineSnapshot('"\\\\displaystyle{ \\\\xlongequal{} }"')
  })
})

describe('sup and div', () => {
  const am = new AsciiMath()
  it('should render sup first', () => {
    expect(am.toTex('pi^2/6')).toMatchInlineSnapshot('"\\\\displaystyle{ \\\\frac{ \\\\pi ^{ 2 } }{ 6 } }"')
  })
})

describe('`op A` and `sup`', () => {
  const am = new AsciiMath()
  it('should render `op A` first', () => {
    expect(am.toTex('abs(a)^3')).toMatchInlineSnapshot('"\\\\displaystyle{ \\\\left|a\\\\right| ^{ 3 } }"')
  })
})

describe('replace special chars', () => {
  const am = new AsciiMath()
  it('should replace', () => {
    expect(am.toTex('&#8810;')).toMatchInlineSnapshot('"\\\\displaystyle{ ≪ }"')
    expect(am.toTex('&#x23e0;')).toMatchInlineSnapshot('"\\\\displaystyle{ ⏠ }"')
  })
})

describe('error expression', () => {
  const am = new AsciiMath()
  it('unmatched paren', () => {
    expect(am.toTex('(1^)')).toMatchInlineSnapshot('"\\\\text{Error: Read index out of range, index: 4}"')
  })
})

describe('customize display mode', () => {
  const am = new AsciiMath()
  it('should not be wrapped with display', () => {
    expect(am.toTex('int', { display: false })).toMatchInlineSnapshot('"\\\\int"')
    expect(am.toTex('int', { display: true })).toMatchInlineSnapshot('"\\\\displaystyle{ \\\\int }"')
  })
})

describe('customize display mode 2', () => {
  const am = new AsciiMath({ display: false })
  it('should not be wrapped with display', () => {
    expect(am.toTex('int')).toMatchInlineSnapshot('"\\\\int"')
    expect(am.toTex('int', { display: true })).toMatchInlineSnapshot('"\\\\displaystyle{ \\\\int }"')
  })
})
