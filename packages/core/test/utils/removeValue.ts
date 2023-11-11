import type { AlignDirection, ChildNode, RootNode } from '../../src/parser'
import { NodeTypes } from '../../src/parser'

interface Node {
  type: NodeTypes
}

interface RConstNode extends Node {
  type: NodeTypes.Const
  // value: string  <-  value should be removed
  tex: string
}

interface RRootNode extends Node {
  type: NodeTypes.Root
  body: RChildNode[]
}

interface RFlatNode extends Node {
  type: NodeTypes.Flat
  body: RChildNode[]
}

interface RParamOneNode extends Node {
  type: NodeTypes.ParamOne
  params: RChildNode
  tex: string
}

interface RParamTwoNode extends Node {
  type: NodeTypes.ParamTwo
  params: [RChildNode, RChildNode]
  tex: string
}

interface RMatrixNode extends Node {
  type: NodeTypes.Matrix
  params: RChildNode[][]
  lparen: string
  rparen: string
  alignment: AlignDirection
  dividerIndices: number[]
}

type RChildNode = RConstNode | RMatrixNode | RParamOneNode | RParamTwoNode | RFlatNode

function _removeValue(node: ChildNode): RChildNode {
  switch (node.type) {
    case NodeTypes.Const: {
      // @ts-expect-error delete property
      delete node.value
      return node as RConstNode
    }
    case NodeTypes.Flat: {
      for (const c of node.body)
        _removeValue(c)

      return node as RFlatNode
    }
    case NodeTypes.Matrix: {
      for (const row of node.params) {
        for (const col of row)
          _removeValue(col)
      }
      return node as RMatrixNode
    }
    case NodeTypes.ParamOne: {
      _removeValue(node.params)
      return node
    }
    case NodeTypes.ParamTwo: {
      _removeValue(node.params[0])
      _removeValue(node.params[1])
      return node
    }
    default: {
      throw new Error('Root node cannot be put here!')
    }
  }
}

function removeValue(root: RootNode): RRootNode {
  for (const n of root.body)
    _removeValue(n)

  return root as RRootNode
}

export type{
  RConstNode,
  RMatrixNode,
  RParamOneNode,
  RParamTwoNode,
  RFlatNode,
  RChildNode,
  RRootNode,
}

export {
  removeValue,
}
