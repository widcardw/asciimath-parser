import { describe, expect, it } from 'vitest'
import { AsciiMath } from '../src'
import { parser } from '../src/parser'
import { createTrie } from '../src/trie'

describe('parser', () => {
  const trie = createTrie()
  it('should parse a const token', () => {
    expect(parser(trie.tryParsingAll('sum otherwise'))).toMatchSnapshot()
  })
  it('should parse a flat matrix', () => {
    expect(parser(trie.tryParsingAll('[a,b,c;d,e;f]'))).toMatchSnapshot()
  })
  it('should parse inline array', () => {
    expect(parser(trie.tryParsingAll('A=[a,b,c,d]'))).toMatchSnapshot()
  })
  it('should parse a recursive matirx', () => {
    expect(parser(trie.tryParsingAll('B = [[a,b],c;d,e]'))).toMatchSnapshot()
  })
  it('should parse unfinished matrix', () => {
    expect(parser(trie.tryParsingAll('[a,b,c;d,e;f'))).toMatchSnapshot()
  })
  it('should parse a divided matrix', () => {
    expect(parser(trie.tryParsingAll('[a,b|c;d,e|f]'))).toMatchSnapshot()
  })
  it('should parse an upper triangle mat', () => {
    expect(parser(trie.tryParsingAll('[a,b;,d]'))).toMatchSnapshot()
  })
  it('should parse a mat without right paren', () => {
    expect(parser(trie.tryParsingAll('[a,b;c'))).toMatchSnapshot()
  })
})

describe('cases matrix', () => {
  const trie = createTrie()
  it('should parse cases', () => {
    expect(parser(trie.tryParsingAll('f(x)={x^2, if x>0; x, otherwise:}'))).toMatchSnapshot()
  })
})

describe('parse det', () => {
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
  it('should parse a det with inner parens', () => {
    expect(parser(trie.tryParsingAll('|1,2;(3 + 4)^7,4|'))).toMatchSnapshot()
  })
})

const CODE = 'x & |-> "e"x\n\nf(x) & -> g(x)'

describe('parse aligned expressions', () => {
  const trie = createTrie()
  it('should parse an aligend expression of 2 lines', () => {
    expect(parser(trie.tryParsingAll(CODE))).toMatchSnapshot()
  })
})

describe('parse expression like sup and sub', () => {
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

describe('parse operator `op a b`', () => {
  const trie = createTrie()
  it('should parse frac', () => {
    expect(parser(trie.tryParsingAll('frac(a + b^2)(b)'))).toMatchSnapshot()
  })
})

describe('parse operator A op B', () => {
  const trie = createTrie()
  it('should parse `/`', () => {
    expect(parser(trie.tryParsingAll('a/b'))).toMatchSnapshot()
    expect(parser(trie.tryParsingAll('a + a/b + c'))).toMatchSnapshot()
  })

  it('should parse more `/`', () => {
    expect(parser(trie.tryParsingAll('(a + c)/(b * d)'))).toMatchSnapshot()
    expect(parser(trie.tryParsingAll('(a + c)/(b ^ d)'))).toMatchSnapshot()
    expect(parser(trie.tryParsingAll('(a + c)/(b / d)'))).toMatchSnapshot()
    expect(parser(trie.tryParsingAll('(a + c)/(b / d + e)'))).toMatchSnapshot()
  })

  it('should parse `!`', () => {
    expect(parser(trie.tryParsingAll('n!!m!'))).toMatchSnapshot()
    expect(parser(trie.tryParsingAll('1/n!'))).toMatchSnapshot()
    expect(parser(trie.tryParsingAll('(n+m)!'))).toMatchSnapshot()
  })

  it('should parse single right paren', () => {
    expect(parser(trie.tryParsingAll(')'))).toMatchSnapshot()
  })
})

describe('test color', () => {
  it('should parse color', () => {
    const trie = createTrie()
    const tokens = trie.tryParsingAll('color(green)[1,2],3')
    expect(tokens).toMatchSnapshot()
    const node = parser(tokens)
    expect(node).toMatchSnapshot()
  })
  it('should parse correct color', () => {
    const am = new AsciiMath({ display: false })
    expect(am.toTex('color(green)(123) 456')).toMatchInlineSnapshot('"{ \\\\color{green} 123 } 456"')
    expect(am.toTex('m!')).toMatchInlineSnapshot('"{m !}"')
  })
})
