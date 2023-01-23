import { describe, expect, it } from 'vitest'
import { SYMBOLMAP } from '../src/symbols'
import { Trie } from '../src/trie'

const MULTILINE_AM = `sum_(n=1)^(+oo)&=(pi^2/6)

f(x)&=x^2`

describe('trie', () => {
  it.skip('should build trie', () => {
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
    // 直接搜索到关键词
    expect(trie.tryParsing('banana')).toMatchInlineSnapshot(`
      {
        "current": 6,
        "isKeyWord": true,
        "value": "banana",
      }
    `)
    // 当前单词比最长关键词长，那么到最长的关键词就结束
    expect(trie.tryParsing('bananan')).toMatchInlineSnapshot(`
      {
        "current": 6,
        "isKeyWord": true,
        "value": "banana",
      }
    `)
    expect(trie.tryParsing('bab')).toMatchInlineSnapshot(`
      {
        "current": 2,
        "isKeyWord": false,
        "value": "ba",
      }
    `)
    // 遇到空格跳过
    expect(trie.tryParsing('ab cfdgerafw')).toMatchInlineSnapshot(`
      {
        "current": 2,
        "isKeyWord": false,
        "value": "ab",
      }
    `)
    // 与关键字有相同的前缀
    expect(trie.tryParsing('bana')).toMatchInlineSnapshot(`
      {
        "current": 4,
        "isKeyWord": false,
        "value": "bana",
      }
    `)
  })

  it('should build the symbol trie', () => {
    const charset: Set<string> = new Set([])
    for (const k of SYMBOLMAP.keys())
      k.split('').forEach(i => charset.add(i))
    const chars = Array.from(charset)
    chars.push(' ')
    expect(chars).toMatchSnapshot()

    const trie = new Trie(chars)
    for (const k of SYMBOLMAP.keys())
      trie.insert(k)

    expect(trie.tryParsingAll(MULTILINE_AM)).toMatchSnapshot()
    expect(trie.tryParsingAll('x |-> "e"^(2pi "i" x)')).toMatchSnapshot()
    expect(trie.tryParsingAll('"e"^i pi')).toMatchInlineSnapshot(`
      [
        {
          "current": 3,
          "isKeyWord": false,
          "tex": "e",
          "type": "Text",
          "value": "e",
        },
        {
          "current": 4,
          "isKeyWord": true,
          "tex": "^{ $1 }",
          "type": "OperatorA",
          "value": "^",
        },
        {
          "current": 5,
          "isKeyWord": false,
          "tex": "i",
          "type": "StringLiteral",
          "value": "i",
        },
        {
          "current": 8,
          "isKeyWord": true,
          "tex": "\\\\pi",
          "type": "Const",
          "value": "pi",
        },
      ]
    `)
  })
})
