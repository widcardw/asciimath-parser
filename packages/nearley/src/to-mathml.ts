/* eslint-disable @typescript-eslint/no-use-before-define */
import type { SymbolConfig, Symbols, TokenTypes } from './symbols'
import type { IMathVdom } from './math-vdom'
import { MathVdom } from './math-vdom'
import type { Ast } from './index'

const initMathML = (symbols: Required<Symbols>) => {
  const getMathml = (symbol: SymbolConfig, defaultChildren: string | MathVdom[] = '') => {
    if (!symbol.mathml) {
      console.error(symbol)
      throw new Error('cannot convert to mathml: missing mathml in symbol config')
    }
    const ml = new MathVdom(symbol.mathml as IMathVdom) // make copy
    ml.children = ml.children ?? defaultChildren
    return ml
  }

  const genParen = (ast: Ast, strip = false) => {
    const { left, right, value, pipeIndex } = ast
    const res: MathVdom[] = []
    const mid = new MathVdom({ tag: 'mo', children: '\u2223' })
    const comma = new MathVdom({ tag: 'mo', children: ',' })
    value.forEach((item: Ast, index: number) => {
      if (pipeIndex?.has(index))
        res.push(mid)
      else if (index > 0)
        res.push(comma)
      const mathml = toMathML(item)
      if (mathml.tag === 'mrow' && Array.isArray(mathml.children))
        res.push(...mathml.children)
      else
        res.push(mathml)
    })
    if (pipeIndex?.has(value.length))
      res.push(mid)
    if (!strip) {
      const lp = getMathml(symbols.lp[left] || symbols.pipe[left], left.value)
      lp.children && res.unshift(lp)
      const rp = getMathml(symbols.rp[right] || symbols.pipe[right], right.value)
      rp.children && res.push(rp)
    }
    return new MathVdom({ tag: 'mrow', children: res })
  }

  const genLimits = (ast: Ast) => {
    const { value, sub, sup, $1, $2 } = ast
    const symbol = symbols.limits[value.value]
    const tag = (sub && sup) ? 'munderover' : sub ? 'munder' : 'mover'
    const children = [getMathml(symbol)]
    if (sub)
      children.push(toMathML($1, true))
    if (sup)
      children.push(toMathML($2, true))
    return new MathVdom({ tag, children })
  }

  const genSubSup = (ast: Ast) => {
    const { value, sub, sup, $1, $2 } = ast
    if (value.type === 'limits')
      return genLimits(ast)

    const limits = symbols[value.type as TokenTypes]?.[value]?.limits
    const tag = limits
      ? ((sub && sup) ? 'munderover' : sub ? 'munder' : 'mover')
      : ((sub && sup) ? 'msubsup' : sub ? 'msub' : 'msup')
    const children = [toMathML(value)]
    if (sub) {
      const { mathml } = symbols.sub[sub]
      const strip = sub === '_' && ['paren', 'matrix'].includes($1.type)
      const subml = mathml ? new MathVdom(mathml).replace('$1', toMathML($1, strip)) : toMathML($1, strip)
      children.push(subml)
    }
    if (sup) {
      const { mathml } = symbols.sup[sup]
      const strip = sup === '^' && ['paren', 'matrix'].includes($2.type)
      const supml = mathml ? new MathVdom(mathml).replace('$1', toMathML($2, strip)) : toMathML($2, strip)
      children.push(supml)
    }
    return new MathVdom({ tag, children })
  }

  const genOp = (ast: Ast) => {
    const { type, value, $1, $2 } = ast
    // TODO
    // if (value === 'verb')
    //   return genVerb(ast)
    const symbol = symbols[type as TokenTypes][value]
    const { strip = true } = symbol
    const ml = getMathml(symbol, [new MathVdom({ tag: '$1' })])
    if ($1)
      ml.replace('$1', toMathML($1, strip))
    if ($2)
      ml.replace('$2', toMathML($2, strip))
    return ml
  }

  const escapeText = (str: string) => {
    return str.replace(/\\"/g, '"').replace(/\\\\/g, '\\')
  }

  const genText = (ast: Ast, strip = false) => {
    const value = escapeText(ast.value)
    return strip ? value as any : new MathVdom({ tag: 'mtext', children: value })
  }

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

  /**
   * @param {Ast} ast nearley 生成的抽象语法树
   * @param {boolean} strip 是否去掉最外层矩阵的括号、括号表达式的括号或文本的引号
   */
  const toMathML = (ast: Ast, strip = false): MathVdom => {
    // console.dir(ast, { depth: 10 })
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
      case 'paren': return genParen(ast, strip)
      case 'text': return genText(ast, strip)
      // case 'pipe': return genPipe(ast)
      case 'number': return new MathVdom({ tag: 'mn', children: ast.value })
      case 'literal': {
        const tag = /[a-zA-Z]/.test(ast.value) ? 'mi' : ast.value.codePointAt(0) > 0x4E00 ? 'mtext' : 'mo'
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
      case 'subsup': return genSubSup(ast)
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
