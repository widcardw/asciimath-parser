import { TokenTypes } from './symbols'
import type { TokenizedValue } from './trie'

enum NodeTypes {
  Root = 'Root',
  Const = 'Const',
  ParamOne = 'ParamOne', // expression with one param
  ParamTwo = 'ParamTwo', // expression with two params
  Matrix = 'Matrix', // in fact it represents all braced expressions
  Aligned = 'Aligned', // aligned environment
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
  value: string
  tex: string
}

interface RootNode extends Node {
  body: ChildNode[]
}

interface FlatNode extends Node {
  body: ChildNode[]
}

interface ParamOneNode extends Node {
  params: ChildNode
  tex: string
}

interface ParamTwoNode extends Node {
  params: [ChildNode, ChildNode]
  tex: string
}

interface MatrixNode extends Node {
  params: ChildNode[][]
  lparen: string
  rparen: string
  alignment: AlignDirection
  dividerIndices: number[]
}

interface AlignedNode extends Node {
  params: ChildNode[]
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

function createAlignedNode(): AlignedNode {
  return {
    type: NodeTypes.Aligned,
    params: [],
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
      node.body.push({ type: NodeTypes.Const, value: token.value, tex: `\\left${token.tex}` } as ConstNode)
      current++
      while (current < closingIndex) {
        const walkRes = walk(tokens, current)
        current = walkRes.current
        node.body.push(walkRes.node)
      }
      token = tokens[current]
      current++
      node.body.push({ type: NodeTypes.Const, value: token.value, tex: `\\right${token.tex}` } as ConstNode)
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
      node.dividerIndices = Array.from(dividerIndices)
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

// 逻辑有点错了，并不能直接匆匆忙忙的就去通过逗号之类的直接分割成矩阵
/**
 * @deprecated
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function readParenedExpression(tokens: TokenizedValue[], current: number): { node: MatrixNode; current: number } {
  const node = createMatrixNode()

  let token = tokens[current]
  const dividerIndices = new Set<number>()
  if (token.type === TokenTypes.LParen) {
    node.lparen = `\\left${token.tex}`
    token = tokens[++current]
    let tempArr: ChildNode[] = []
    let tempNode: ChildNode | null = null
    // the cursor should be at first
    while (current < tokens.length
      && token.type !== TokenTypes.RParen
      // `|` should be used as matrix divider
      // && token.type !== TokenTypes.Paren
    ) {
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
      else if (token.type === TokenTypes.Paren) {
        if (tempNode) {
          tempArr.push(tempNode)
          tempNode = null
        }
        dividerIndices.add(tempArr.length)
        token = tokens[++current]
        continue
      }
      tempNode = createMatrixNode()
      token = tokens[current]
      while (current < tokens.length
        && token.type !== TokenTypes.Split
        && token.type !== TokenTypes.RParen
        && token.type !== TokenTypes.Paren) {
        const walkRes = walk(tokens, current)
        current = walkRes.current
        if (tempNode.params.length === 0)
          tempNode.params.push([])

        tempNode.params[0].push(walkRes.node)
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
    node.dividerIndices = Array.from(dividerIndices)
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
  }
  // TODO
  // The matrix with only one element should be considered as Const.
  // However, the aim of `MatrixNode` is to represent all types of expressions,
  // so it's ok here.
  // But the braced `()` of a matrix with only one element should be hidden.
  return { node, current }
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

function walk(tokens: TokenizedValue[], current: number): { node: ChildNode; current: number } {
  const token = tokens[current]
  switch (token.type) {
    case TokenTypes.Const:
    case TokenTypes.Text:
    case TokenTypes.NumberLiteral:
    case TokenTypes.StringLiteral: {
      current++
      return { node: createConstNode(token), current }
    }
    case TokenTypes.LParen: {
      return readParenedExpression2(tokens, current)
    }
    case TokenTypes.Paren: {
      return readBarStartedExpressions(tokens, current)
    }
    case TokenTypes.OperatorA: {
      const node = createParamOneNode()
      node.tex = token.tex
      current++
      // recursion
      const walkRes = walk(tokens, current)
      current = walkRes.current
      node.params = walkRes.node
      return { node, current }
    }
    case TokenTypes.OperatorOAB: {
      const node = createParamTwoNode()
      node.tex = token.tex
      current++
      const param0 = walk(tokens, current)
      current = param0.current
      node.params[0] = param0.node
      const param1 = walk(tokens, current)
      current = param1.current
      node.params[1] = param1.node
      return { node, current }
    }
    case TokenTypes.Split:
    case TokenTypes.Align: {
      current++
      return { node: createConstNode(token), current }
    }
  }
  throw new Error(`Unmatched token in walk ${token.value}`)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function processAligned(tokens: TokenizedValue[]) {
  const root = createAlignedNode()
  let current = 0
  let token = tokens[current]
  while (current < tokens.length) {
    const node = createFlatNode()
    // read a whole line of expression to a flat node
    while (current < tokens.length && !(token.type === TokenTypes.Align && token.tex === '\\\\')) {
      const walkRes = walk(tokens, current)
      current = walkRes.current
      token = tokens[current]
      node.body.push(walkRes.node)
    }
    // in this case token[current] must be `\\`
    if (current < tokens.length) {
      node.body.push(createConstNode('\\\\'))
      current++
    }

    root.params.push(node)
  }
  return root
}

function parser(tokens: TokenizedValue[]) {
  // if (tokens.find(i => i.type === TokenTypes.Align && i.value === '&'))
  //   return processAligned(tokens)

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
  AlignDirection,
  parser,
}
