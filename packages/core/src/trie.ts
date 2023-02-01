import { SYMBOLMAP, TokenTypes } from './symbols'

interface TokenizedValue {
  value: string
  isKeyWord: boolean
  current: number
  tex: string
  type: TokenTypes
}

const NUMBERPATTERN = /[0-9]/
const STRINGPATTERN = /\S/

class Trie {
  private _root: TrieNode
  private _char_to_index: Map<string, number> = new Map()
  private _n: number
  // public MAP: Map<string, {
  //   type: TokenTypes
  //   tex: string
  // }> = new Map()

  public constructor(nodes: string[]) {
    if (nodes.length === 0)
      throw new Error('Cannot create Trie since the length of nodes is 0')

    nodes.forEach((n) => {
      if (n.length !== 1)
        throw new Error(`Value \`${n}\` is invalid, the length of char must be 1`)
    })

    const dedupped = Array.from(new Set(nodes))

    this._n = dedupped.length
    this._root = new TrieNode(this._n)
    dedupped.forEach((ch, i) => {
      this._char_to_index.set(ch, i)
    })
  }

  private c2i(key: string) {
    return this._char_to_index.get(key)
  }

  public insert(key: string) {
    if (key.length === 0)
      return

    let root = this._root

    ;([...key]).forEach((ch, i) => {
      const idx = this.c2i(ch)
      if (typeof idx === 'undefined')
        throw new Error(`key \`${ch}\` not in key set`)
      if (root._nextNode[idx] === null)
        root._nextNode[idx] = new TrieNode(this._n)
      root = root._nextNode[idx]!
      if (i === key.length - 1)
        root._end = true
    })
  }

  public search(word: string): boolean {
    if ((!this._root._nextNode.find(i => i !== null)) || word.length === 0)
      return false
    let root = this._root
    let i = 0
    for (; i < word.length; i++) {
      const ch = word[i]
      const idx = this.c2i(ch)
      if (typeof idx === 'undefined')
        throw new Error(`key \`${ch}\` not in key set`)
      if (root._nextNode[idx] === null)
        return false
      root = root._nextNode[idx]!
    }
    if (i === word.length)
      return true
    return false
  }

  /**
   * @param word input string
   * @returns value: matched keyword
   * current: the string cursor
   */
  public tryParsing(word: string, start = 0): TokenizedValue {
    let value = ''
    let root = this._root
    let isKeyWord = false
    let current = start
    // let depth = 0
    for (; current < word.length; current++) {
      const ch = word[current]
      // console.log('depth', depth, ch)

      // the spaces are processed in `tryParsingAll`
      // if (/\s/.test(ch)) {
      //   current++
      //   break
      // }

      const idx = this.c2i(ch)
      // cannot find key in symbol map
      if (typeof idx === 'undefined')
        break

      if (root._nextNode[idx] === null)
        break

      value += ch
      root = root._nextNode[idx]!
      isKeyWord = root._end
      // depth++
    }
    const ret = (() => {
      if (isKeyWord)
        return SYMBOLMAP.get(value)!
      return { tex: value, type: TokenTypes.StringLiteral }
    })()
    return { value, isKeyWord, current, ...ret }
  }

  public tryParsingNumber(word: string, current: number): TokenizedValue {
    let ch = word[current]
    let value = ''
    while (NUMBERPATTERN.test(ch) && current < word.length) {
      value += ch
      ch = word[++current]
    }
    return { value, isKeyWord: false, current, tex: value, type: TokenTypes.NumberLiteral }
  }

  public tryParsingString(word: string, current: number): TokenizedValue {
    let ch = word[current]
    let value = ''
    while (STRINGPATTERN.test(ch) && current < word.length) {
      const idx = this.c2i(ch)
      if (typeof idx !== 'undefined' && this._root._nextNode[idx] !== null)
        break
      value += ch
      ch = word[++current]
    }
    return { value, isKeyWord: false, current, tex: value, type: TokenTypes.StringLiteral }
  }

  public tryParsingNewLines(word: string, current: number): TokenizedValue {
    let ch = word[current]
    let value = ''
    while (/\n/.test(ch) && current < word.length) {
      value += ch
      ch = word[++current]
    }
    if (value.length >= 2)
      return { value, isKeyWord: true, current, tex: '\\\\', type: TokenTypes.Align }
    else
      return { value: '', isKeyWord: false, current, tex: '', type: TokenTypes.None }
  }

  public tryParsingText(word: string, current: number): TokenizedValue {
    let ch = word[current]
    if (ch === '"') {
      ch = word[++current]
      let value = ''
      while (ch !== '"' && current < word.length) {
        value += ch
        ch = word[++current]
      }
      if (ch === '"') {
        current++
        return { value, isKeyWord: false, current, tex: value, type: TokenTypes.Text }
      }
    }
    return { value: '', isKeyWord: false, current, tex: '', type: TokenTypes.None }
  }

  public tryParsingAll(word: string) {
    let current = 0
    const tokens: TokenizedValue[] = []
    let counter = 0
    while (current < word.length) {
      {
        const t = this.tryParsingNewLines(word, current)
        current = t.current
        if (t.value !== '') {
          tokens.push(t)
          continue
        }
      }
      // process spaces
      if (/\s/.test(word[current])) {
        current++
        continue
      }
      // process potential keywords
      const t = this.tryParsing(word, current)
      current = t.current
      if (t.value !== '') {
        tokens.push(t)
        continue
      }
      // process numbers
      {
        const t = this.tryParsingNumber(word, current)
        current = t.current
        if (t.value !== '') {
          tokens.push(t)
          continue
        }
      }
      // process text wrapped with double quote
      {
        const t = this.tryParsingText(word, current)
        current = t.current
        if (t.value !== '') {
          tokens.push(t)
          continue
        }
      }
      // process other string
      {
        const t = this.tryParsingString(word, current)
        current = t.current
        if (t.value !== '') {
          tokens.push(t)
          continue
        }
      }
      counter++
      if (counter > word.length * 2)
        throw new Error('Oops! There may be an infinity loop')
    }
    return tokens
  }
}

class TrieNode {
  _nextNode: (TrieNode | null)[] = []
  _end = false
  constructor(n: number) {
    this._nextNode = Array.from({ length: n }, () => null)
  }
}

function createTrie(config: {
  extConst?: Array<[string, string]>
} = {}) {
  const charset: Set<string> = new Set([])
  config.extConst?.forEach(([k, v]) => {
    SYMBOLMAP.set(k, { type: TokenTypes.Const, tex: v })
  })
  for (const k of SYMBOLMAP.keys())
    k.split('').forEach(i => charset.add(i))
  const chars = Array.from(charset)
  chars.push(' ')

  const trie = new Trie(chars)
  for (const k of SYMBOLMAP.keys())
    trie.insert(k)

  // trie.MAP = SYMBOLMAP
  return trie
}

export {
  Trie,
  TrieNode,
  createTrie,
  TokenizedValue,
}
