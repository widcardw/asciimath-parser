import { describe, expect, it } from 'vitest'
import { AsciiMath } from '../src'
import { Trie, createTrie } from '../src/trie'

const MULTILINE_AM = `sum_(n=1)^(+oo)&=(pi^2/6)

f(x)&=x^2`

describe('trie fail', () => {
  it.fails('could not create Trie with no chars', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const trie = new Trie([])
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

describe('tokenize color', () => {
  const trie = createTrie()
  it('should tokenize color', () => {
    expect(trie.tryParsingAll('color(pink)(123)')).toMatchSnapshot()
  })

  it('should tokenize rgb color', () => {
    expect(trie.tryParsingAll('color(#114514)(123)')).toMatchSnapshot()
  })
})

describe('tokenize text', () => {
  const trie = createTrie()
  it('should tokenize text', () => {
    expect(trie.tryParsingAll('text padding')).toMatchInlineSnapshot(`
      [
        {
          "current": 12,
          "isKeyWord": false,
          "tex": "padding",
          "type": "Text",
          "value": "padding",
        },
      ]
    `)
  })
  it('should tokenize text', () => {
    expect(trie.tryParsingAll('text(why spacing    )')).toMatchInlineSnapshot(`
      [
        {
          "current": 21,
          "isKeyWord": false,
          "tex": "why spacing    ",
          "type": "Text",
          "value": "why spacing    ",
        },
      ]
    `)
  })

  it('should tokenize tex', () => {
    expect(trie.tryParsingAll('tex(\\hbar)')).toMatchInlineSnapshot(`
      [
        {
          "current": 10,
          "isKeyWord": false,
          "tex": "\\\\hbar",
          "type": "Const",
          "value": "\\\\hbar",
        },
      ]
    `)
  })

  it('should generate tex', () => {
    const am = new AsciiMath()
    expect(am.toTex('tex(\\hbar)')).toMatchInlineSnapshot('"\\\\displaystyle{ \\\\hbar }"')
  })
})
