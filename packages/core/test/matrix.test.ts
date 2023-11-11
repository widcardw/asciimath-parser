import { describe, expect, it } from 'vitest'
import { AsciiMath, TokenTypes } from '../src'
import { codegen } from '../src/codegen'
import { parser } from '../src/parser'
import { createTrie } from '../src/trie'
import { $_ } from './utils/string-raw'
import { type PR, removeTex } from './utils/remove-position'
import { removeValue } from './utils/removeValue'
import { flat, lp, mat, root, rp, sup, u } from './utils/build-node'

const code = `
[1, 0, cdots, 0;
s_1, b_11, cdots, b_(1n);
vdots, vdots, , vdots;
s_n, b_(n1), cdots, b_(n n)]`

describe('matrix with empty el', () => {
  it('should generate ast', () => {
    const trie = createTrie()
    const tokens = trie.tryParsingAll(code)
    const ast = parser(tokens)
    const output = codegen(ast)
    expect(removeTex(tokens)).toEqual<PR[]>([
      { isKeyWord: true, type: TokenTypes.LParen, value: '[' },
      { isKeyWord: false, type: TokenTypes.NumberLiteral, value: '1' },
      { isKeyWord: true, type: TokenTypes.Split, value: ',' },
      { isKeyWord: false, type: TokenTypes.NumberLiteral, value: '0' },
      { isKeyWord: true, type: TokenTypes.Split, value: ',' },
      { isKeyWord: true, type: TokenTypes.Const, value: 'cdots' },
      { isKeyWord: true, type: TokenTypes.Split, value: ',' },
      { isKeyWord: false, type: TokenTypes.NumberLiteral, value: '0' },
      { isKeyWord: true, type: TokenTypes.Split, value: ';' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 's' },
      { isKeyWord: true, type: TokenTypes.OperatorSup, value: '_' },
      { isKeyWord: false, type: TokenTypes.NumberLiteral, value: '1' },
      { isKeyWord: true, type: TokenTypes.Split, value: ',' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'b' },
      { isKeyWord: true, type: TokenTypes.OperatorSup, value: '_' },
      { isKeyWord: false, type: TokenTypes.NumberLiteral, value: '11' },
      { isKeyWord: true, type: TokenTypes.Split, value: ',' },
      { isKeyWord: true, type: TokenTypes.Const, value: 'cdots' },
      { isKeyWord: true, type: TokenTypes.Split, value: ',' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'b' },
      { isKeyWord: true, type: TokenTypes.OperatorSup, value: '_' },
      { isKeyWord: true, type: TokenTypes.LParen, value: '(' },
      { isKeyWord: false, type: TokenTypes.NumberLiteral, value: '1' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'n' },
      { isKeyWord: true, type: TokenTypes.RParen, value: ')' },
      { isKeyWord: true, type: TokenTypes.Split, value: ';' },
      { isKeyWord: true, type: TokenTypes.Const, value: 'vdots' },
      { isKeyWord: true, type: TokenTypes.Split, value: ',' },
      { isKeyWord: true, type: TokenTypes.Const, value: 'vdots' },
      { isKeyWord: true, type: TokenTypes.Split, value: ',' },
      { isKeyWord: true, type: TokenTypes.Split, value: ',' },
      { isKeyWord: true, type: TokenTypes.Const, value: 'vdots' },
      { isKeyWord: true, type: TokenTypes.Split, value: ';' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 's' },
      { isKeyWord: true, type: TokenTypes.OperatorSup, value: '_' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'n' },
      { isKeyWord: true, type: TokenTypes.Split, value: ',' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'b' },
      { isKeyWord: true, type: TokenTypes.OperatorSup, value: '_' },
      { isKeyWord: true, type: TokenTypes.LParen, value: '(' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'n' },
      { isKeyWord: false, type: TokenTypes.NumberLiteral, value: '1' },
      { isKeyWord: true, type: TokenTypes.RParen, value: ')' },
      { isKeyWord: true, type: TokenTypes.Split, value: ',' },
      { isKeyWord: true, type: TokenTypes.Const, value: 'cdots' },
      { isKeyWord: true, type: TokenTypes.Split, value: ',' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'b' },
      { isKeyWord: true, type: TokenTypes.OperatorSup, value: '_' },
      { isKeyWord: true, type: TokenTypes.LParen, value: '(' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'n' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'n' },
      { isKeyWord: true, type: TokenTypes.RParen, value: ')' },
      { isKeyWord: true, type: TokenTypes.RParen, value: ']' },
    ])
    expect(removeValue(ast)).toEqual(
      root(mat([
        [flat(u('1')), flat(u('0')), flat(u('\\cdots')), flat(u('0'))],
        [
          flat(flat(u('s'), sup('_', u('1')))), // not proper here
          flat(flat(u('b'), sup('_', u('11')))),
          flat(u('\\cdots')),
          flat(flat(u('b'), sup('_', flat(u('1'), u('n')))))],
        [flat(u('\\vdots')), flat(u('\\vdots')), u(''), flat(u('\\vdots'))],
        [
          flat(flat(u('s'), sup('_', u('n')))),
          flat(flat(u('b'), sup('_', flat(u('n'), u('1'))))),
          flat(u('\\cdots')),
          flat(flat(u('b'), sup('_', flat(u('n'), u('n'))))),
        ],
      ])),
    )
    expect(output).toBe($_`\left[ \begin{array}{cccc} 1 & 0 & \cdots & 0 \\ s _{ 1 } & b _{ 11 } & \cdots & b _{ 1 n } \\ \vdots & \vdots &  & \vdots \\ s _{ n } & b _{ n 1 } & \cdots & b _{ n n } \end{array} \right]`)
  })
})

describe('centered matrix with no braces', () => {
  it('should generate centered matrix', () => {
    const trie = createTrie()
    const tokens = trie.tryParsingAll('{: a, b; c, d :}')
    const ast = parser(tokens)
    expect(removeTex(structuredClone(tokens))).toEqual<PR[]>([
      { isKeyWord: true, type: TokenTypes.LParen, value: '{:' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'a' },
      { isKeyWord: true, type: TokenTypes.Split, value: ',' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'b' },
      { isKeyWord: true, type: TokenTypes.Split, value: ';' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'c' },
      { isKeyWord: true, type: TokenTypes.Split, value: ',' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'd' },
      { isKeyWord: true, type: TokenTypes.RParen, value: ':}' },
    ])
    expect(removeValue(ast)).toEqual(
      root(
        mat([
          [flat(u('a')), flat(u('b'))],
          [flat(u('c')), flat(u('d'))],
        ], { l: '.', r: '.' }),
      ),
    )
    expect(codegen(ast)).toBe($_`\left. \begin{array}{cc} a & b \\ c & d \end{array} \right.`)
  })

  it('should remove () of matrix in superscript', () => {
    const am = new AsciiMath({ display: false })
    expect(am.toTex('sum_(a;b)')).toBe($_`\sum _{  \begin{array}{c} a \\ b \end{array}  }`)
  })

  it('should generate left aligned matrix', () => {
    const am = new AsciiMath({ display: false })
    expect(am.toTex('|x|={x, if x > 0; -x, otherwise :}')).toBe($_`\mid x |= \left\lbrace \begin{array}{ll} x & \text{if}\quad x > 0 \\ - x & \text{otherwise}\quad \end{array} \right.`)
  })
})

describe('grid like matrix', () => {
  it('should generate grid like matrix', () => {
    const trie = createTrie()
    const tokens = trie.tryParsingAll('{: | hline a, b;hline c|d|; hline :}')
    const ast = parser(tokens)
    expect(removeTex(structuredClone(tokens))).toEqual<PR[]>([
      { isKeyWord: true, type: TokenTypes.LParen, value: '{:' },
      { isKeyWord: true, type: TokenTypes.Paren, value: '|' },
      { isKeyWord: true, type: TokenTypes.Const, value: 'hline' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'a' },
      { isKeyWord: true, type: TokenTypes.Split, value: ',' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'b' },
      { isKeyWord: true, type: TokenTypes.Split, value: ';' },
      { isKeyWord: true, type: TokenTypes.Const, value: 'hline' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'c' },
      { isKeyWord: true, type: TokenTypes.Paren, value: '|' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'd' },
      { isKeyWord: true, type: TokenTypes.Paren, value: '|' },
      { isKeyWord: true, type: TokenTypes.Split, value: ';' },
      { isKeyWord: true, type: TokenTypes.Const, value: 'hline' },
      { isKeyWord: true, type: TokenTypes.RParen, value: ':}' },
    ])
    expect(removeValue(ast)).toEqual(
      root(mat([
        [flat(u('\\hline'), u('a')), flat(u('b'))],
        [flat(u('\\hline'), u('c')), flat(u('d'))],
        [flat(u('\\hline'))],
      ], { l: '.', r: '.', dividerIndices: [0, 1, 2] })),
    )
    expect(codegen(ast)).toBe($_`\left. \begin{array}{|c|c|} \hline a & b \\ \hline c & d \\ \hline \end{array} \right.`)
  })
})

describe('hline of matrix', () => {
  it('should add hline over matrix', () => {
    const trie = createTrie()
    const tokens = trie.tryParsingAll('{: hline | a | b |; :}')
    const ast = parser(tokens)
    // The tokens here is correct, since the hline will be swapped with the `|` before it.
    // Any edge case?
    // One more thing, it is a little confusing to swap the tokens here.
    expect(removeTex(tokens)).toEqual<PR[]>([
      { isKeyWord: true, type: TokenTypes.LParen, value: '{:' },
      { isKeyWord: true, type: TokenTypes.Paren, value: '|' },
      { isKeyWord: true, type: TokenTypes.Const, value: 'hline' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'a' },
      { isKeyWord: true, type: TokenTypes.Paren, value: '|' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'b' },
      { isKeyWord: true, type: TokenTypes.Paren, value: '|' },
      { isKeyWord: true, type: TokenTypes.Split, value: ';' },
      { isKeyWord: true, type: TokenTypes.RParen, value: ':}' },
    ])
    expect(removeValue(ast)).toEqual(
      root(mat([
        [flat(u('\\hline'), u('a')), flat(u('b'))],
      ], { l: '.', r: '.', dividerIndices: [0, 1, 2] })),
    )
    expect(codegen(ast)).toBe($_`\left. \begin{array}{|c|c|} \hline a & b \end{array} \right.`)
  })

  it('should not cause infinite loop', () => {
    const code2 = `{:
      --
      |a|b|;
      --
      
      --
      |c|d|;
      --
      :}`
    const trie = createTrie()
    const tokens = trie.tryParsingAll(code2)
    const ast = parser(tokens)
    const output = codegen(ast)
    expect(removeTex(tokens)).toEqual<PR[]>([
      { isKeyWord: true, type: TokenTypes.LParen, value: '{:' },
      { isKeyWord: true, type: TokenTypes.Paren, value: '|' },
      { isKeyWord: true, type: TokenTypes.Const, value: '--' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'a' },
      { isKeyWord: true, type: TokenTypes.Paren, value: '|' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'b' },
      { isKeyWord: true, type: TokenTypes.Paren, value: '|' },
      { isKeyWord: true, type: TokenTypes.Split, value: ';' },
      { isKeyWord: true, type: TokenTypes.Const, value: '--' },
      { isKeyWord: true, type: TokenTypes.Const, value: '--' },
      { isKeyWord: true, type: TokenTypes.Paren, value: '|' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'c' },
      { isKeyWord: true, type: TokenTypes.Paren, value: '|' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'd' },
      { isKeyWord: true, type: TokenTypes.Paren, value: '|' },
      { isKeyWord: true, type: TokenTypes.Split, value: ';' },
      { isKeyWord: true, type: TokenTypes.Const, value: '--' },
      { isKeyWord: true, type: TokenTypes.RParen, value: ':}' },
    ])
    // The example here is wrong.
    expect(removeValue(ast)).toEqual(
      root(mat([
        [flat(u('\\hline'), u('a')), flat(u('b'))],
        [flat(u('\\hline'), u('\\hline')), flat(u('c')), flat(u('d'))],
        [flat(u('\\hline'))],
      ], { l: '.', r: '.', dividerIndices: [0, 1, 1, 1] })), // This is wrong!
    )
    expect(output).toBe($_`\left. \begin{array}{|c|c|c|} \hline a & b \\ \hline \hline & c & d \\ \hline \end{array} \right.`)
  })
})
