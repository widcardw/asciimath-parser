/* eslint-disable @typescript-eslint/no-use-before-define */
import type { Symbols } from './symbols'
import type { Ast } from './index'

const initGenerator = (symbols: Symbols) => {
  const genMatrix = (ast: Ast) => {
    const { value, left, right } = ast
    const maxCol = Math.max(...value.map((row: Ast[]) => row.length))
    const cols = 'c'.repeat(maxCol)
    const body = value.map((row: Ast[]) => {
      return row.map(toTex).join(' & ')
    }).join(' \\\\ ')
    return [
      '\\left',
      symbols.lp[left].tex,
      `\\begin{array}{${cols}}${body}\\end{array}`,
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

  const genParen = (ast: Ast) => {
    const { left, value, right } = ast
    return [
      '\\left',
      symbols.lp[left].tex,
      toTex(value),
      '\\right',
      symbols.rp[right].tex,
    ].join('')
  }

  const braced = (ast: Ast) => {
    if (ast.type === 'paren')
      return `{ ${toTex(ast.value)} }`
    else
      return toTex(ast)
  }

  const strip = (ast: Ast) => {
    return ast.type === 'paren' ? ast.value : ast
  }

  const genOpOA = (ast: Ast) => {
    const { value, $1 } = ast
    const res = symbols.opOA[value].tex
    return res.replace('$1', toTex(strip($1)))
  }

  const genOpOAB = (ast: Ast) => {
    const { value, $1, $2 } = ast
    const res = symbols.opOAB[value].tex
    return res.replace('$1', toTex(strip($1))).replace('$2', toTex(strip($2)))
  }

  const toTex = (ast: Ast): string => {
    if (ast === null) {
      return ''
    }
    else if (typeof ast === 'string') {
      return ast
    }
    else if (Array.isArray(ast)) {
      return ast.map(toTex).join(' ')
    }
    else {
      switch (ast.type) {
        case 'matrix': return genMatrix(ast)
        case 'number': return ast.value
        case 'lp': return ast.value
        case 'literal': return ast.value
        case 'keyword': return symbols.keyword[ast.value].tex
        case 'subsup': return genSubSup(ast)
        case 'paren': return genParen(ast)
        case 'opOA': return genOpOA(ast)
        case 'opOAB': return genOpOAB(ast)
        default: {
          console.error(ast)
          throw new Error('cannot parse')
        }
      }
    }
  }

  return toTex
}

export default initGenerator
