import symbols, { TokenTypes } from "./symbols"

// https://github.com/no-context/moo#usage
const moo = require('moo')

const loadSymbol = (key: TokenTypes) => {
  return Object.keys(symbols[key]).sort().reverse() // 保证最长匹配
}

const main = {
  space: /[ \t]+/,
  number: /[0-9]+/,
  lp: { match: loadSymbol(TokenTypes.lp), push: 'lp' },
  rp: { match: loadSymbol(TokenTypes.rp), pop: 1 },
  pipe: { match: /\|/, push: 'pipe' },
  text: { match: /"/, push: 'text' },
  tex: { match: /tex[ \t]*"/, push: 'tex' },
  infix: /\^|_/,
  limits: loadSymbol(TokenTypes.limits),
  align: ['&', '&&'],
  opA: loadSymbol(TokenTypes.opA),
  opOAB: loadSymbol(TokenTypes.opOAB),
  opAOB: ['/'],
  opAO: ['!', '!!'],
  part: ['part', 'pp', 'dd'],
  keyword: loadSymbol(TokenTypes.keyword),
}

const lexer = moo.states({
  main: {
    ...main,
    literal: /\S/, // 放在最后, 用于捕获一切非空字符
  },
  lp: {
    ...main,
    comma: /,/,
    semicolon: /;/,
    literal: /\S/,
  },
  pipe: {
    ...main,
    pipeEnd: { match: /\|/, pop: 1 },
    literal: /\S/,
  },
  text: {
    textEsc: /\\"/,
    textEnd: { match: /"/, pop: 1 },
    literal: /.+/,
  },
  tex: {
    textEsc: /\\"/,
    texEnd: { match: /"/, pop: 1 },
    literal: /.+/,
  },
})

export default lexer
