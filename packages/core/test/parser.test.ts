import { describe, expect, it } from 'vitest'
import { AsciiMath, TokenTypes } from '../src'
import { AlignDirection, parser } from '../src/parser'
import { createTrie } from '../src/trie'
import {
  flat,
  frac,
  lp,
  mat,
  opOA,
  opOAB,
  root,
  rp,
  sup,
  u,
} from './utils/build-node'
import type { PR } from './utils/remove-position'
import { removeTex } from './utils/remove-position'
import { removeValue } from './utils/removeValue'
import { $_ } from './utils/string-raw'

describe('parser', () => {
  const trie = createTrie()
  it('should parse a const token', () => {
    expect(removeValue(parser(trie.tryParsingAll('sum otherwise')))).toEqual(
      root(u('\\sum'), u('\\text{otherwise}\\quad')),
    )
  })
  it('should parse a flat matrix', () => {
    expect(removeValue(parser(trie.tryParsingAll('[a,b,c;d,e;f]')))).toEqual(
      root(
        mat([
          [u('a'), u('b'), u('c')],
          [u('d'), u('e')],
          [u('f')],
        ]),
      ),
    )
  })
  it('should parse inline array', () => {
    expect(removeValue(parser(trie.tryParsingAll('A=[a,b,c,d]')))).toEqual(
      root(
        u('A'),
        u('='),
        flat(
          lp('['),
          u('a'),
          u(','),
          u('b'),
          u(','),
          u('c'),
          u(','),
          u('d'),
          rp(']'),
        ),
      ),
    )
  })
  it('should parse a recursive matirx', () => {
    expect(
      removeValue(parser(trie.tryParsingAll('B = [[a,b],c;d,e]'))),
    ).toEqual(
      root(
        u('B'),
        u('='),
        mat([
          [
            flat(lp('['), u('a'), u(','), u('b'), rp(']')),
            u('c'),
          ],
          [u('d'), u('e')],
        ]),
      ),
    )
  })
  it('should parse unfinished matrix', () => {
    expect(removeValue(parser(trie.tryParsingAll('[a,b,c;d,e;f')))).toEqual(
      root(
        flat(
          lp('['),
          u('a'),
          u(','),
          u('b'),
          u(','),
          u('c'),
          u(';'),
          u('d'),
          u(','),
          u('e'),
          u(';'),
          u('f'),
          rp('.'),
        ),
      ),
    )
  })
  it('should parse a divided matrix', () => {
    expect(removeValue(parser(trie.tryParsingAll('[a,b|c;d,e|f]')))).toEqual(
      root(
        mat(
          [
            [u('a'), u('b'), u('c')],
            [u('d'), u('e'), u('f')],
          ],
          { dividerIndices: [2] },
        ),
      ),
    )
  })
  it('should parse an upper triangle mat', () => {
    expect(removeValue(parser(trie.tryParsingAll('[a,b;,d]')))).toEqual(
      root(
        mat([
          [u('a'), u('b')],
          [
            u(''),
            u('d'), 
          ],
        ]),
      ),
    )
  })
  it('should parse a mat without right paren', () => {
    expect(removeValue(parser(trie.tryParsingAll('[a,b;c')))).toEqual(
      root(flat(lp('['), u('a'), u(','), u('b'), u(';'), u('c'), rp('.'))),
    )
  })
})

describe('cases matrix', () => {
  const trie = createTrie()
  it('should parse cases', () => {
    expect(
      removeValue(
        parser(trie.tryParsingAll('f(x)={x^2, if x>0; x, otherwise:}')),
      ),
    ).toEqual(
      root(
        u('f'),
        flat(lp('('), u('x'), rp(')')),
        u('='),
        mat(
          [
            [
              flat(u('x'), sup('^', u('2'))), // TODO: 待优化
              flat(u('\\text{if}\\quad'), u('x'), u('>'), u('0')),
            ],
            [u('x'), u('\\text{otherwise}\\quad')],
          ],
          { l: '\\lbrace', r: '.', alignment: AlignDirection.Left },
        ),
      ),
    )
  })
})

// TODO FIX
describe('parse det', () => {
  const trie = createTrie()
  it('should parse a simple det', () => {
    expect(removeValue(parser(trie.tryParsingAll('|1,2;3,4|')))).toEqual(
      root(
        mat(
          [
            [u('1'), u('2')],
            [u('3'), u('4')],
          ],
          { l: '|', r: '|' },
        ),
      ),
    )
  })

  // TODO FIX
  it('should parse an inline det', () => {
    expect(removeValue(parser(trie.tryParsingAll('|1,2;|')))).toEqual(
      root(mat([[u('1'), u('2')]], { l: '|', r: '|' })),
    )
  })
  it('should parse absolute value', () => {
    expect(removeValue(parser(trie.tryParsingAll('|1,2|')))).toEqual(
      root(flat(lp('|'), u('1'), u(','), u('2'), rp('|'))),
    )
  })
  it('should parse a set expression', () => {
    expect(
      removeValue(parser(trie.tryParsingAll('{(x,y)|x^2+y^2<=1}'))),
    ).toEqual(
      root(
        flat(
          lp('{'),
          flat(lp('('), u('x'), u(','), u('y'), rp(')')),
          u('\\mid'),
          flat(u('x'), sup('^', u('2'))),
          u('+'),
          flat(u('y'), sup('^', u('2'))),
          u('\\leqslant'),
          u('1'),
          rp('}'),
        ),
      ),
    )
  })
  // TODO FIX
  it('should parse a det with inner parens', () => {
    expect(
      removeValue(parser(trie.tryParsingAll('|1,2;(3 + 4)^7,4|'))),
    ).toEqual(
      root(
        mat(
          [
            [u('1'), u('2')],
            [
              flat(
                lp('('),
                u('3'),
                u('+'),
                u('4'),
                rp(')'), // TODO
                sup('^', u('7')),
              ),
              u('4'),
            ],
          ],
          { l: '|', r: '|' },
        ),
      ),
    )
  })
})

describe('parse aligned expressions', () => {
  const CODE = 'x & |-> "e"x\n\nf(x) & -> g(x)'
  const trie = createTrie()
  it('should parse an aligend expression of 2 lines', () => {
    expect(removeValue(parser(trie.tryParsingAll(CODE)))).toEqual(
      root(
        u('x'),
        u('&'),
        u('\\mapsto'),
        u('\\text{e}'),
        u('x'),
        u('\\\\'),
        u('f'),
        flat(lp('('), u('x'), rp(')')),
        u('&'),
        u('\\to'),
        u('g'),
        flat(lp('('), u('x'), rp(')')),
      ),
    )
  })
})

describe('parse expression like sup and sub', () => {
  const trie = createTrie()
  it('should parse e^x', () => {
    expect(removeValue(parser(trie.tryParsingAll('"e"^x')))).toEqual(
      root(flat(u('\\text{e}'), sup('^', u('x')))),
    )
  })

  it('should parse a complex sup expression', () => {
    expect(
      removeValue(parser(trie.tryParsingAll('"e"^(x + 2x + 4x^2)'))),
    ).toEqual(
      root(
        flat(
          u('\\text{e}'),
          sup(
            '^',
            flat(
              u('x'),
              u('+'),
              u('2'),
              u('x'),
              u('+'),
              u('4'),
              flat(u('x'), sup('^', u('2'))), // TODO: why?
            ),
          ),
        ),
      ),
    )
  })

  it('should parse a expression which has both sup and sub expression', () => {
    expect(removeValue(parser(trie.tryParsingAll('x^2_3')))).toEqual(
      root(flat(u('x'), sup('^', u('2')), sup('_', u('3')))),
    )
    expect(removeValue(parser(trie.tryParsingAll('x^(a_1)_2')))).toEqual(
      root(
        flat(
          u('x'),
          sup('^', flat(u('a'), sup('_', u('1')))),
          sup('_', u('2')),
        ),
      ),
    )
    // TODO: why????
    expect(removeValue(parser(trie.tryParsingAll('x^(x^(x^x))')))).toEqual(
      root(
        flat(
          u('x'),
          sup('^', flat(u('x'), sup('^', flat(u('x'), sup('^', u('x')))))),
        ),
      ),
    )
  })

  it('should parse an `abs` expression', () => {
    expect(removeValue(parser(trie.tryParsingAll('abs xayz')))).toEqual(
      root(opOA($_`\left| $1 \right|`, u('x')), u('a'), u('y'), u('z')),
    )
  })
})

describe('parse operator `op a b`', () => {
  const trie = createTrie()
  it('should parse frac', () => {
    expect(removeValue(parser(trie.tryParsingAll('frac(a + b^2)(b)')))).toEqual(
      root(
        opOAB(
          '\\frac{ $1 }{ $2 }',
          flat(u('a'), u('+'), flat(u('b'), sup('^', u('2')))), // TODO
          u('b'),
        ),
      ),
    )
  })
})

describe('parse operator A op B', () => {
  const trie = createTrie()
  it('should parse `/`', () => {
    expect(removeValue(parser(trie.tryParsingAll('a/b')))).toEqual(
      root(frac(u('a'), u('b'))),
    )
    expect(removeValue(parser(trie.tryParsingAll('a + a/b + c')))).toEqual(
      root(u('a'), u('+'), frac(u('a'), u('b')), u('+'), u('c')),
    )
  })

  it('should parse more `/`', () => {
    expect(removeValue(parser(trie.tryParsingAll('(a + c)/(b * d)')))).toEqual(
      root(
        frac(flat(u('a'), u('+'), u('c')), flat(u('b'), u('\\cdot'), u('d'))),
      ),
    )
    expect(removeValue(parser(trie.tryParsingAll('(a + c)/(b ^ d)')))).toEqual(
      root(
        frac(
          flat(u('a'), u('+'), u('c')),
          flat(u('b'), sup('^', u('d'))), // TODO
        ),
      ),
    )
    expect(removeValue(parser(trie.tryParsingAll('(a + c)/(b / d)')))).toEqual(
      root(frac(flat(u('a'), u('+'), u('c')), frac(u('b'), u('d')))),
    )
    expect(
      removeValue(parser(trie.tryParsingAll('(a + c)/(b / d + e)'))),
    ).toEqual(
      root(
        frac(
          flat(u('a'), u('+'), u('c')),
          flat(frac(u('b'), u('d')), u('+'), u('e')),
        ),
      ),
    )
  })

  it('should parse `!`', () => {
    expect(removeValue(parser(trie.tryParsingAll('n!!m!')))).toEqual(
      root(opOA('{$1 !!}', u('n')), opOA('{$1 !}', u('m'))),
    )
    expect(removeValue(parser(trie.tryParsingAll('1/n!')))).toEqual(
      root(frac(u('1'), opOA('{$1 !}', u('n')))),
    )
    expect(removeValue(parser(trie.tryParsingAll('(n+m)!')))).toEqual(
      root(opOA('{$1 !}', flat(lp('('), u('n'), u('+'), u('m'), rp(')')))),
    )
  })

  it('should parse single right paren', () => {
    expect(removeValue(parser(trie.tryParsingAll(')')))).toEqual(root(u(')')))
  })
})

describe('test color', () => {
  it('should parse color', () => {
    const trie = createTrie()
    const tokens = trie.tryParsingAll('color(green)[1,2],3')
    expect(removeTex(structuredClone(tokens))).toEqual<PR[]>([
      {
        eatNext: true,
        isKeyWord: true,
        type: TokenTypes.OperatorOAB,
        value: 'color',
      },
      { isKeyWord: false, type: TokenTypes.Const, value: 'green' },
      { isKeyWord: true, type: TokenTypes.LParen, value: '[' },
      { isKeyWord: false, type: TokenTypes.NumberLiteral, value: '1' },
      { isKeyWord: true, type: TokenTypes.Split, value: ',' },
      { isKeyWord: false, type: TokenTypes.NumberLiteral, value: '2' },
      { isKeyWord: true, type: TokenTypes.RParen, value: ']' },
      { isKeyWord: true, type: TokenTypes.Split, value: ',' },
      { isKeyWord: false, type: TokenTypes.NumberLiteral, value: '3' },
    ])
    const node = parser(tokens)
    expect(removeValue(node)).toEqual(
      root(
        u(TokenTypes.OperatorOAB, {
          tex: '{ \\color{$1} $2 }',
          param1: u('green'),
          param2: flat(lp('['), u('1'), u(','), u('2'), rp(']')),
        }),
        u(','),
        u('3'),
      ),
    )
  })
  it('should parse correct color', () => {
    const am = new AsciiMath({ display: false })
    expect(am.toTex('color(green)(123) 456')).toBe(
      $_`{ \color{green} 123 } 456`,
    )
    expect(am.toTex('m!')).toBe('{m !}')
  })
})
