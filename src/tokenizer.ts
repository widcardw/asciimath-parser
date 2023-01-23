enum TokenType {
  Paren = 'Paren',
  NumberLiteral = 'NumberLiteral',
  StringLiteral = 'StringLiteral',
  SymbolLiteral = 'SymbolLiteral',
}

interface Token {
  type: TokenType
  value: string
}

const LETTERS = /[a-z]/i
const NUMBERS = /[0-9]/
const WHITESPACE = /\s/
// const SYMBOLS = /[\/\\\+\-\=\_\^\!\'\"\:\;\,\.\?\*\|\>\<\@\~]/

function tokenizer(code: string): Token[] {
  const tokens: Token[] = []
  let current = 0

  while (current < code.length) {
    let ch = code[current]
    if (WHITESPACE.test(ch)) {
      current++
      continue
    }
    if (ch === '(') {
      tokens.push({
        type: TokenType.Paren,
        value: ch,
      })
      ++current
      continue
    }

    if (ch === ')') {
      tokens.push({
        type: TokenType.Paren,
        value: ch,
      })
      ++current
      continue
    }

    if (LETTERS.test(ch)) {
      let value = ''
      while (LETTERS.test(ch) && current < code.length) {
        value += ch
        ch = code[++current]
      }
      tokens.push({
        type: TokenType.StringLiteral,
        value,
      })
    }

    if (NUMBERS.test(ch)) {
      let value = ''
      while (NUMBERS.test(ch) && current < code.length) {
        value += ch
        ch = code[++current]
      }
      tokens.push({
        type: TokenType.NumberLiteral,
        value,
      })
    }
  }
  return tokens
}

export {
  tokenizer,
  Token,
  TokenType,
}
