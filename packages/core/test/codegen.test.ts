import { describe, expect, it } from 'vitest'
import { codegen } from '../src/codegen'
import { parser } from '../src/parser'
import { createTrie } from '../src/trie'
import { $_ } from './utils/string-raw'

describe('codegen matrix', () => {
  const trie = createTrie()
  it('should generate matrix', () => {
    expect(codegen(parser(trie.tryParsingAll('[a,b;c,d]'))))
      .toBe($_`\left[ \begin{array}{cc} a & b \\ c & d \end{array} \right]`)
  })

  it('should generate divided matrix', () => {
    expect(codegen(parser(trie.tryParsingAll('[a,b|c;d,e|f]'))))
      .toBe($_`\left[ \begin{array}{cc|c} a & b & c \\ d & e & f \end{array} \right]`)
    expect(codegen(parser(trie.tryParsingAll('[a,b|c,d|e;f,g|h,i|j]'))))
      .toBe($_`\left[ \begin{array}{cc|cc|c} a & b & c & d & e \\ f & g & h & i & j \end{array} \right]`)
  })

  it('should generate det', () => {
    expect(codegen(parser(trie.tryParsingAll('|a,b;d,e|'))))
      .toBe($_`\left| \begin{array}{cc} a & b \\ d & e \end{array} \right|`)
  })

  it('should generate cases', () => {
    expect(codegen(parser(trie.tryParsingAll('f(x) = { x^2, if x>0; x, otherwise :}'))))
      .toBe($_`f \left( x \right) = \left\lbrace \begin{array}{ll} x ^{ 2 } & \text{if}\quad x > 0 \\ x & \text{otherwise}\quad \end{array} \right.`)
  })

  it('should generate recursive matrix', () => {
    expect(codegen(parser(trie.tryParsingAll('[(0;0),(0;1);(1;0),(1;1)]'))))
      .toBe($_`\left[ \begin{array}{cc} \left( \begin{array}{c} 0 \\ 0 \end{array} \right) & \left( \begin{array}{c} 0 \\ 1 \end{array} \right) \\ \left( \begin{array}{c} 1 \\ 0 \end{array} \right) & \left( \begin{array}{c} 1 \\ 1 \end{array} \right) \end{array} \right]`)
  })
})

describe('codegen align', () => {
  const trie = createTrie()
  it('should generate aligend environment', () => {
    expect(codegen(parser(trie.tryParsingAll('varphi(x) & = Phi\'(x) \n\n & = 1/(sqrt(2pi) sigma) "e"^(- ((x-mu)^2)/(2sigma^2))'))))
      .toBe($_`\begin{aligned}\varphi \left( x \right) & = \Phi ^{\prime} \left( x \right) \\ & = \frac{ 1 }{ \sqrt{ 2 \pi } \sigma } \text{e} ^{ - \frac{ \left( x - \mu \right) ^{ 2 } }{ 2 \sigma ^{ 2 } } }\end{aligned}`)
  })
})

describe('codegen superfluous `^`', () => {
  const trie = createTrie()
  it('should not generate secondary sup', () => {
    expect(codegen(parser(trie.tryParsingAll('x^2^3'))))
      .toBe($_`x ^{ 2 } ^{ 3 }`)
  })
  it('should generate correct sup and sub', () => {
    expect(codegen(parser(trie.tryParsingAll('sum_(n=1)^(+oo) 1/(n^2) = (pi^2)/6'))))
      .toBe($_`\sum _{ n = 1 } ^{ + \infty } \frac{ 1 }{ n ^{ 2 } } = \frac{ \pi ^{ 2 } }{ 6 }`)
  })
})

describe('codegen {: any :}', () => {
  const trie = createTrie()
  it('should generate { abc }', () => {
    expect(codegen(parser(trie.tryParsingAll('{: abc :}'))))
      .toBe($_`{ ab c }`)
  })

  it('should generate { \\text{d}x }', () => {
    expect(codegen(parser(trie.tryParsingAll('{: "d"x :}'))))
      .toBe($_`{ \text{d} x }`)
  })

  it('should generate {: ... ]', () => {
    expect(codegen(parser(trie.tryParsingAll('{: 1,2;3,4]'))))
      .toBe($_`\left. \begin{array}{cc} 1 & 2 \\ 3 & 4 \end{array} \right]`)
  })
})
