import { describe, expect, it } from 'vitest'
import type Nearley from 'nearley'
import * as AmNearley from '../src/index'
import { examples } from './examples'

// 打印 token 列表
export const traceLex = (input: string, lexer: Nearley.Lexer) => {
  lexer.reset(input)
  const buf = []
  let res = lexer.next()
  while (res) {
    buf.push(res)
    res = lexer.next()
  }
  console.error('traceLex:', buf)
  return true
}

describe('test nearley', () => {
  const am = new AmNearley.AsciiMath({ display: false })
  examples.forEach((item, index) => {
    // traceLex(item.input, am.lexer)
    it(`#${index} ${item.desc ? `[${item.desc}] ` : ''}${item.input}`, () => {
      expect(am.toTex(item.input)).toMatchInlineSnapshot(
        `"${item.output.replace(/\\/g, '\\\\')}"`,
      )
    })
  })
})
