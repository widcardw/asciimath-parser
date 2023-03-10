/* eslint-disable @typescript-eslint/no-use-before-define */
import type { Symbols } from './symbols'
import type { Ast } from './index'

const initGenerator = (symbols: Symbols) => {
  const genMatrix = (ast: Ast, strip = false) => {
    const { value, left, right } = ast
    const maxCol = Math.max(...value.map((row: Ast[]) => row.length))
    const cols = 'c'.repeat(maxCol)
    const body = value.map((row: Ast[]) => {
      return row.map(v => toTex(v)).join(' & ')
    }).join(' \\\\ ')
    const res = `\\begin{array}{${cols}}${body}\\end{array}`
    if (strip)
      return res
    return [
      '\\left',
      symbols.lp[left].tex,
      res,
      '\\right',
      symbols.rp[right].tex,
    ].join('')
  }

  const genSubSup = (ast: Ast) => {
    const { sub, sup } = ast
    let res = toTex(ast.value)
    if (sub)
      res += `_${braced(sub)}`
    if (sup)
      res += `^${braced(sup)}`
    return res
  }

  const genParen = (ast: Ast, strip = false) => {
    const { left, value, right } = ast
    const res = toTex(value)
    if (strip)
      return res
    return [
      '\\left',
      symbols.lp[left].tex,
      res,
      '\\right',
      symbols.rp[right].tex,
    ].join('')
  }

  const braced = (ast: Ast) => {
    return (['paren', 'matrix'].includes(ast.type) || (ast.type === 'number' && ast.value.length > 1))
      ? `{ ${toTex(ast, true)} }`
      : toTex(ast)
  }

  const genOpOA = (ast: Ast) => {
    const { value, $1 } = ast
    const res = symbols.opOA[value].tex
    return res.replace('$1', toTex($1, true))
  }

  const genOpOAB = (ast: Ast) => {
    const { value, $1, $2 } = ast
    const res = symbols.opOAB[value].tex
    return res.replace('$1', toTex($1, true)).replace('$2', toTex($2, true))
  }

  const genText = (ast: Ast, strip = false) => {
    const value = ast.value.replace(/\\"/g, '"')
    return strip ? value : `\\text{${value}}`
  }

  // 偏微分
  const genPart = (ast: Ast) => {
    const { value, exp, sup, sub } = ast
    const symbol = symbols.part[value].tex
    const expStr = exp ? `^${toTex(exp)}` : ''
    const supStr = `${symbol + expStr} ${toTex(sup)}`

    // 偏微分分母的一项
    const genSubGroup = (ast: Ast) => {
      return `${symbol} ${toTex(ast)}`
    }

    // 偏微分的分母部分
    let subStr
    if (sub.type === 'paren') {
      if (Array.isArray(sub.value))
        subStr = sub.value.map(genSubGroup).join('') // 这里不带指数
      else
        subStr = genSubGroup(sub.value) + expStr // 这里带指数
    }
    else {
      subStr = genSubGroup(sub) + expStr // 这里带指数
    }

    return `\\frac{ ${supStr} }{ ${subStr} }`
  }

  const genPipe = (ast: Ast) => {
    const { value, left, right } = ast
    const res = toTex(value)
    return [
      '\\left',
      symbols.pipe[left].tex,
      res,
      '\\right',
      symbols.pipe[right].tex,
    ].join('')
  }

  /**
   * @param {Ast} ast nearley 生成的抽象语法树
   * @param {boolean} strip 是否去掉最外层矩阵的括号、括号表达式的括号或文本的引号
   */
  const toTex = (ast: Ast, strip = false): string => {
    if (ast === null)
      return ''
    if (typeof ast === 'string')
      return ast
    if (Array.isArray(ast))
      return ast.map(v => toTex(v)).join(' ')
    switch (ast.type) {
      case 'matrix': return genMatrix(ast, strip)
      case 'paren': return genParen(ast, strip)
      case 'text': return genText(ast, strip)
      case 'pipe': return genPipe(ast)
      case 'number': return ast.value
      case 'lp': return ast.value
      case 'literal': return ast.value
      case 'keyword': return symbols.keyword[ast.value].tex
      case 'subsup': return genSubSup(ast)
      case 'opOA': return genOpOA(ast)
      case 'opOAB': return genOpOAB(ast)
      case 'part': return genPart(ast)
      default: {
        console.error(ast)
        throw new Error('cannot parse')
      }
    }
  }

  return toTex
}

export default initGenerator
