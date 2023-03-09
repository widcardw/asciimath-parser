// https://github.com/no-context/moo#usage
import moo from './moo.esm.js'
import { TokenTypes } from './symbols'
import type { Symbols } from './symbols'

const initLexer = (symbols: Symbols) => {
  const loadSymbol = (key: TokenTypes) => {
    return Object.keys(symbols[key]).sort().reverse() // 保证最长匹配
  }

  const main = {
    keyword: loadSymbol(TokenTypes.keyword),
    space: /[ \t]+/,
    number: /[0-9]+\.[0-9]+|[0-9]+/,
    lp: { match: loadSymbol(TokenTypes.lp), push: 'lp' },
    rp: { match: loadSymbol(TokenTypes.rp), pop: 1 },
    pipe: { match: /\|/, push: 'pipe' },
    text: { match: /"/, push: 'text' },
    tex: { match: /tex[ \t]*"/, push: 'tex' },
    color: { match: /color[ \t]*\(/, push: 'color' },
    infix: /\^|_/,
    limits: loadSymbol(TokenTypes.limits),
    opOA: loadSymbol(TokenTypes.opOA),
    opOAB: loadSymbol(TokenTypes.opOAB),
    align: ['&&', '&'],
    part: ['part', 'pp', 'dd'],
    opAO: ['!!', '!'],
    opAOB: ['/'],
  }

  return moo.states({
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
      literal: /[^"\n]+/,
    },
    tex: {
      textEsc: /\\"/,
      texEnd: { match: /"/, pop: 1 },
      literal: /[^"\n]+/,
    },
    color: {
      colorEnd: { match: /\)/, pop: 1 },
      literal: /[^)\n]+/,
    },
  })
}

export default initLexer
