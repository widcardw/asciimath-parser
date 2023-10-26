import { describe, expect, it } from 'vitest'
import { TokenTypes } from '../src'
import type { TokenizedValue } from '../src/trie'
import { Trie, createTrie } from '../src/trie'
import type { PR } from './utils/remove-position'
import { removeTex } from './utils/remove-position'

describe('trie fail', () => {
  it.fails('could not create Trie with no chars', () => {
    const _trie = new Trie([])
  })
  it.fails('could not insert keyword that contains character that greater than \\uffff', () => {
    const trie = new Trie(['🤤', ...Array.from({ length: 26 }, (_, i) => i).map(i => String.fromCharCode(65 + i))])
    trie.insert('🤤')
  })
})

describe('trie success', () => {
  it('should build trie', () => {
    const keys = Array.from({ length: 26 }, (_, i) => String.fromCharCode(i + 97))
    keys.push(' ')
    const trie = new Trie(keys)
    trie.insert('banana')
    trie.insert('ban')
    trie.insert('abc')
    trie.insert('abda')

    expect(trie).toMatchSnapshot()
    expect(trie.search('ban')).toBe(true)
    expect(trie.search('aaaa')).toBe(false)
    expect(trie.search('bananan')).toBe(false)
    // directly search keyword
    expect(removeTex(trie.tryParsing([...'banana']))).toEqual(
      { isKeyWord: true, value: 'banana' },
    )
    // match the longest keyword and return the keyword
    expect(removeTex(trie.tryParsing([...'bananan']))).toEqual(
      { isKeyWord: true, value: 'banana' },
    )
    // it does not match any keyword
    expect(removeTex(trie.tryParsing([...'bab']))).toEqual<PR>(
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'ba' },
    )
    // skip when meeting a space
    expect(removeTex(trie.tryParsing([...'ab cfdgerafw']))).toEqual<PR>(
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'ab' },
    )
    // maybe it is somewhat strange...
    expect(removeTex(trie.tryParsing([...'bana']))).toEqual<PR>(
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'bana' },
    )
  })
})

describe('asciimath matrix', () => {
  const trie = createTrie()
  it('should build the symbol trie', () => {
    expect(removeTex(trie.tryParsingAll('&sum\n\nf(x)&=x^2'))).toEqual<PR[]>([
      { isKeyWord: true, type: TokenTypes.Align, value: '&' },
      { isKeyWord: true, type: TokenTypes.Const, value: 'sum' },
      { isKeyWord: true, type: TokenTypes.Align, value: '\n\n' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'f' },
      { isKeyWord: true, type: TokenTypes.LParen, value: '(' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'x' },
      { isKeyWord: true, type: TokenTypes.RParen, value: ')' },
      { isKeyWord: true, type: TokenTypes.Align, value: '&' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: '=' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'x' },
      { isKeyWord: true, type: TokenTypes.OperatorSup, value: '^' },
      { isKeyWord: false, type: TokenTypes.NumberLiteral, value: '2' },
    ])
    expect(removeTex(trie.tryParsingAll('x |-> "e"^(2pi "i" x)'))).toEqual<PR[]>([
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'x' },
      { isKeyWord: true, type: TokenTypes.Const, value: '|->' },
      { isKeyWord: false, type: TokenTypes.Text, value: 'e' },
      { isKeyWord: true, type: TokenTypes.OperatorSup, value: '^' },
      { isKeyWord: true, type: TokenTypes.LParen, value: '(' },
      { isKeyWord: false, type: TokenTypes.NumberLiteral, value: '2' },
      { isKeyWord: true, type: TokenTypes.Const, value: 'pi' },
      { isKeyWord: false, type: TokenTypes.Text, value: 'i' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'x' },
      { isKeyWord: true, type: TokenTypes.RParen, value: ')' },
    ])
    expect(removeTex(trie.tryParsingAll('"e"^("i" pi)'))).toEqual<PR[]>([
      { isKeyWord: false, type: TokenTypes.Text, value: 'e' },
      { isKeyWord: true, type: TokenTypes.OperatorSup, value: '^' },
      { isKeyWord: true, type: TokenTypes.LParen, value: '(' },
      { isKeyWord: false, type: TokenTypes.Text, value: 'i' },
      { isKeyWord: true, type: TokenTypes.Const, value: 'pi' },
      { isKeyWord: true, type: TokenTypes.RParen, value: ')' },
    ])
  })

  it('should tokenize a matrix', () => {
    expect(removeTex(trie.tryParsingAll('[a,b,c;d,e;f}'))).toEqual<PR[]>([
      { isKeyWord: true, type: TokenTypes.LParen, value: '[' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'a' },
      { isKeyWord: true, type: TokenTypes.Split, value: ',' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'b' },
      { isKeyWord: true, type: TokenTypes.Split, value: ',' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'c' },
      { isKeyWord: true, type: TokenTypes.Split, value: ';' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'd' },
      { isKeyWord: true, type: TokenTypes.Split, value: ',' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'e' },
      { isKeyWord: true, type: TokenTypes.Split, value: ';' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'f' },
      { isKeyWord: true, type: TokenTypes.RParen, value: '}' },
    ])
  })

  it('should tokenize a recursive matrix', () => {
    expect(removeTex(trie.tryParsingAll('[[a,b],c;d,e:}'))).toEqual<PR[]>([
      { isKeyWord: true, type: TokenTypes.LParen, value: '[' },
      { isKeyWord: true, type: TokenTypes.LParen, value: '[' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'a' },
      { isKeyWord: true, type: TokenTypes.Split, value: ',' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'b' },
      { isKeyWord: true, type: TokenTypes.RParen, value: ']' },
      { isKeyWord: true, type: TokenTypes.Split, value: ',' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'c' },
      { isKeyWord: true, type: TokenTypes.Split, value: ';' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'd' },
      { isKeyWord: true, type: TokenTypes.Split, value: ',' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'e' },
      { isKeyWord: true, type: TokenTypes.RParen, value: ':}' },
    ])
  })

  it('should tokenize a divided matrix', () => {
    const m = `[
      a, b, |, c;
      d, e, |, f;
    ]`
    expect(removeTex(trie.tryParsingAll(m))).toEqual<PR[]>([
      { isKeyWord: true, type: TokenTypes.LParen, value: '[' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'a' },
      { isKeyWord: true, type: TokenTypes.Split, value: ',' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'b' },
      { isKeyWord: true, type: TokenTypes.Split, value: ',' },
      { isKeyWord: true, type: TokenTypes.Paren, value: '|' },
      { isKeyWord: true, type: TokenTypes.Split, value: ',' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'c' },
      { isKeyWord: true, type: TokenTypes.Split, value: ';' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'd' },
      { isKeyWord: true, type: TokenTypes.Split, value: ',' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'e' },
      { isKeyWord: true, type: TokenTypes.Split, value: ',' },
      { isKeyWord: true, type: TokenTypes.Paren, value: '|' },
      { isKeyWord: true, type: TokenTypes.Split, value: ',' },
      { isKeyWord: false, type: TokenTypes.StringLiteral, value: 'f' },
      { isKeyWord: true, type: TokenTypes.Split, value: ';' },
      { isKeyWord: true, type: TokenTypes.RParen, value: ']' },
    ])
  })
})

describe('tokenize color', () => {
  const trie = createTrie()
  it('should tokenize color', () => {
    expect(removeTex(trie.tryParsingAll('color(pink)(123)'))).toEqual<PR[]>([
      { eatNext: true, isKeyWord: true, type: TokenTypes.OperatorOAB, value: 'color' },
      { isKeyWord: false, type: TokenTypes.Const, value: 'pink' },
      { isKeyWord: true, type: TokenTypes.LParen, value: '(' },
      { isKeyWord: false, type: TokenTypes.NumberLiteral, value: '123' },
      { isKeyWord: true, type: TokenTypes.RParen, value: ')' },
    ])
  })

  it('should tokenize rgb color', () => {
    expect(removeTex(trie.tryParsingAll('color(#114514)(123)'))).toEqual<PR[]>([
      { eatNext: true, isKeyWord: true, type: TokenTypes.OperatorOAB, value: 'color' },
      { isKeyWord: false, type: TokenTypes.Const, value: '#114514' },
      { isKeyWord: true, type: TokenTypes.LParen, value: '(' },
      { isKeyWord: false, type: TokenTypes.NumberLiteral, value: '123' },
      { isKeyWord: true, type: TokenTypes.RParen, value: ')' },
    ])
  })
})

describe('tokenize text', () => {
  const trie = createTrie()
  it('should tokenize text', () => {
    expect(removeTex(trie.tryParsingAll('text padding'))).toEqual<PR[]>([
      { eatNext: true, isKeyWord: true, type: TokenTypes.OperatorOA, value: 'text' },
      { isKeyWord: false, type: TokenTypes.Const, value: 'padding' },
    ])
  })
  it('should tokenize text', () => {
    expect(removeTex(trie.tryParsingAll('text(why spacing    )'))).toEqual<PR[]>([
      { eatNext: true, isKeyWord: true, type: TokenTypes.OperatorOA, value: 'text' },
      { isKeyWord: false, type: TokenTypes.Const, value: 'why spacing    ' },
    ])
  })

  it('should tokenize tex', () => {
    expect(removeTex(trie.tryParsingAll('tex"\\hbar"'))).toEqual<PR[]>([
      { eatNext: true, isKeyWord: true, type: TokenTypes.OperatorOA, value: 'tex' },
      { isKeyWord: false, type: TokenTypes.Const, value: '\\hbar' },
    ])
  })
})
