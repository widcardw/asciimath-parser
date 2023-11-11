import { describe, expect, it } from 'vitest'
import { TokenTypes } from '../../src'
import { removeTex } from './remove-position'

describe('test remove position', () => {
  it('should remove position', () => {
    expect(
      removeTex(
        {
          value: 'abc',
          current: 0,
          isKeyWord: false,
          tex: 'abc',
          type: TokenTypes.Const,
          pos: { line: 1, ch: 0 },
        }))
      .toEqual(
        {
          value: 'abc',
          isKeyWord: false,
          type: TokenTypes.Const,
        },
      )
  })

  it('should remove position for array', () => {
    expect(
      removeTex(
        [{
          value: 'abc',
          current: 0,
          isKeyWord: false,
          tex: 'abc',
          type: TokenTypes.Const,
          pos: { line: 1, ch: 0 },
        }]))
      .toEqual(
        [{
          value: 'abc',
          isKeyWord: false,
          type: TokenTypes.Const,
        }],
      )
  })
})
