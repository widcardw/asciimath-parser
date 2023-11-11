import { TokenTypes } from '../../src'
import { AlignDirection, NodeTypes, createConstNode, createFlatNode, createMatrixNode, createParamOneNode, createParamTwoNode, createRootNode } from '../../src/parser'
import type { RChildNode, RConstNode, RFlatNode, RMatrixNode, RParamOneNode, RParamTwoNode, RRootNode } from './removeValue'

// Alternative of function `u`
// function a(tex: string, value: string): RConstNode {
//   const n = createRConstNode()
//   n.tex = tex
//   return n
// }

function createRConstNode(): RConstNode
function createRConstNode(tex: string): RConstNode
function createRConstNode(tex?: string): RConstNode {
  if (typeof tex === 'undefined')
    tex = ''
  return { tex, type: NodeTypes.Const }
}

function createRFlatNode(): RFlatNode
function createRFlatNode(n: Exclude<RChildNode, RFlatNode>): RFlatNode
function createRFlatNode(n: RChildNode[]): RFlatNode
function createRFlatNode(n?: Exclude<RChildNode, RFlatNode> | RChildNode[]): RFlatNode {
  let body: RChildNode[] = []
  if (n) {
    if (Array.isArray(n))
      body = n

    else
      body.push(n)
  }

  return {
    type: NodeTypes.Flat,
    body,
  }
}

function createRMatrixNode(): RMatrixNode {
  return { type: NodeTypes.Matrix, params: [], lparen: '', rparen: '', alignment: AlignDirection.Center, dividerIndices: [] }
}

function createRParamOneNode(): RParamOneNode {
  return {
    type: NodeTypes.ParamOne,
    tex: '',
    params: createRFlatNode(),
  }
}

function createRParamTwoNode(): RParamTwoNode {
  return {
    type: NodeTypes.ParamTwo,
    tex: '',
    params: [createRFlatNode(), createRFlatNode()],
  }
}

function createRRootNode(): RRootNode {
  return {
    type: NodeTypes.Root,
    body: [],
  }
}

function u(tex: string): RConstNode
function u(type: TokenTypes.Const, args: string): RConstNode
function u(type: TokenTypes.StringLiteral, args: string): RConstNode
function u(type: TokenTypes.NumberLiteral, args: string): RConstNode
function u(type: TokenTypes.Text, args: string): RConstNode
function u(type: TokenTypes.OperatorOA, args: { tex: string; param: RChildNode }): RParamOneNode
function u(type: TokenTypes.OperatorMinus, args: { tex: string; param: RChildNode }): RConstNode
function u(type: TokenTypes.OperatorAOB, args: { tex: string; param1: RChildNode; param2: RChildNode }): RConstNode
function u(type: TokenTypes.OperatorAO, args: { tex: string; param: RChildNode }): RConstNode
function u(type: TokenTypes.OperatorO2, args: { tex: string; param1: RChildNode; param2: RChildNode }): RConstNode
function u(type: TokenTypes.OperatorPartial, args: { up: RChildNode; down: RChildNode }): RConstNode
function u(type: TokenTypes.OperatorSup, args: { tex: string; param: RChildNode }): RConstNode
function u(type: TokenTypes.OperatorOAB, args: { tex: string; param1: RChildNode; param2: RChildNode }): RConstNode
function u(type: TokenTypes.LParen, args: string): RConstNode
function u(type: TokenTypes.RParen, args: string): RConstNode
function u(type: TokenTypes.Paren, args: string): RConstNode
function u(type: TokenTypes.Align, args: string): RConstNode
function u(type: TokenTypes.Split, args: string): RConstNode
function u(type: TokenTypes.None, args: string): RConstNode
function u(type: TokenTypes | string, args?: string | { tex: string; param: RChildNode } | { tex: string; param1: RChildNode; param2: RChildNode } | { up: RChildNode; down: RChildNode }) {
  if (typeof args === 'undefined')
    return { type: NodeTypes.Const, tex: type }

  switch (type as TokenTypes) {
    case TokenTypes.Const:
    case TokenTypes.StringLiteral:
    case TokenTypes.NumberLiteral:
    case TokenTypes.Text:
    case TokenTypes.Align:
    case TokenTypes.Split: {
      const tex = args as string
      return { type: NodeTypes.Const, tex }
    }
    case TokenTypes.OperatorOA:
    case TokenTypes.OperatorMinus:
    case TokenTypes.OperatorAO:
    case TokenTypes.OperatorSup: {
      const n = createRParamOneNode()
      const token = args as { tex: string; param: RChildNode }
      n.tex = token.tex
      n.params = token.param
      return n
    }
    case TokenTypes.OperatorOAB:
    case TokenTypes.OperatorAOB:
    case TokenTypes.OperatorO2: {
      const n = createRParamTwoNode()
      const token = args as { tex: string; param1: RChildNode; param2: RChildNode }
      n.tex = token.tex
      n.params[0] = token.param1
      n.params[1] = token.param2
      return n
    }
    case TokenTypes.OperatorPartial: {
      const n = createRParamTwoNode()
      const token = args as { up: RChildNode; down: RChildNode }
      n.tex = '\\frac{ $1 }{ $2 }'
      n.params[0] = token.up
      n.params[1] = token.down
      return n
    }
    case TokenTypes.LParen: {
      const tex = args as string
      const n = createRConstNode()
      n.tex = `\\left${tex}`
      return n
    }
    case TokenTypes.RParen: {
      const tex = args as string
      const n = createRConstNode()
      n.tex = `\\right${tex}`
      return n
    }
    case TokenTypes.Paren: {
      const n = createRConstNode(args as string)
      return n
    }
    default: {
      throw new Error('Cannot read type!')
    }
  }
}

function lp(tex: string): RConstNode {
  if (tex === '{')
    tex = '\\lbrace'
  return createRConstNode(`\\left${tex}`)
}

function rp(tex: string): RConstNode {
  if (tex === '}')
    tex = '\\rbrace'
  return createRConstNode(`\\right${tex}`)
}

function sup(tex: '^' | '_', child: RChildNode): RParamOneNode {
  return { type: NodeTypes.ParamOne, tex: `${tex}{ $1 }`, params: child }
}

function opOA(tex: string, child: RChildNode): RParamOneNode {
  return { type: NodeTypes.ParamOne, tex, params: child }
}

function opOAB(tex: string, child1: RChildNode, child2: RChildNode): RParamTwoNode {
  return { type: NodeTypes.ParamTwo, tex, params: [child1, child2] }
}

function frac(child1: RChildNode, child2: RChildNode): RParamTwoNode {
  return opOAB('\\frac{ $1 }{ $2 }', child1, child2)
}

function flat(...nodes: RChildNode[]) {
  return createRFlatNode(nodes)
}

const DEFAULT_MAT_CONFIG = {
  l: '[',
  r: ']',
  dividerIndices: [],
  alignment: AlignDirection.Center,
}

function mat(m: RChildNode[][], config?: {
  l?: string
  r?: string
  dividerIndices?: number[]
  alignment?: AlignDirection
}) {
  const matrix = createRMatrixNode()
  matrix.dividerIndices = config?.dividerIndices || DEFAULT_MAT_CONFIG.dividerIndices
  matrix.lparen = `\\left${config?.l || DEFAULT_MAT_CONFIG.l}`
  matrix.rparen = `\\right${config?.r || DEFAULT_MAT_CONFIG.r}`
  matrix.alignment = config?.alignment || DEFAULT_MAT_CONFIG.alignment
  matrix.params = m
  return matrix
}

function root(...nodes: RChildNode[]) {
  const n = createRRootNode()
  n.body = nodes
  return n
}

export {
  // a,
  u,
  flat,
  mat,
  root,
  lp, rp, sup,
  opOA, opOAB,
  frac,
}
