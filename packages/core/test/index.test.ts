import { describe, expect, it } from 'vitest'
import { AsciiMath, TokenTypes } from '../src'
import { $_ } from './utils/string-raw'

describe('asciimath', () => {
  const am = new AsciiMath({
    symbols: [['d0', { type: TokenTypes.Const, tex: '{\\text{d}\\theta}' }]],
    replaceBeforeTokenizing: [
      [/dp/g, '{:"d"p:}'],
    ],
  })
  it('should parse integrals', () => {
    expect(am.toTex('int _0 ^(+oo) "e"^-x dx = 1')).toBe($_`\displaystyle{ \int _{ 0 } ^{ + \infty } \text{e} ^{ {-x } } {\text{d}x} = 1 }`)
    expect(am.toTex('theta d0')).toBe($_`\displaystyle{ \theta {\text{d}\theta} }`)
    expect(am.toTex('a dp b dp')).toBe($_`\displaystyle{ a { \text{d} p } b { \text{d} p } }`)
  })
})

describe('display', () => {
  it('should in display mode', () => {
    const am = new AsciiMath({ display: true })
    expect(am.toTex('int')).toBe($_`\displaystyle{ \int }`)
  })

  it('should not in display mode', () => {
    const am = new AsciiMath({ display: false })
    expect(am.toTex('int')).toBe($_`\int`)
  })
})

describe('codegen xlongequal', () => {
  const am = new AsciiMath()
  it('should generate xlongequal', () => {
    expect(am.toTex('==_(123)^456')).toBe('\\displaystyle{ \\xlongequal[ 123 ]{ 456 } }')
    expect(am.toTex('==_(123)')).toBe('\\displaystyle{ \\xlongequal[ 123 ]{  } }')
    expect(am.toTex('==^(123)')).toBe('\\displaystyle{ \\xlongequal[  ]{ 123 } }')
    expect(am.toTex('==')).toBe('\\displaystyle{ \\xlongequal{} }')
  })
})

describe('sup and div', () => {
  const am = new AsciiMath()
  it('should render sup first', () => {
    expect(am.toTex('pi^2/6')).toBe($_`\displaystyle{ \frac{ \pi ^{ 2 } }{ 6 } }`)
  })
})

describe('`op A` and `sup`', () => {
  const am = new AsciiMath()
  it('should render `op A` first', () => {
    expect(am.toTex('abs(a)^3')).toBe($_`\displaystyle{ \left|a\right| ^{ 3 } }`)
  })
})

describe('replace special chars', () => {
  const am = new AsciiMath()
  it('should replace', () => {
    expect(am.toTex('&#8810;')).toBe($_`\displaystyle{ ≪ }`)
    expect(am.toTex('&#x23e0;')).toBe($_`\displaystyle{ ⏠ }`)
  })
})

describe('error expression', () => {
  const am = new AsciiMath()
  it('unmatched paren', () => {
    expect(am.toTex('(1^)')).toBe($_`\text{Error: Read index out of range at line: 1, ch: 0.}`)
  })
})

describe('customize display mode', () => {
  const am = new AsciiMath()
  it('should not be wrapped with display', () => {
    expect(am.toTex('int', { display: false })).toBe($_`\int`)
    expect(am.toTex('int', { display: true })).toBe($_`\displaystyle{ \int }`)
  })
})

describe('customize display mode 2', () => {
  const am = new AsciiMath({ display: false })
  it('should not be wrapped with display', () => {
    expect(am.toTex('int')).toBe($_`\int`)
    expect(am.toTex('int', { display: true })).toBe($_`\displaystyle{ \int }`)
  })
})
