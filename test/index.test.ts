import { describe, expect, it } from 'vitest'
import { AsciiMath } from '../src'

describe('asciimath', () => {
  const am = new AsciiMath()
  it('should parse integrals', () => {
    expect(am.toTex('int _0 ^(+oo) "e"^(-x) dx = 1')).toMatchSnapshot()
  })

  it('should parse partial ...', () => {
    expect(am.toTex('part f x = 2x')).toMatchSnapshot()
    expect(am.toTex('part^3 f (x y^2) = 2x^2 y')).toMatchSnapshot()
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
