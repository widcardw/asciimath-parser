/* eslint-disable @typescript-eslint/no-use-before-define */
import type { Symbols, TokenTypes } from './symbols'
import { MathVdom } from './math-vdom'
import type { Ast } from './index'

const initMathML = (symbols: Required<Symbols>) => {
  const genAm = (ast: Ast) => {
    const { value } = ast
    const aligned = value.length > 1
    const children = value.map((v: Ast) => toMathML(v))
    if (aligned) {
      return new MathVdom({
        tag: 'TODO',
        children: '',
      })
    }
    else if (children[0] instanceof MathVdom) {
      return children[0]
    }
    else {
      return new MathVdom({
        tag: 'mrow',
        children: children[0] || '',
      })
    }
  }

  const genOp = (ast: Ast) => {
    const { type, value, $1, $2 } = ast
    // TODO
    // if (value === 'verb')
    //   return genVerb(ast)
    const symbol = symbols[type as TokenTypes][value]
    const { mathml, strip = true } = symbol
    if (mathml === undefined) {
      console.error(symbol)
      throw new Error('cannot convert to mathml')
    }
    const ml = new MathVdom(mathml) // copy
    if (!ml.children)
      ml.children = [new MathVdom({ tag: '$1' })]
    const convert = (ast: Ast) => toMathML(ast, strip)
    if ($1)
      ml.replace('$1', $1, convert)
    if ($2)
      ml.replace('$2', $2, convert)
    return ml
  }

  /**
   * @param {Ast} ast nearley 生成的抽象语法树
   * @param {boolean} strip 是否去掉最外层矩阵的括号、括号表达式的括号或文本的引号
   */
  const toMathML = (ast: Ast, strip = false): MathVdom => {
    // console.log(ast)
    if (ast === null)
      return new MathVdom({ tag: 'mrow' })
    if (typeof ast === 'string')
      return new MathVdom({ tag: 'mrow', children: ast })
    if (ast instanceof MathVdom)
      return ast
    if (Array.isArray(ast)) {
      // strip outer mrow, is this correct?
      if (ast.length === 1)
        return toMathML(ast[0])
      return new MathVdom({ tag: 'mrow', children: ast.map(v => toMathML(v)) })
    }
    switch (ast.type) {
      // TODO
      // case 'matrix': return genMatrix(ast, strip)
      // case 'paren': return genParen(ast, strip)
      // case 'text': return genText(ast, strip)
      // case 'pipe': return genPipe(ast)
      case 'number': return new MathVdom({ tag: 'mn', children: ast.value })
      case 'literal': {
        const tag = (/^[A-Za-z]$/.test(ast.value)) ? 'mi' : 'mtext'
        return new MathVdom({ tag, children: ast.value })
      }
      case 'lp': case 'limits': case 'align':
        return new MathVdom({ tag: 'mo', children: ast.value })
      case 'keyword': {
        const symbol = symbols.keyword[ast.value]
        return new MathVdom({
          tag: symbol.mathml?.tag || 'mtext',
          attr: symbol.mathml?.attr,
          children: symbol.mathml?.children || ast.value,
        })
      }
      // case 'subsup': return genSubSup(ast)
      case 'opOA': case 'opAO': case 'opOAB': case 'opAOB': return genOp(ast)
      // case 'part': return genPart(ast)
      case 'am': return genAm(ast)
      // case 'verb': return genVerb(ast)
      default: {
        console.error(ast)
        throw new Error('cannot parse')
      }
    }
  }

  const genMathML = (ast: Ast): MathVdom => {
    return new MathVdom({
      tag: 'math',
      children: [toMathML(ast)],
    })
  }

  return genMathML
}

export default initMathML
