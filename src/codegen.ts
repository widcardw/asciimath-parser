import type { ChildNode, MatrixNode, RootNode } from './parser'
import { AlignDirection, NodeTypes } from './parser'

function getMatrixBoundary(node: MatrixNode) {
  if (node.alignment === AlignDirection.Left)
    return ['\\begin{matrix*}[l]', '\\end{matrix*}']

  return ['\\begin{matrix}', '\\end{matrix}']
}

function getArrayBoundary(node: MatrixNode) {
  const div = node.dividerIndices
  if (div.length) {
    let beginArray = '\\begin{array}{'
    for (let i = 0; i < div.length; i++)
      beginArray += `${''.padEnd(div[i] - i, 'c')}|`

    beginArray += '}'
    return [
      beginArray,
      '\\end{array}',
    ]
  }
  return ['', '']
}

function codegen(node: ChildNode | RootNode): string {
  switch (node.type) {
    case NodeTypes.Const: {
      return node.tex
    }
    case NodeTypes.Root: {
      let res = node.body.map(codegen).join('')
      if (node.body.find(n => n.type === NodeTypes.Const && n.value === '&'))
        res = `\\begin{aligned}${res}\\end{aligned}`
      return res
    }
    case NodeTypes.Flat: {
      return node.body.map(codegen).join(' ')
    }
    case NodeTypes.Matrix: {
      const [beginMatrix, endMatrix] = getMatrixBoundary(node)
      const [arrayBegin, arrayEnd] = getArrayBoundary(node)
      return [
        node.lparen,
        beginMatrix,
        arrayBegin,
        node.params.map(i => i.map(codegen).join('&')).join('\\\\'),
        arrayEnd,
        endMatrix,
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
