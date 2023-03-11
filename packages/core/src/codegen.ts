import type { ChildNode, MatrixNode, RootNode } from './parser'
import { NodeTypes } from './parser'

function getArrayBoundary(node: MatrixNode) {
  const div = node.dividerIndices
  let beginArray = '\\begin{array}'
  const ch = node.alignment

  if (div.length) {
    const divMax = div[div.length - 1]
    // transform divider indices to col numbers between two divider
    // [2, 4, 5] -> [2, 2, 1]
    for (let i = div.length - 1; i >= 1; i--)
      div[i] -= div[i - 1]

    // [2, 2, 1] -> {cc|cc|c|
    beginArray += '{'
    for (let i = 0; i < div.length; i++)
      beginArray += `${ch.repeat(div[i])}|`

    // MathJax would complain if the array env arg
    // is not consistent with the number of elements of the matrix row.
    // For example, the matrix is like
    // [a, b | c;
    //  d, e | f]
    // if the array env arg is `\begin{array}{cc|}`, the bar won't render correctly.
    // Change it to `\begin{array}{cc|c}` should fix this problem.
    const maxCol = Math.max(...node.params.map(i => i.length))
    // {cc|cc|c| -> {cc|cc|c|...c}
    beginArray += `${ch.repeat(maxCol - divMax)}}`
  }
  else {
    const maxCol = Math.max(...node.params.map(c => c.length))
    beginArray += `{${ch.repeat(maxCol)}}`
  }
  return [beginArray, '\\end{array}']
}

function codegen(node: ChildNode | RootNode): string {
  switch (node.type) {
    case NodeTypes.Const: {
      return node.tex
    }
    case NodeTypes.Root: {
      let res = node.body.map(codegen).join(' ')
      if (node.body.find(n => n.type === NodeTypes.Const && (n.value === '&' || n.tex === '\\\\')))
        res = `\\begin{aligned}${res}\\end{aligned}`
      return res
    }
    case NodeTypes.Flat: {
      return node.body.map(codegen).join(' ')
    }
    case NodeTypes.Matrix: {
      const [arrayBegin, arrayEnd] = getArrayBoundary(node)
      return [
        node.lparen,
        arrayBegin,
        node.params.map(i => i.map(codegen).join(' & ')).join('\\\\'),
        '\\\\',
        arrayEnd,
        node.rparen,
      ].join(' ')
    }
    case NodeTypes.ParamOne: {
      return node.tex.replace('$1', codegen(node.params))
    }
    case NodeTypes.ParamTwo: {
      return node.tex.replace('$1', codegen(node.params[0])).replace('$2', codegen(node.params[1]))
    }
  }
}

export {
  codegen,
}
