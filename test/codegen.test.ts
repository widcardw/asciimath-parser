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
})
