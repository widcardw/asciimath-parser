import { describe, expect, it } from 'vitest'
import { codegen } from '../src/codegen'
import { parser } from '../src/parser'
import { createTrie } from '../src/trie'

describe('codegen matrix', () => {
  const trie = createTrie()
  it('should generate matrix', () => {
    expect(codegen(parser(trie.tryParsingAll('[a,b;c,d]')))).toMatchSnapshot()
  })

  it('should generate divided matrix', () => {
    expect(codegen(parser(trie.tryParsingAll('[a,b|c;d,e|f]')))).toMatchSnapshot()
    expect(codegen(parser(trie.tryParsingAll('[a,b|c,d|e;f,g|h,i|j]')))).toMatchSnapshot()
  })

  it('should generate det', () => {
    expect(codegen(parser(trie.tryParsingAll('|a,b;d,e|')))).toMatchSnapshot()
  })

  it('should generate cases', () => {
    expect(codegen(parser(trie.tryParsingAll('f(x) = { x^2, if x>0; x, otherwise :}')))).toMatchSnapshot()
  })

  it('should generate recursive matrix', () => {
    expect(codegen(parser(trie.tryParsingAll('[(0;0),(0;1);(1;0),(1;1)]')))).toMatchSnapshot()
  })
})

describe('codegen align', () => {
  const trie = createTrie()
  it('should generate aligend environment', () => {
    expect(codegen(parser(trie.tryParsingAll('varphi(x) & = Phi\'(x) \n\n & = 1/(sqrt(2pi) sigma) "e"^(- ((x-mu)^2)/(2sigma^2))')))).toMatchSnapshot()
  })
})

describe('codegen superfluous `^`', () => {
  const trie = createTrie()
  it('should not generate secondary sup', () => {
    expect(codegen(parser(trie.tryParsingAll('x^2^3')))).toMatchSnapshot()
  })
  it('should generate correct sup and sub', () => {
    expect(codegen(parser(trie.tryParsingAll('sum_(n=1)^(+oo) 1/(n^2) = (pi^2)/6')))).toMatchSnapshot()
  })
})

describe('codegen {: any :}', () => {
  const trie = createTrie()
  it('should generate { abc }', () => {
    expect(codegen(parser(trie.tryParsingAll('{: abc :}')))).toMatchInlineSnapshot('"{ ab c }"')
  })

  it('should generate { \\text{d}x }', () => {
    expect(codegen(parser(trie.tryParsingAll('{: "d"x :}')))).toMatchInlineSnapshot('"{ \\\\text{d} x }"')
  })

  it('should generate {: ... ]', () => {
    expect(codegen(parser(trie.tryParsingAll('{: 1,2;3,4]')))).toMatchInlineSnapshot('"\\\\left. \\\\begin{array}{cc} 1 & 2 \\\\\\\\ 3 & 4 \\\\end{array} \\\\right]"')
  })
})
