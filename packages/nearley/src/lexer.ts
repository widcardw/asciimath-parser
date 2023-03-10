// https://github.com/no-context/moo#usage
import moo from './moo.esm.js'
import { TokenTypes } from './symbols'
import type { Symbols } from './symbols'

const initLexer = (symbols: Symbols) => {
  const loadSymbol = (key: TokenTypes) => {
    return Object.keys(symbols[key]) // .sort().reverse() // 保证最长匹配
  }

  const keywords = {
    keyword: loadSymbol(TokenTypes.keyword), // 即原版 am 的 const
    subsup: loadSymbol(TokenTypes.subsup), // 上下标
    limits: loadSymbol(TokenTypes.limits), // 箭头上下叠合
    opOA: loadSymbol(TokenTypes.opOA), // 一元操作符
    opOAB: loadSymbol(TokenTypes.opOAB),
    align: loadSymbol(TokenTypes.align),
    part: loadSymbol(TokenTypes.part),
    opAO: loadSymbol(TokenTypes.opAO),
    opAOB: loadSymbol(TokenTypes.opAOB),
  }

  const main = {
    newline: { match: '\n', lineBreaks: true },
    space: /[ \t]+/,
    number: /[0-9]+\.[0-9]+|[0-9]+/,
    text: { match: /"/, push: 'text' },
    // pipe: { match: loadSymbol(TokenTypes.pipe), push: 'pipe' },
    pipe: loadSymbol(TokenTypes.pipe),
    lp: { match: loadSymbol(TokenTypes.lp), push: 'lp' },
    rp: { match: loadSymbol(TokenTypes.rp), pop: 1 },
    keyword: {
      match: Object.values(keywords).flat(),
      type: moo.keywords(keywords),
    },
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
    // pipe: {
    //   pipeEnd: { match: /\|/, pop: 1 },
    //   ...main,
    //   literal: /\S/,
    // },
    text: {
      textEnd: { match: /"/, pop: 1 },
      /**
       * 匹配一个非空串，允许包含所有非换行的字符，即 /.+/
       * 但是，串里面的双引号必须紧跟在反斜杠后面，即 \"
       * 比如下面这个串满足条件:
       * ab\"c
       * 下面这个不满足，因为 " 没有紧跟在 \ 后面:
       * ab"c
       */
      textContent: /(?:\\"|[^\n"])+/,
    },
  })
}

export default initLexer
