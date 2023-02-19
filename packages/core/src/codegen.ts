import type { ChildNode, MatrixNode, RootNode } from './parser'
import { AlignDirection, NodeTypes } from './parser'

function getArrayBoundary(node: MatrixNode) {
  const div = node.dividerIndices
  let beginArray = '\\begin{array}'
  let ch = 'c'
  if (node.alignment === AlignDirection.Left)
    ch = 'l'

  if (div.length) {
    const divMax = div[div.length - 1]
    for (let i = div.length - 1; i >= 1; i--)
      div[i] -= div[i - 1]

    beginArray += '{'
    for (let i = 0; i < div.length; i++)
      beginArray += `${''.padEnd(div[i], ch)}|`

    // MathJax would complain if the array env arg
    // is not consistent with the elements of the matrix.
    const maxCol = Math.max(...node.params.map(i => i.length))
    beginArray += `${''.padEnd(maxCol - divMax, ch)}}`
  }
  else {
    const maxCol = Math.max(...node.params.map(c => c.length))
    beginArray += '{' + ''.padEnd(maxCol, ch) + '}'
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
      if (node.body.find(n => n.type === NodeTypes.Const && n.value === '&'))
        res = `\\begin{aligned}${res}\\end{aligned}`
      return res
    }
    case NodeTypes.Flat: {
      return node.body.map(codegen).join(' ')
    }
    case NodeTypes.Matrix: {
      // const [beginMatrix, endMatrix] = getMatrixBoundary(node)
      const [arrayBegin, arrayEnd] = getArrayBoundary(node)
      return [
        node.lparen,
        // beginMatrix,
        arrayBegin,
        node.params.map(i => i.map(codegen).join('&')).join('\\\\'),
        '\\\\',
        arrayEnd,
        // endMatrix,
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
