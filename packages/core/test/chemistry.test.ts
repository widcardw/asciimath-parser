import { describe, expect, it } from 'vitest'
import { AsciiMath, TokenTypes } from '../src'
import { $_ } from './utils/string-raw'

describe('extend chemistry in asciimath', () => {
  const am = new AsciiMath({
    display: false,
  })

  it('should read ce', () => {
    expect(am.toTex('ce"H2SO4"')).toBe($_`{\ce H2SO4 }`)
    expect(am.toTex('pH')).toBe($_`\mathrm{pH}`)
  })
})
