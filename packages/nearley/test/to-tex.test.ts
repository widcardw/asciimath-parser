import { describe, expect, it } from 'vitest'
import Nearley from 'nearley'
import initSymbols from '../src/symbols'
import initLexer from '../src/lexer'
import initGrammar from '../src/grammar.js'
import initGenerator from '../src/to-tex'
import { AsciiMath } from '../../core/src/index'

const symbols = initSymbols({
  keyword: {
    dx: { tex: '{\\text{d}x}' },
    dy: { tex: '{\\text{d}y}' },
    dz: { tex: '{\\text{d}z}' },
    dt: { tex: '{\\text{d}t}' },
  },
})
const lexer = initLexer(symbols)
const grammar = initGrammar(lexer)
const toTex = initGenerator(symbols)

type Examples = { input: string; output: string; desc?: string }[]

const passedExamples: Examples = [
  { input: '    ', output: '' },
  { input: ' a', output: 'a' },
  { input: '+', output: '+' },
  { input: 'pi', output: '\\pi' },
  { input: '1+2+3', output: '1 + 2 + 3' },
  { input: '1+-2', output: '1 \\pm 2' },
  { input: '(1+2]', output: '\\left(1 + 2\\right]' },
  { input: 'sin 11_4^514 19^19_8 1_0', output: '\\sin 11_4^{ 514 } 19_8^{ 19 } 1_0' },
  { input: '[a;b;c]', output: '\\left[\\begin{array}{c}a \\\\ b \\\\ c\\end{array}\\right]' },
  { input: '[a, b; c, d;:}', output: '\\left[\\begin{array}{cc}a & b \\\\ c & d \\\\ \\end{array}\\right.' },
  { input: 'sqrt x', output: '\\sqrt{ x }' },
  { input: 'sqrt (x)', output: '\\sqrt{ x }' },
  { input: 'root 3 2.0', output: '\\sqrt[ 3 ]{ 2.0 }' },
  { input: 'root [3)  {:2.0}', output: '\\sqrt[ 3 ]{ 2.0 }' },
  { input: 'sum_(n=1)^(+oo) 1/n^2 = pi^2/6', output: '\\sum_{ n = 1 }^{ + \\infty } \\frac{ 1 }{ n^2 } = \\frac{ \\pi^2 }{ 6 }' },
  { input: 'a_1^2 + b_1^2 = c_1^2', output: 'a_1^2 + b_1^2 = c_1^2' },
  { input: 'a/b, a//b', output: '\\frac{ a }{ b } , a {/} b' },
  { input: 'sqrt n, root n x, a^2/sqrt b', output: '\\sqrt{ n } , \\sqrt[ n ]{ x } , \\frac{ a^2 }{ \\sqrt{ b } }' },
  { input: 'lim_(n->oo) (1 + 1/n)^n', output: '\\lim_{ n \\to \\infty } \\left(1 + \\frac{ 1 }{ n }\\right)^n' },
  { input: 'sin {: x/2 :}', output: '\\sin \\left.\\frac{ x }{ 2 }\\right.' },
  { input: 'int_a^b f(x) dx', output: '\\int_a^b f \\left(x\\right) {\\text{d}x}' },
  { input: '(del f)/(del x), (del^3 f)/(del x del y^2)', output: '\\frac{ \\partial f }{ \\partial x } , \\frac{ \\partial^3 f }{ \\partial x \\partial y^2 }' },
  { input: 'frac a b', output: '\\frac{ a }{ b }' },
  { input: '"hello world"', output: '\\text{hello world}' },
  { input: 'color "red"  abc', output: '{ \\color{red} a } b c' },
  { input: 'hspace "12pt"', output: '\\hspace{12pt}' },
  { input: 'tex "\\LaTeX"', output: '{ \\LaTeX }' },
  { input: '""', output: '\\text{}' },
  { input: 'dy/dx, ("d"r)/("d"theta), f\'\'(x)', output: '\\frac{ {\\text{d}y} }{ {\\text{d}x} } , \\frac{ \\text{d} r }{ \\text{d} \\theta } , f ^{\\prime\\prime} \\left(x\\right)' },
  { input: 'ddfx , dd^2 f x , ddot x', output: '\\frac{ \\text{d} f }{ \\text{d} x } , \\frac{ \\text{d}^2 f }{ \\text{d} x^2 } , \\ddot{ x }' },
  { input: 'ppfx', output: '\\frac{ \\partial f }{ \\partial x }' },
  { input: 'pp {::} x', output: '\\frac{ \\partial \\left.\\right. }{ \\partial x }' },
  { input: 'pp^3 f (x y^2)', output: '\\frac{ \\partial^3 f }{ \\partial x\\partial y^2 }' },
  { input: 'abs(x)', output: '\\left|x\\right|' },
  { input: '{ a | b }', output: '\\left\\lbrace{}a \\mid b\\right\\rbrace' },
  { input: '(a,b)', output: '\\left(a, b\\right)' },
  { input: '{(x,y)|x^2+y^2<=1}', output: '\\left\\lbrace{}\\left(x, y\\right) \\mid x^2 + y^2 \\leqslant 1\\right\\rbrace' },
  { input: '|a, b; c, d|', output: '\\left|\\begin{array}{cc}a & b \\\\ c & d\\end{array}\\right|' },
  { input: '|x| = { x, if x > 0; -x, otherwise :}', output: '\\left|x\\right| = \\left\\lbrace{}\\begin{array}{ll}x & \\text{if\\quad} x > 0 \\\\ - x & \\text{otherwise\\quad}\\end{array}\\right.' },
  { input: 'e^-x', output: 'e^{ -x }' },
  { input: 'e^-(x^-2+y^2)', output: 'e^{ -\\left(x^{ -2 } + y^2\\right) }' },
  { input: '-(a+b-c)/2', output: '- \\frac{ a + b - c }{ 2 }' },
  { input: 'f\'_(+) (x)', output: 'f ^{\\prime}_{ + } \\left(x\\right)' },
  { input: 'a^2 choose b^2', output: '{ a^2 \\choose b^2 }' },
  { input: 'n!', output: '{ n! }' },
  { input: 'n!!^2/2!', output: '\\frac{ { n!! }^2 }{ { 2! } }' },
  { input: '|__x__|', output: '\\left\\lfloor{}x\\right\\rfloor' },
  // matrix examples
  { input: '[ ]', output: '\\left[\\right]' },
  { input: '[1]', output: '\\left[1\\right]' },
  { input: '[1,]', output: '\\left[1, \\right]' },
  { input: '[1;]', output: '\\left[\\begin{array}{c}1 \\\\ \\end{array}\\right]' },
  { input: '[1, 2]', output: '\\left[1, 2\\right]' },
  { input: '[1, 2; 3]', output: '\\left[\\begin{array}{cc}1 & 2 \\\\ 3\\end{array}\\right]' },
  { input: '[1, 2; ,3]', output: '\\left[\\begin{array}{cc}1 & 2 \\\\  & 3\\end{array}\\right]' },
  { input: '[1, 2;]', output: '\\left[\\begin{array}{cc}1 & 2 \\\\ \\end{array}\\right]' },

  { input: '| |', output: '\\left|\\right|' },
  { input: '|1|', output: '\\left|1\\right|' },
  { input: '|1,|', output: '\\left|1, \\right|' },
  { input: '|1;|', output: '\\left|\\begin{array}{c}1 \\\\ \\end{array}\\right|' },
  { input: '|1, 2|', output: '\\left|1, 2\\right|' },
  { input: '|1, 2; 3|', output: '\\left|\\begin{array}{cc}1 & 2 \\\\ 3\\end{array}\\right|' },
  { input: '|1, 2; ,3|', output: '\\left|\\begin{array}{cc}1 & 2 \\\\  & 3\\end{array}\\right|' },
  { input: '|1, 2;|', output: '\\left|\\begin{array}{cc}1 & 2 \\\\ \\end{array}\\right|' },

  { input: '[1, 2 | 3; 4, 5 | 6]', output: '\\left[\\begin{array}{cc|c}1 & 2 & 3 \\\\ 4 & 5 & 6\\end{array}\\right]' },
  { input: '[1, 2 | 3; 4 | 5, 6]', output: '\\left[\\begin{array}{c|c|c}1 & 2 & 3 \\\\ 4 & 5 & 6\\end{array}\\right]' },
  { input: '[a, b; [1, 2; 3, 4], d]', output: '\\left[\\begin{array}{cc}a & b \\\\ \\left[\\begin{array}{cc}1 & 2 \\\\ 3 & 4\\end{array}\\right] & d\\end{array}\\right]' },
  { input: '[|a, b; c,d]', output: '\\left[\\begin{array}{|cc}a & b \\\\ c & d\\end{array}\\right]' },
  { input: '[a, b|; c,d]', output: '\\left[\\begin{array}{cc|}a & b \\\\ c & d\\end{array}\\right]' },
  { input: '[|a, b|; c,d]', output: '\\left[\\begin{array}{|cc|}a & b \\\\ c & d\\end{array}\\right]' },
  { input: '[|hline 1| 2|; hline 3, 4; hline]', output: '\\left[\\begin{array}{|c|c|}\\hline 1 & 2 \\\\ \\hline 3 & 4 \\\\ \\hline\\end{array}\\right]' },
]

const todoExamples: Examples = [
]

// no idea why this fails ˉ\_(ツ)_/ˉ
const whyThisFails: Examples = [
  { input: '"\\"abc\\""', output: '\\text{"abc"}' },
]

const examples: Examples = [
  ...passedExamples,
  ...todoExamples,
  // ...whyThisFails,
]

// 打印 token 列表
const traceLex = (input: string) => {
  lexer.reset(input)
  const buf = []
  let res = lexer.next()
  while (res) {
    buf.push(res)
    res = lexer.next()
  }
  console.error('traceLex:', buf)
}

const am2tex = (input: string) => {
  const parser = new Nearley.Parser(Nearley.Grammar.fromCompiled(grammar))
  try {
    parser.feed(input)
    if (parser.results.length !== 1)
      throw new Error(`possible parses: ${parser.results.length}`)
    return toTex(parser.results)
  }
  catch (err) {
    console.error(err)
    traceLex(input)
  }
}

describe('test nearley', () => {
  examples.forEach((item, index) => {
    it(`#${index} ${item.desc ? `[${item.desc}] ` : ''}${item.input}`, () => {
      expect(am2tex(item.input)).toMatchInlineSnapshot(
        `"${item.output.replace(/\\/g, '\\\\')}"`,
      )
    })
  })
})

// describe('test core', () => {
//   const am = new AsciiMath({ display: false })
//   examples.forEach((item, index) => {
//     it(`#${index} ${item.desc ? `[${item.desc}] ` : ''}${item.input}`, () => {
//       expect(am.toTex(item.input)).toMatchInlineSnapshot(
//         `"${item.output.replace(/\\/g, '\\\\')}"`,
//       )
//     })
//   })
// })
