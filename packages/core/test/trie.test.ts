import { describe, expect, it } from 'vitest'
import { Trie, createTrie } from '../src/trie'

const MULTILINE_AM = `sum_(n=1)^(+oo)&=(pi^2/6)

f(x)&=x^2`

describe('trie', () => {
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
    // directly search keyword
    expect(trie.tryParsing('banana')).toMatchInlineSnapshot(`
      {
        "current": 6,
        "isKeyWord": true,
        "value": "banana",
      }
    `)
    // match the longest keyword and return the keyword
    expect(trie.tryParsing('bananan')).toMatchInlineSnapshot(`
      {
        "current": 6,
        "isKeyWord": true,
        "value": "banana",
      }
    `)
    // it does not match any keyword
    expect(trie.tryParsing('bab')).toMatchInlineSnapshot(`
      {
        "current": 2,
        "isKeyWord": false,
        "tex": "ba",
        "type": "StringLiteral",
        "value": "ba",
      }
    `)
    // skip when meeting a space
    expect(trie.tryParsing('ab cfdgerafw')).toMatchInlineSnapshot(`
      {
        "current": 2,
        "isKeyWord": false,
        "tex": "ab",
        "type": "StringLiteral",
        "value": "ab",
      }
    `)
    // maybe it is somewhat strange...
    expect(trie.tryParsing('bana')).toMatchInlineSnapshot(`
      {
        "current": 4,
        "isKeyWord": false,
        "tex": "bana",
        "type": "StringLiteral",
        "value": "bana",
      }
    `)
  })
})

describe('asciimath matrix', () => {
  const trie = createTrie()
  it('should build the symbol trie', () => {
    expect(trie.tryParsingAll(MULTILINE_AM)).toMatchSnapshot()
    expect(trie.tryParsingAll('x |-> "e"^(2pi "i" x)')).toMatchSnapshot()
    expect(trie.tryParsingAll('"e"^("i" pi)')).toMatchSnapshot()
  })

  it('should tokenize a matrix', () => {
    expect(trie.tryParsingAll('[a,b,c;d,e;f}')).toMatchSnapshot()
  })

  it('should tokenize a recursive matrix', () => {
    expect(trie.tryParsingAll('[[a,b],c;d,e:}')).toMatchSnapshot()
  })

  it('should tokenize a divided matrix', () => {
    const m = `[
      a, b, |, c;
      d, e, |, f;
      g, | h, i
    ]`
    expect(trie.tryParsingAll(m)).toMatchSnapshot()
  })

  it('should tokenize cases', () => {
    expect(trie.tryParsingAll('f(x)={x^2,if x>0;x, otherwise:}')).toMatchSnapshot()
  })
})
