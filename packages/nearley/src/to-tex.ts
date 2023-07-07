/* eslint-disable @typescript-eslint/no-use-before-define */
import type { Symbols, TokenTypes } from './symbols'
import type { Ast } from './index'

const initGenerator = (symbols: Required<Symbols>) => {
  const genMatrix = (ast: Ast, strip = false) => {
    const { value, left, right, pipeIndex } = ast
    const maxCol = Math.max(...value.map((row: Ast[]) => row.length))
    // 分段函数表达式向左对齐, 其它情况居中对齐
    const alignType = (left.value === '{' && right.value === ':}') ? 'l' : 'c'
    const cols = alignType.repeat(maxCol).split('')
    const colsBuf = []
    cols.forEach((col, index) => {
      if (pipeIndex?.has(index))
        colsBuf.push('|')
      colsBuf.push(col)
    })
    if (pipeIndex?.has(cols.length))
      colsBuf.push('|')

    const body = value.map((row: Ast[]) => {
      return row.map(v => toTex(v)).join(' & ')
    }).join(' \\\\ ')
    const res = `\\begin{array}{${colsBuf.join('')}}${body}\\end{array}`
    if (strip && symbols.lp[left] && symbols.rp[right])
      return res
    return [
      '\\left',
      (symbols.lp[left] || symbols.pipe[left]).tex,
      res,
      '\\right',
      (symbols.rp[right] || symbols.pipe[right]).tex,
    ].join('')
  }

  const genParen = (ast: Ast, strip = false) => {
    const { left, right, value, pipeIndex } = ast
    const res: string[] = []
    let isLeft = true
    let lastPipeIndex = -1
    value.forEach((item: Ast, index: number) => {
      // try best to match \left| with \right|
      if (pipeIndex?.has(index)) {
        res.push(isLeft ? '\\left|' : '\\right|')
        isLeft = !isLeft
        lastPipeIndex = res.length - 1
      }
      else if (index > 0) {
        res.push(', ')
      }
      res.push(toTex(item))
    })
    if (pipeIndex?.has(value.length)) {
      res.push(isLeft ? '\\left|' : '\\right|')
      isLeft = !isLeft
      lastPipeIndex = res.length - 1
    }
    // the unmatched one is changed to \mid instead
    if (lastPipeIndex > -1)
      res[lastPipeIndex] = ' \\mid '

    if (strip && symbols.lp[left] && symbols.rp[right])
      return res.join('')
    return [
      '\\left',
      (symbols.lp[left] || symbols.pipe[left]).tex,
      ...res,
      '\\right',
      (symbols.rp[right] || symbols.pipe[right]).tex,
    ].join('')
  }

  const braced = (ast: Ast) => {
    if (['paren', 'matrix'].includes(ast.type)
      || (ast.type === 'number' && ast.value.length > 1)
    )
      return `{ ${toTex(ast, true)} }`
    return toTex(ast)
  }

  const genLimits = (ast: Ast) => {
    const { value, sub, sup, $1, $2 } = ast
    const res = symbols.limits[value.value].tex
    const tex1 = sub ? toTex($1, true) : ''
    const tex2 = sup ? toTex($2, true) : ''
    return res.replace('$1', tex1)
      .replace('$2', tex2)
  }

  const genSubSup = (ast: Ast) => {
    const { value, sub, sup, $1, $2 } = ast
    if (value.type === 'limits')
      return genLimits(ast)

    let res = toTex(value)
    if (sub)
      res += symbols.sub[sub].tex.replace('$1', sub === '_' ? braced($1) : toTex($1))
    if (sup)
      res += symbols.sup[sup].tex.replace('$1', sup === '^' ? braced($2) : toTex($2))
    return res
  }

  const genOp = (ast: Ast) => {
    const { type, value, $1, $2 } = ast
    if (value === 'verb')
      return genVerb(ast)
    const symbol = symbols[type as TokenTypes][value]
    let { tex, strip = true } = symbol
    if ($1)
      tex = tex.replace('$1', toTex($1, strip))
    if ($2)
      tex = tex.replace('$2', toTex($2, strip))
    return tex
  }

  const escapeText = (str: string): string => {
    return str.slice(0, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\')
  }

  const genText = (ast: Ast, strip = false) => {
    const value = escapeText(ast.value)
    return strip ? value : `\\text{${value}}`
  }

  // 偏微分
  const genPart = (ast: Ast) => {
    const { value, exp, sup, sub } = ast
    const symbol = symbols.part[value].tex
    const expStr = exp ? `^${toTex(exp)}` : ''
    const supStr = `${symbol + expStr} ${toTex(sup, true)}`

    // 偏微分分母的一项
    const genSubGroup = (ast: Ast) => {
      return `${symbol} ${toTex(ast)}`
    }

    // 偏微分的分母部分
    let subStr
    if (sub.type === 'paren') {
      if (Array.isArray(sub.value[0]))
        subStr = sub.value[0].map(genSubGroup).join('') // 这里不带指数
      else
        subStr = genSubGroup(sub.value[0]) + expStr // 这里带指数
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

  const genAm = (ast: Ast) => {
    const { value } = ast
    const aligned = value.length > 1
    const res = value.map((v: Ast) => toTex(v))
    return aligned ? `\\begin{aligned}${res.join(' \\\\ ')}\\end{aligned}` : res[0]
  }

  // const escapeTex = (tex: string): string => {
  //   return tex.split('\\').map((s) => {
  //     return s.replace(/[{}]/g, '\\$&')
  //       .replace(/~/g, '\\textasciitilde{}')
  //       .replace(/\^/g, '\\textasciicircum{}')
  //       .replace(/[#$%&_ ]/g, '\\$&')
  //   }).join('\\textbackslash{}')
  // }

  // verbatim
  const genVerb = (ast: Ast) => {
    const { $1 } = ast
    return [
      '\\begin{aligned}\n& \\verb|',
      escapeText($1.value).replace(/\|/g, '|\\verb%|%\\verb|').replace(/\n/g, '|\\\\\n& \\verb|'),
      '|\n\\end{aligned}',
    ].join('')
    // return [
    //   '\\begin{aligned}\n& \\texttt{',
    //   escapeTex(escapeText($1.value)).split('\n').join('}\\\\\n& \\texttt{'),
    //   '}\n\\end{aligned}',
    // ].join('')
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
      case 'number': case 'lp': case 'literal': case 'limits': case 'align':
        return ast.value
      case 'keyword': return symbols.keyword[ast.value].tex
      case 'subsup': return genSubSup(ast)
      case 'opOA': case 'opAO': case 'opOAB': case 'opAOB': return genOp(ast)
      case 'part': return genPart(ast)
      case 'am': return genAm(ast)
      case 'verb': return genVerb(ast)
      default: {
        console.error(ast)
        throw new Error('cannot parse')
      }
    }
  }

  return toTex
}

export default initGenerator
