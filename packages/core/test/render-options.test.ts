import { describe, expect, it } from 'vitest'
import { AsciiMath, TokenTypes } from '../src'
import { $_ } from './utils/string-raw'

describe('multilineEnv', () => {
  const multiline = 'a = b\n\nc = d'

  it('defaults to aligned', () => {
    const am = new AsciiMath({ display: false })
    expect(am.toTex(multiline)).toContain($_`\begin{aligned}`)
    expect(am.toTex(multiline)).toContain($_`\end{aligned}`)
  })

  it('can be switched to gather*', () => {
    const am = new AsciiMath({ display: false, multilineEnv: 'gather*' })
    const res = am.toTex(multiline)
    expect(res).toContain($_`\begin{gather*}`)
    expect(res).toContain($_`\end{gather*}`)
    expect(res).not.toContain('aligned')
  })

  it('leaves single-line expressions unwrapped', () => {
    const am = new AsciiMath({ display: false, multilineEnv: 'gather*' })
    expect(am.toTex('a = b')).not.toContain('gather')
  })
})

describe('singleNewlineBreak', () => {
  it('requires a blank line by default', () => {
    const am = new AsciiMath({ display: false })
    expect(am.toTex('a = b\nc = d')).not.toContain($_`\\`)
    expect(am.toTex('a = b\n\nc = d')).toContain($_`\\`)
  })

  it('breaks on a single line feed when enabled', () => {
    const am = new AsciiMath({ display: false, singleNewlineBreak: true })
    expect(am.toTex('a = b\nc = d')).toContain($_`\\`)
  })

  it('still breaks on a blank line when enabled', () => {
    const am = new AsciiMath({ display: false, singleNewlineBreak: true })
    expect(am.toTex('a = b\n\nc = d')).toContain($_`\\`)
  })
})

describe('barAsMid', () => {
  const setBuilder = '{ (x, y) | x^2 + y^2 <= 1 }'

  it('renders an unpaired bar as \\mid by default', () => {
    const am = new AsciiMath({ display: false })
    expect(am.toTex(setBuilder)).toContain($_`\mid`)
  })

  it('emits the bar verbatim when disabled', () => {
    const am = new AsciiMath({ display: false, barAsMid: false })
    const res = am.toTex(setBuilder)
    expect(res).not.toContain($_`\mid`)
    expect(res).toContain('|')
  })

  it('does not affect the explicit mid token', () => {
    const am = new AsciiMath({ display: false, barAsMid: false })
    expect(am.toTex('a mid b')).toContain($_`\mid`)
  })
})

describe('norm without \\left \\right (via symbols)', () => {
  it('can be overridden to a fixed-height norm', () => {
    const am = new AsciiMath({
      display: false,
      symbols: [['norm', { type: TokenTypes.OperatorOA, tex: $_`\| $1 \|` }]],
    })
    const res = am.toTex('norm(x)')
    expect(res).not.toContain($_`\left`)
    expect(res).not.toContain($_`\right`)
    expect(res).toContain($_`\|`)
  })
})

describe('options compose', () => {
  it('applies all four customisations together', () => {
    const am = new AsciiMath({
      display: false,
      multilineEnv: 'gather*',
      singleNewlineBreak: true,
      barAsMid: false,
      symbols: [['norm', { type: TokenTypes.OperatorOA, tex: $_`\| $1 \|` }]],
    })
    const res = am.toTex('norm(x) = 1\n{ (x) | x > 0 }')
    expect(res).toContain($_`\begin{gather*}`)
    expect(res).toContain($_`\\`)
    expect(res).not.toContain($_`\mid`)
    // norm is fixed-height; the \left\lbrace below comes from the set braces
    expect(res).toContain($_`\| x \|`)
    expect(res).not.toContain($_`\left\|`)
  })
})
