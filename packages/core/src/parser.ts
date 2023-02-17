import { TokenTypes } from './symbols'
import type { TokenizedValue } from './trie'

enum NodeTypes {
  Root = 'Root',
  Const = 'Const',
  ParamOne = 'ParamOne', // expression with one param
  ParamTwo = 'ParamTwo', // expression with two params
  Matrix = 'Matrix',
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
function createConstNode(): ConstNode
function createConstNode(tex: string): ConstNode
function createConstNode(token: TokenizedValue): ConstNode
function createConstNode(arg?: TokenizedValue | string) {
  if (typeof arg === 'undefined') {
    return {
      type: NodeTypes.Const,
      value: '',
      tex: '',
    }
  }
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
  const { closingIndex, semiIndex } = findPairedClosingParen(current, tokens)
  if (closingIndex === -1) {
    return parenStartedNoClosingNode(tokens, current)
  }
  else {
    if (semiIndex === -1) {
      // process the expression as an array
      return parenedArrayNode(tokens, current, closingIndex)
    }
    else {
      // process the expression as a matrix
      return generateMatrixNode(tokens, current, closingIndex)
    }
  }
}

function generateMatrixNode(tokens: TokenizedValue[], current: number, end: number) {
  let token = tokens[current]
  const node = createMatrixNode()
  const dividerIndices = new Set<number>()
  node.lparen = `\\left${token.tex}`
  token = tokens[++current]
  let tempArr: ChildNode[] = []
  let tempNode: ChildNode | null = null
  // inside a matrix
  while (current < end) {
    if (token.type === TokenTypes.Split) {
      if (token.value === ',') {
        if (tempNode) {
          tempArr.push(tempNode)
          tempNode = null
        }
        else {
          tempArr.push(createConstNode())
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
    while (current < end
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
  // unreachable
  else {
    // no right paren
    node.rparen = '\\right.'
  }
  return { node, current }
}

class ParenError extends Error {}

function parenedArrayNode(tokens: TokenizedValue[], current: number, closingIndex: number) {
  let token = tokens[current]
  const node = createFlatNode()
  node.body.push(createParenOfFlatNodeFrom(token, true))
  current = readTokensToFlatNode(current + 1, closingIndex, tokens, node)
  if (current >= tokens.length)
    throw new ParenError(`Read index out of range, index: ${current}`)

  token = tokens[current]
  current++
  node.body.push(createParenOfFlatNodeFrom(token, false))
  if ((node.body[0] as ConstNode).value === '{:' && (node.body[node.body.length - 1] as ConstNode).value === ':}') {
    (node.body[0] as ConstNode).tex = '{';
    (node.body[node.body.length - 1] as ConstNode).tex = '}'
  }
  return { node, current }
}

function parenStartedNoClosingNode(tokens: TokenizedValue[], current: number) {
  const token = tokens[current]
  // just process the expression as flat one
  const node = createFlatNode()
  node.body.push({ type: NodeTypes.Const, value: token.value, tex: `\\left${token.tex}` } as ConstNode)
  current = readTokensToFlatNode(current + 1, tokens.length, tokens, node)
  // maybe it's better to add a hidden closing bracket
  node.body.push({ type: NodeTypes.Const, value: token.value, tex: '\\right.' } as ConstNode)
  return { node, current }
}

function findPairedClosingParen(current: number, tokens: TokenizedValue[]) {
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
  return { closingIndex, semiIndex }
}

function findPairedBar(arr: TokenizedValue[], start: number, end: number): {
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
  const { semiIndex, barIndex } = findPairedBar(tokens, current + 1, tokens.length)

  /**
     * case 1: not matrix
     * there isn't any `;` split pattern before a Paren or a RParen
     * for example `{ (x, y) | x^2 + y^2 <= 1 }`
     */
  if (barIndex === -1)
    return createSingleBarNode(current)

  // used as `abs`
  if (semiIndex === -1 || semiIndex > barIndex) {
    const node = createFlatNode()
    current++
    node.body.push(createConstNode('\\left|'))
    current = readTokensToFlatNode(current, barIndex, tokens, node)
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

function readTokensToFlatNode(current: number, end: number, tokens: TokenizedValue[], node: FlatNode) {
  while (current < end) {
    const walkRes = walk(tokens, current)
    current = walkRes.current
    node.body.push(walkRes.node)
  }
  return current
}

function createSingleBarNode(current: number): { node: ChildNode; current: number } {
  return {
    current: current + 1,
    node: {
      type: NodeTypes.Const,
      value: '|',
      tex: '\\mid',
    },
  }
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

function lookForwardOperatorOptionalTwoParams(tokens: TokenizedValue[], current: number, token: TokenizedValue) {
  let nextToken = tokens[current]
  let p1: ChildNode = createConstNode()
  let nextShouldBe = ''
  let p1Status = ''
  let p2Status = ''
  if (nextToken.value === '^' || nextToken.value === '_') {
    nextShouldBe = nextToken.value === '^' ? '_' : '^'
    p1Status = nextToken.value
    current++
    // do not look forward
    // do not receive other sup or sub in recursion
    const walkRes = walk(tokens, current, false)
    if (walkRes.node.type === NodeTypes.Flat)
      walkRes.node = removeParenOfFlatExpr(walkRes.node)
    p1 = walkRes.node
    current = walkRes.current
  }
  let p2: ChildNode = createConstNode()
  if (current < tokens.length) {
    nextToken = tokens[current]
    if (nextToken.value === nextShouldBe) {
      p2Status = nextToken.value
      current++
      // do not look forward
      // do not receive other sup or sub in recursion
      const walkRes = walk(tokens, current, false)
      if (walkRes.node.type === NodeTypes.Flat)
        walkRes.node = removeParenOfFlatExpr(walkRes.node)
      p2 = walkRes.node
      current = walkRes.current
    }
  }
  const node = createParamTwoNode()
  node.tex = token.tex
  node.params[0] = (() => {
    if (p1Status === '^')
      return p1
    if (p2Status === '^')
      return p2
    return createConstNode()
  })()
  node.params[1] = (() => {
    if (p1Status === '_')
      return p1
    if (p2Status === '_')
      return p2
    return createConstNode()
  })()
  return { node, current }
}

function preProcessOperatorSup(node: ChildNode, operator: TokenizedValue, tokens: TokenizedValue[], current: number): WalkResult {
  let newNode: FlatNode
  if (node.type === NodeTypes.Flat) {
    newNode = node
  }
  else {
    newNode = createFlatNode()
    newNode.body.push(node)
  }
  const supNode = createParamOneNode()
  supNode.tex = operator.tex
  // do not look forward
  // avoid receiving fractions or other nodes as sup node
  const walkRes = walk(tokens, current, false)
  current = walkRes.current
  if (walkRes.node.type === NodeTypes.Flat)
    walkRes.node = removeParenOfFlatExpr(walkRes.node)
  supNode.params = walkRes.node
  newNode.body.push(supNode)
  node = newNode
  return { node, current }
}

function preProcessOperatorAO(node: ChildNode, nextToken: TokenizedValue) {
  const newNode = createFlatNode()
  if (node.type === NodeTypes.Flat)
    newNode.body.push(...(node.body))

  else
    newNode.body.push(node)
  newNode.body.push(createConstNode(nextToken))
  node = newNode
  return node
}

function preProcessOperatorAOB(node: ChildNode, operator: TokenizedValue, tokens: TokenizedValue[], current: number): WalkResult {
  const newNode = createParamTwoNode()
  if (node.type === NodeTypes.Flat)
    node = removeParenOfFlatExpr(node)
  newNode.tex = operator.tex
  newNode.params[0] = node
  const walkRes = walk(tokens, current)
  current = walkRes.current
  if (walkRes.node.type === NodeTypes.Flat)
    walkRes.node = removeParenOfFlatExpr(walkRes.node)
  newNode.params[1] = walkRes.node
  node = newNode
  return { node, current }
}

function getParamOneNode(tokens: TokenizedValue[], current: number, lookForward: boolean): { node: ParamOneNode; current: number } {
  const node = createParamOneNode()
  const token = tokens[current]
  node.tex = token.tex
  current++
  const walkRes = walk(tokens, current, lookForward)
  current = walkRes.current
  if (walkRes.node.type === NodeTypes.Flat)
    walkRes.node = removeParenOfFlatExpr(walkRes.node)

  node.params = walkRes.node
  return { node, current }
}

interface WalkResult {
  node: ChildNode
  current: number
}

function walk(tokens: TokenizedValue[], current: number, watchNext = true): WalkResult {
  if (current >= tokens.length)
    return { node: createConstNode(), current }
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
      ({ node, current } = readParenedExpression2(tokens, current))
      break
    }
    case TokenTypes.Paren: {
      ({ node, current } = readBarStartedExpressions(tokens, current))
      break
    }
    case TokenTypes.OperatorSup:
    case TokenTypes.OperatorA: {
      // high priority, do not look forward
      ({ node, current } = getParamOneNode(tokens, current, false))
      break
    }
    case TokenTypes.OperatorMinus: {
      // low priority, do look forward
      ({ node, current } = getParamOneNode(tokens, current, true))
      break
    }
    case TokenTypes.OperatorOAB: {
      node = createParamTwoNode()
      node.tex = token.tex
      current++
      const param0 = walk(tokens, current)
      current = param0.current
      if (param0.node.type === NodeTypes.Flat)
        param0.node = removeParenOfFlatExpr(param0.node)
      node.params[0] = param0.node
      const param1 = walk(tokens, current)
      current = param1.current
      if (param1.node.type === NodeTypes.Flat)
        param1.node = removeParenOfFlatExpr(param1.node)
      node.params[1] = param1.node
      break
    }
    case TokenTypes.OperatorO2: {
      current++
      if (current >= tokens.length) {
        node = createConstNode(`${token.tex.replace(/[\{\[] \$\d+ [\}\]]/g, '')}{}`)
        break
      }

      // detect next token
      ({ node, current } = lookForwardOperatorOptionalTwoParams(tokens, current, token))
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
  if (current < tokens.length && watchNext) {
    let matched = true
    while (matched && current < tokens.length) {
      const nextToken = tokens[current]
      switch (nextToken.type) {
        case TokenTypes.OperatorAOB: {
          ({ node, current } = preProcessOperatorAOB(node, nextToken, tokens, current + 1))
          break
        }
        case TokenTypes.OperatorAO: {
          node = preProcessOperatorAO(node, nextToken)
          current++
          break
        }
        case TokenTypes.OperatorSup: {
          ({ node, current } = preProcessOperatorSup(node, nextToken, tokens, current + 1))
          break
        }
        default: {
          matched = false
        }
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
