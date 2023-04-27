import { describe, expect, it } from 'vitest'
import { MathVdom } from '../src/to-mathml'
import * as AmNearley from '../src/index'
import { examples } from './examples'

/*
describe('mathml toString', () => {
  const mathml = new MathVdom({
    tag: 'math',
    attr: {
      displaystyle: 'true',
    },
    children: [
      {
        tag: 'mrow',
        children: [
          {
            tag: 'mrow',
            children: [
              { tag: 'mi', children: 'x' },
              { tag: 'mo', children: '+' },
              { tag: 'mi', children: 'y' },
            ],
          },
          { tag: 'mo', children: '=' },
          { tag: 'mn', children: '2' },
        ],
      },
    ],
  })
  it('mathml toString', () => {
    expect(String(mathml)).toBe('<math displaystyle="true"><mrow><mrow><mi>x</mi><mo>+</mo><mi>y</mi></mrow><mo>=</mo><mn>2</mn></mrow></math>')
  })
})
*/

describe('test nearley to-mathml', () => {
  const am = new AmNearley.AsciiMath({ display: false })
  examples.forEach((item, index) => {
    if (item.mathml === undefined)
      return
    // traceLex(item.input, am.lexer)
    it(`#${index} ${item.desc ? `[${item.desc}] ` : ''}${item.input}`, () => {
      expect(String(am.toMathML(item.input))).toBe(`<math><mrow>${item.mathml}</mrow></math>`)
    })
  })
})
