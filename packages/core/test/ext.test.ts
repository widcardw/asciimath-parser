import { describe, expect, it } from 'vitest'
import { AsciiMath, TokenTypes } from '../src'

const $_ = String.raw

describe('extend tokens in asciimath', () => {
  const am = new AsciiMath({
    symbols: [
      ['d0', { type: TokenTypes.Const, tex: $_`{\mathrm{d}\theta}` }],
      ['over', { type: TokenTypes.OperatorAOB, tex: $_`{ $1 \over $2 }` }],
      ['tsc', { type: TokenTypes.OperatorOA, tex: $_`\textsc{$1}`, eatNext: true }],
    ],
    display: false,
  })

  it('should extend const token', () => {
    expect(am.toTex('int_0^pi theta d0'))
      .toBe($_`\int _{ 0 } ^{ \pi } \theta {\mathrm{d}\theta}`)
  })

  it('should extend AOB', () => {
    expect(am.toTex('(a atop b) / (c atop d)'))
      .toBe($_`\frac{ { a \atop b } }{ { c \atop d } }`)
  })

  it('should extend OA', () => {
    expect(am.toTex('tsc"small capital"'))
      .toBe($_`\textsc{small capital}`)
  })
})
