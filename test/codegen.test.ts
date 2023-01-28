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
