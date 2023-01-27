import { describe, expect, it } from 'vitest'
import { parser } from '../src/parser'
import { createTrie } from '../src/trie'

describe.skip('parser', () => {
  const trie = createTrie()
  it.skip('should parse a const token', () => {
    expect(parser(trie.tryParsingAll('sum otherwise'))).toMatchSnapshot()
  })
  it.skip('should parse a flat matrix', () => {
    expect(parser(trie.tryParsingAll('[a,b,c;d,e;f]'))).toMatchSnapshot()
  })
  it.skip('should parse inline array', () => {
    expect(parser(trie.tryParsingAll('A=[a,b,c,d]'))).toMatchSnapshot()
  })
  it.skip('should parse a recursive matirx', () => {
    expect(parser(trie.tryParsingAll('B = [[a,b],c;d,e]'))).toMatchSnapshot()
  })
  it.skip('should parse unfinished matrix', () => {
    expect(parser(trie.tryParsingAll('[a,b,c;d,e;f'))).toMatchSnapshot()
  })
  it.skip('should parse a divided matrix', () => {
    expect(parser(trie.tryParsingAll('[a,b|c;d,e|f]'))).toMatchSnapshot()
  })
})

describe.skip('cases matrix', () => {
  const trie = createTrie()
  it.skip('should parse cases', () => {
    expect(parser(trie.tryParsingAll('f(x)={x2, if x>0; x, otherwise:}'))).toMatchSnapshot()
  })
})

describe.skip('parse det', () => {
  const trie = createTrie()
  it('should parse a simple det', () => {
    expect(parser(trie.tryParsingAll('|1,2;3,4|'))).toMatchSnapshot()
  })
  it('should parse an inline det', () => {
    expect(parser(trie.tryParsingAll('|1,2;|'))).toMatchSnapshot()
  })
  it('should parse absolute value', () => {
    expect(parser(trie.tryParsingAll('|1,2|'))).toMatchSnapshot()
  })
  it('should parse a set expression', () => {
    expect(parser(trie.tryParsingAll('{(x,y)|x2+y2<=1}'))).toMatchSnapshot()
  })
})

const CODE = 'x & |-> "e"x\n\nf(x) & -> g(x)'

describe.skip('parse aligned expressions', () => {
  const trie = createTrie()
  it('should parse an aligend expression of 2 lines', () => {
    expect(parser(trie.tryParsingAll(CODE))).toMatchSnapshot()
  })
})

describe.skip('parse expression like sup and sub', () => {
  const trie = createTrie()
  it('should parse e^x', () => {
    expect(parser(trie.tryParsingAll('"e"^x'))).toMatchSnapshot()
  })

  it('should parse a complex sup expression', () => {
    expect(parser(trie.tryParsingAll('"e"^(x + 2x + 4x^2)'))).toMatchSnapshot()
  })

  it('should parse a expression which has both sup and sub expression', () => {
    expect(parser(trie.tryParsingAll('x^2_3'))).toMatchSnapshot()
    expect(parser(trie.tryParsingAll('x^(a_1)_2'))).toMatchSnapshot()
    expect(parser(trie.tryParsingAll('x^(x^(x^x))'))).toMatchSnapshot()
  })

  it('should parse an `abs` expression', () => {
    expect(parser(trie.tryParsingAll('abs xayz'))).toMatchSnapshot()
  })
})

describe.skip('parse operator `op a b`', () => {
  const trie = createTrie()
  it('should parse frac', () => {
    expect(parser(trie.tryParsingAll('frac(a + b^2)(b)'))).toMatchSnapshot()
  })
})
