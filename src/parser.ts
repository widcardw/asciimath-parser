import { TokenTypes } from './symbols'
import type { TokenizedValue } from './trie'

enum NodeTypes {
  Root = 'Root',
  Const = 'Const',
  ParamOne = 'ParamOne', // expression with one param
  ParamTwo = 'ParamTwo', // expression with two params
  Matrix = 'Matrix', // in fact it represents all braced expressions
  Flat = 'Flat',
}

enum AlignDirection {
  Left = 'Left',
  Center = 'Center',
}

interface Node {
  type: NodeTypes
}

interface ConstNode extends Node {
  type: NodeTypes.Const
  value: string
  tex: string
}

interface RootNode extends Node {
  type: NodeTypes.Root
  body: ChildNode[]
}

interface FlatNode extends Node {
  type: NodeTypes.Flat
  body: ChildNode[]
}

interface ParamOneNode extends Node {
  type: NodeTypes.ParamOne
  params: ChildNode
  tex: string
}

interface ParamTwoNode extends Node {
  type: NodeTypes.ParamTwo
  params: [ChildNode, ChildNode]
  tex: string
}

interface MatrixNode extends Node {
  type: NodeTypes.Matrix
  params: ChildNode[][]
  lparen: string
  rparen: string
  alignment: AlignDirection
  dividerIndices: number[]
}

type ChildNode = ConstNode | MatrixNode | ParamOneNode | ParamTwoNode | FlatNode

function createRootNode(): RootNode {
  return {
    type: NodeTypes.Root,
    body: [],
  }
}

function createConstNode(tex: string): ConstNode
function createConstNode(token: TokenizedValue): ConstNode
function createConstNode(arg: TokenizedValue | string) {
  if (typeof arg === 'string') {
    return {
      type: NodeTypes.Const,
      value: arg,
      tex: arg,
    }
  }
  return {
    type: NodeTypes.Const,
    value: arg.value,
    tex: arg.type === TokenTypes.Text ? `\\text{${arg.tex}}` : arg.tex,
  }
}

function createFlatNode(): FlatNode {
  return {
    type: NodeTypes.Flat,
    body: [],
  }
}

function createMatrixNode(): MatrixNode {
  return {
    type: NodeTypes.Matrix,
    params: [],
    lparen: '.',
    rparen: '.',
    alignment: AlignDirection.Center,
    dividerIndices: [],
  }
}

function createParamOneNode(): ParamOneNode {
  return {
    type: NodeTypes.ParamOne,
    tex: '',
    params: createFlatNode(),
  }
}

function createParamTwoNode(): ParamTwoNode {
  return {
    type: NodeTypes.ParamTwo,
    tex: '',
    params: [createFlatNode(), createFlatNode()],
  }
}

function createParenOfFlatNodeFrom(token: TokenizedValue, left: boolean): ConstNode {
  return { type: NodeTypes.Const, value: token.value, tex: `\\${left ? 'left' : 'right'}${token.tex}` }
}

function readParenedExpression2(tokens: TokenizedValue[], current: number): {
  node: MatrixNode | FlatNode
  current: number
} {
  let token = tokens[current]
  let semiIndex = -1
  let closingIndex = -1
  const stack: string[] = []
  // find the paired closing paren and whether there is any `;` within the parens
  for (let i = current + 1; i < tokens.length; i++) {
    if (tokens[i].type === TokenTypes.LParen) {
      stack.push('')
      continue
    }
    if (stack.length === 0) {
      if (tokens[i].value === ';') {
        if (semiIndex === -1)
          semiIndex = i
      }
      else if (tokens[i].type === TokenTypes.RParen) {
        if (closingIndex === -1)
          closingIndex = i
      }
      if (semiIndex !== -1 && closingIndex !== -1)
        break
    }
    else {
      if (tokens[i].type === TokenTypes.RParen)
        stack.pop()
    }
  }
  if (closingIndex === -1) {
    // just process the expression as flat one
    // maybe it's better to add a hidden closing bracket
    const node = createFlatNode()
    node.body.push({ type: NodeTypes.Const, value: token.value, tex: `\\left${token.tex}` } as ConstNode)
    current++
    while (current < tokens.length) {
      const walkRes = walk(tokens, current)
      current = walkRes.current
      node.body.push(walkRes.node)
    }
    node.body.push({ type: NodeTypes.Const, value: token.value, tex: '\\right.' } as ConstNode)
    return { node, current }
  }
  else {
    if (semiIndex === -1) {
      // process the expression as an array
      const node = createFlatNode()
      node.body.push(createParenOfFlatNodeFrom(token, true))
      current++
      while (current < closingIndex) {
        const walkRes = walk(tokens, current)
        current = walkRes.current
        node.body.push(walkRes.node)
      }
      token = tokens[current]
      current++
      node.body.push(createParenOfFlatNodeFrom(token, false))
      return { node, current }
    }
    else {
      // process the expression as a matrix
      const node = createMatrixNode()
      const dividerIndices = new Set<number>()
      node.lparen = `\\left${token.tex}`
      token = tokens[++current]
      let tempArr: ChildNode[] = []
      let tempNode: ChildNode | null = null
      // inside a matrix
      while (current < closingIndex) {
        if (token.type === TokenTypes.Split) {
          if (token.value === ',') {
            if (tempNode) {
              tempArr.push(tempNode)
              tempNode = null
            }
          }
          else if (token.value === ';') {
            if (tempNode) {
              tempArr.push(tempNode)
              tempNode = null
            }
            node.params.push(tempArr)
            tempArr = []
          }
          token = tokens[++current]
          continue
        }
        else if (token.type === TokenTypes.Paren /* && token.value === '|' */) {
          if (tempNode) {
            tempArr.push(tempNode)
            tempNode = null
          }
          dividerIndices.add(tempArr.length)
          token = tokens[++current]
          continue
        }
        tempNode = createFlatNode()
        token = tokens[current]
        while (current < closingIndex
          && token.type !== TokenTypes.Split
          && token.type !== TokenTypes.Paren) {
          const walkRes = walk(tokens, current)
          current = walkRes.current
          tempNode.body.push(walkRes.node)
          token = tokens[current]
        }
      }
      // for those cases that the matrix only contains one line
      // or the last line of the matrix does not contains a semicolon
      if (tempNode) {
        tempArr.push(tempNode)
        tempNode = null
      }
      if (tempArr.length > 0) {
        node.params.push(tempArr)
        tempArr = []
      }
      // set dividerIndices
      node.dividerIndices = Array.from(dividerIndices).sort((a, b) => a - b)
      // process the right paren
      token = tokens[current]
      if (current < tokens.length) {
        current++
        node.rparen = `\\right${token.tex}`
        if (token.value === ':}')
          node.alignment = AlignDirection.Left
      }
      else {
      // no right paren
        node.rparen = '\\right.'
      }
      return { node, current }
    }
  }
}

function findTargetIndices(arr: TokenizedValue[], start: number, end: number): {
  semiIndex: number
  barIndex: number
} {
  let semiIndex = -1
  let barIndex = -1
  const stack: string[] = []
  for (let i = start; i < end; i++) {
    if (arr[i].type === TokenTypes.LParen) {
      stack.push('')
      continue
    }
    if (stack.length > 0 && arr[i].type === TokenTypes.RParen) {
      stack.pop()
      continue
    }
    if (stack.length > 0)
      continue
    if (arr[i].type === TokenTypes.RParen)
      break
    if (arr[i].value === ';') {
      if (semiIndex === -1)
        semiIndex = i
    }
    else if (arr[i].value === '|') {
      if (barIndex === -1)
        barIndex = i
    }
    if (semiIndex !== -1 && barIndex !== -1)
      break
  }
  return { semiIndex, barIndex }
}

function readBarStartedExpressions(tokens: TokenizedValue[], current: number): {
  node: ChildNode
  current: number
} {
  let token = tokens[current]
  // in fact only `|` matches `TokenTypes.Paren`
  if (token.type === TokenTypes.Paren) {
    const { semiIndex, barIndex } = findTargetIndices(tokens, current + 1, tokens.length)

    /**
     * case 1: not matrix
     * there isn't any `;` split pattern before a Paren or a RParen
     * for example `{ (x, y) | x^2 + y^2 <= 1 }`
     */
    if (barIndex === -1) {
      return {
        current: current + 1,
        node: {
          type: NodeTypes.Const,
          value: '|',
          tex: '\\mid',
        },
      }
    }
    // used as `abs`
    if (semiIndex === -1 || semiIndex > barIndex) {
      const node = createFlatNode()
      current++
      node.body.push(createConstNode('\\left|'))
      while (current < barIndex) {
        const walkRes = walk(tokens, current)
        current = walkRes.current
        node.body.push(walkRes.node)
      }
      node.body.push(createConstNode('\\right|'))
      current = barIndex + 1
      return { current, node }
    }

    /**
     * case 2: matrix
     * there is one or more than one `;` before a Paren ~~or a RParen~~
     *
     * common cases:
     * `| 1, 2; |` or `| 1, 2; 3, 4 |`
     *
     * special case:
     * `| 1, 2, | 3, 4; 5, 6 |, 4; ... |`
     * maybe I should use a `stack` to store the parens
     * however, the case is too complex, so I won't implement it ¯\_(ツ)_/¯
     */
    const node = createMatrixNode()
    node.lparen = '\\left|'
    node.rparen = '\\right|'

    token = tokens[++current]
    let tempArr: ChildNode[] = []
    let tempNode: ChildNode | null = null
    while (current < barIndex) {
      if (token.type === TokenTypes.Split) {
        switch (token.value) {
          case ',': {
            if (tempNode) {
              tempArr.push(tempNode)
              tempNode = null
            }
            break
          }
          case ';': {
            if (tempNode) {
              // the ownership of `tempNode` is passed to `tempArr`
              tempArr.push(tempNode)
              tempNode = null
            }
            // the ownership of `tempArr` is passed to `node.params`
            node.params.push(tempArr)
            tempArr = []
            break
          }
        }
        token = tokens[++current]
        continue
      }
      tempNode = createFlatNode()
      token = tokens[current]
      while (current < barIndex
        && token.type !== TokenTypes.Split) {
        const walkRes = walk(tokens, current)
        current = walkRes.current
        tempNode.body.push(walkRes.node)
        token = tokens[current]
      }
    }
    if (tempNode) {
      tempArr.push(tempNode)
      tempNode = null
    }
    if (tempArr.length > 0) {
      node.params.push(tempArr)
      tempArr = []
    }
    current = barIndex + 1
    return { node, current }
  }
  throw new Error(`Unmatched token in \`readBarStartedExpressions\`, ${token.value}`)
}

function removeParenOfFlatExpr(node: FlatNode): FlatNode {
  const first = node.body[0]
  const last = node.body[node.body.length - 1]
  if (first.type === NodeTypes.Const
    && last.type === NodeTypes.Const
    && (first as ConstNode).value === '('
    && (last as ConstNode).value === ')') {
    node.body.pop()
    node.body.shift()
  }
  return node
}

function walk(tokens: TokenizedValue[], current: number): { node: ChildNode; current: number } {
  if (current >= tokens.length)
    return { node: createConstNode(''), current }
  const token = tokens[current]
  let node: ChildNode
  switch (token.type) {
    case TokenTypes.Const:
    case TokenTypes.Text:
    case TokenTypes.NumberLiteral:
    case TokenTypes.StringLiteral: {
      current++
      node = createConstNode(token)
      break
    }
    case TokenTypes.LParen: {
      const res = readParenedExpression2(tokens, current)
      node = res.node
      current = res.current
      break
    }
    case TokenTypes.Paren: {
      const res = readBarStartedExpressions(tokens, current)
      node = res.node
      current = res.current
      break
    }
    case TokenTypes.OperatorA: {
      node = createParamOneNode()
      node.tex = token.tex
      current++
      // recursion
      const walkRes = walk(tokens, current)
      current = walkRes.current
      if (walkRes.node.type === NodeTypes.Flat)
        walkRes.node = removeParenOfFlatExpr(walkRes.node as FlatNode)
      node.params = walkRes.node
      break
    }
    case TokenTypes.OperatorOAB: {
      node = createParamTwoNode()
      node.tex = token.tex
      current++
      const param0 = walk(tokens, current)
      current = param0.current
      if (param0.node.type === NodeTypes.Flat)
        param0.node = removeParenOfFlatExpr(param0.node as FlatNode)
      node.params[0] = param0.node
      const param1 = walk(tokens, current)
      current = param1.current
      if (param1.node.type === NodeTypes.Flat)
        param1.node = removeParenOfFlatExpr(param1.node as FlatNode)
      node.params[1] = param1.node
      break
    }
    case TokenTypes.Split:
    case TokenTypes.Align: {
      current++
      node = createConstNode(token)
      break
    }
    case TokenTypes.RParen: {
      current++
      node = createConstNode(token)
      break
    }
    default: {
      throw new Error(`Unmatched token in walk ${token.value}`)
    }
  }
  // watch next token
  if (current < tokens.length) {
    const nextToken = tokens[current]
    switch (nextToken.type) {
      case TokenTypes.OperatorAOB: {
        current++
        const newNode = createParamTwoNode()
        if (node.type === NodeTypes.Flat)
          node = removeParenOfFlatExpr(node as FlatNode)
        newNode.tex = nextToken.tex
        newNode.params[0] = node

        const walkRes = walk(tokens, current)
        current = walkRes.current
        if (walkRes.node.type === NodeTypes.Flat)
          walkRes.node = removeParenOfFlatExpr(walkRes.node as FlatNode)
        newNode.params[1] = walkRes.node
        node = newNode
        break
      }
      case TokenTypes.OperatorAO: {
        current++
        const newNode = createParamOneNode()
        newNode.tex = nextToken.tex
        newNode.params = node
        node = newNode
        break
      }
    }
  }
  return { node, current }
}

function parser(tokens: TokenizedValue[]) {
  const root = createRootNode()
  let current = 0

  while (current < tokens.length) {
    const walkRes = walk(tokens, current)
    current = walkRes.current
    root.body.push(walkRes.node)
  }

  return root
}

export {
  NodeTypes,
  Node,
  ChildNode,
  RootNode,
  AlignDirection,
  MatrixNode,
  parser,
}
