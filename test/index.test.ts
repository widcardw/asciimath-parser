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
