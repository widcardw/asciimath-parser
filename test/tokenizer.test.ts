import { describe, expect, it } from 'vitest'
import type { Token } from '../src/tokenizer'
import { TokenType, tokenizer } from '../src/tokenizer'

describe('tokenizer', () => {
  it('should tokenize left paren', () => {
    const code = '('
    const tokens: Token[] = [{ type: TokenType.Paren, value: '(' }]
    expect(tokenizer(code)).toEqual(tokens)
  })

  it('should tokenize right paren', () => {
    const code = ')'
    const tokens: Token[] = [{ type: TokenType.Paren, value: ')' }]
    expect(tokenizer(code)).toEqual(tokens)
  })

  it('should tokenize string', () => {
    const code = 'add'
    const tokens: Token[] = [{ type: TokenType.StringLiteral, value: 'add' }]
    expect(tokenizer(code)).toEqual(tokens)
  })

  it('should tokenize number', () => {
    const code = '22'
    const tokens: Token[] = [{ type: TokenType.NumberLiteral, value: '22' }]
    expect(tokenizer(code)).toEqual(tokens)
  })

  it('should tokenize expression', () => {
    const code = '(add 1 2)'
    const tokens: Token[] = [
      { type: TokenType.Paren, value: '(' },
      { type: TokenType.StringLiteral, value: 'add' },
      { type: TokenType.NumberLiteral, value: '1' },
      { type: TokenType.NumberLiteral, value: '2' },
      { type: TokenType.Paren, value: ')' },
    ]
    expect(tokenizer(code)).toEqual(tokens)
  })
})
