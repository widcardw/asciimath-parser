import symbols from './symbols'

type Ast = any

const genMatrix = (ast: Ast) => {
  const maxCol = Math.max(...ast.value.map((row: Ast[]) => row.length))
  const cols = 'c'.repeat(maxCol)
  const body = ast.value.map((row: Ast[]) => {
    return row.map(toTex).join(' & ')
  }).join(' \\\\ ')
  return `\\begin{array}[${cols}]${body}\\end{array}`
}

const genInfix = (ast: Ast) => {
  const { sub, sup } = ast
  let res = toTex(ast.value)
  if (sub) res += '_' + toTex(sub)
  if (sup) res += '^' + toTex(sup)
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

const toTex = (ast: Ast): string => {
  if (typeof ast === 'string') {
    return ast
  } else if (Array.isArray(ast)) {
    return ast.map(toTex).join(' ')
  } else {
    switch (ast.type) {
      case 'matrix': return genMatrix(ast)
      case 'number': return ast.value
      case 'lp': return ast.value
      case 'literal': return ast.value
      case 'keyword': return symbols.keyword[ast.value].tex
      case 'infix': return genInfix(ast)
      case 'paren': return genParen(ast)
      default: throw ast
    }
  }
}

export default toTex
