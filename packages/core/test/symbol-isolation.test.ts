import { describe, expect, it } from 'vitest'
import { AsciiMath, TokenTypes } from '../src'
import { $_ } from './utils/string-raw'

describe('symbol isolation', () => {
  it('does not leak symbol overrides into other instances', () => {
    const plain = new AsciiMath({ display: false })
    const before = plain.toTex('norm(x)')
    expect(before).toContain($_`\left\|`)

    const overridden = new AsciiMath({
      display: false,
      symbols: [['norm', { type: TokenTypes.OperatorOA, tex: $_`\| $1 \|` }]],
    })
    expect(overridden.toTex('norm(x)')).not.toContain($_`\left`)

    // The instance constructed earlier must be unaffected.
    expect(plain.toTex('norm(x)')).toBe(before)

    // And so must one constructed afterwards.
    const after = new AsciiMath({ display: false })
    expect(after.toTex('norm(x)')).toBe(before)
  })

  it('keeps extended tokens out of the shared table', () => {
    const extended = new AsciiMath({
      display: false,
      symbols: [['d0', { type: TokenTypes.Const, tex: $_`{\mathrm{d}\theta}` }]],
    })
    expect(extended.toTex('d0')).toContain($_`\mathrm{d}`)

    const plain = new AsciiMath({ display: false })
    expect(plain.toTex('d0')).not.toContain($_`\mathrm{d}`)
  })
})
