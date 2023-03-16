import { describe, expect, it } from 'vitest'
import AmLegacy from 'asciimath-js'
import * as AmNearley from '../src/index'
import * as AmCore from '../../core/src/index'
import { examples } from './examples'
import { traceLex } from './to-tex.test'

describe('test nearley', () => {
  const am = new AmNearley.AsciiMath({ display: false })
  examples.forEach((item, index) => {
    it(`#${index} ${item.desc ? `[${item.desc}] ` : ''}${item.input}`, () => {
      expect(am.toTex(item.input)).toBeDefined()
    })
  })
})

describe('test core', () => {
  const am = new AmCore.AsciiMath({ display: false })
  examples.forEach((item, index) => {
    it(`#${index} ${item.desc ? `[${item.desc}] ` : ''}${item.input}`, () => {
      expect(am.toTex(item.input)).toBeDefined()
    })
  })
})

describe('test legacy', () => {
  examples.forEach((item, index) => {
    it(`#${index} ${item.desc ? `[${item.desc}] ` : ''}${item.input}`, () => {
      expect(AmLegacy.am2tex(item.input)).toBeDefined()
    })
  })
})

describe('test lexer', () => {
  const am = new AmNearley.AsciiMath({ display: false })
  examples.forEach((item, index) => {
    it(`#${index} ${item.desc ? `[${item.desc}] ` : ''}${item.input}`, () => {
      expect(traceLex(item.input, am.lexer)).toBeDefined()
    })
  })
})
