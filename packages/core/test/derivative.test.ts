import { describe, expect, it } from 'vitest'
import { AsciiMath } from '../src'

describe('derivative edge cases', () => {
  const am = new AsciiMath({ display: false })
  it('should get pp', () => {
    expect(am.toTex('pp')).toMatchInlineSnapshot('"\\\\frac{  }{  }"')
    expect(am.toTex('pp f')).toMatchInlineSnapshot('"\\\\frac{ \\\\partial f }{  }"')
  })
})
