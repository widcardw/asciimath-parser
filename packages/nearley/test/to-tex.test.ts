import { describe, expect, it } from 'vitest'
import Nearley from 'nearley'
import toTex from '../src/to-tex'
import grammar from '../src/parser.js'
import lexer from '../src/lexer'

const examples: { input: string, output: string, desc?: string }[] = [
  { input: 'a', output: 'a' },
  { input: '+', output: '+' },
  { input: 'pi', output: '\\pi' },
  { input: '1+2+3', output: '1 + 2 + 3' },
  { input: '1+-2', output: '1 \\pm 2' },
  { input: '(1+2]', output: '\\left(1 + 2\\right]' },
  { input: 'sin 11_4^514 19^19_8 1_0', output: '\\sin 11_4^514 19_8^19 1_0' },
  { input: '[a;b;c]', output: '\\begin{array}[c]a \\\\ b \\\\ c\\end{array}' },
  { input: '[a, b; c, d;]', output: '\\begin{array}[cc]a & b \\\\ c & d\\end{array}' },
]

const am2tex = (input: string) => {
  const parser = new Nearley.Parser(Nearley.Grammar.fromCompiled(grammar))
  parser.feed(input)
  if (parser.results.length !== 1) {
    console.log(parser.results)
    throw new Error('invalid possible parses: ' + parser.results.length)
  }
  return toTex(parser.results)
}

// describe('test lexer', () => {
//   lexer.reset('[a;b;c]')
//   let res = lexer.next()
//   console.log(res)
//   while (res) {
//     res = lexer.next()
//     console.log(res)
//   }
// })

describe('test to-tex', () => {
  examples.forEach((item, index) => {
    it(`#${index} ${item.desc} ${item.input}`, () => {
      expect(am2tex(item.input)).toMatchInlineSnapshot(
        '"' + item.output.replace(/\\/g, '\\\\') + '"'
      )
    })
  })
})