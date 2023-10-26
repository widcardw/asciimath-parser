import type { TokenizedValue } from '../../src/trie'

type MaybeArray<T> = T | T[]

type Omits<T, K extends string | string[]>
= K extends string
  ? Omit<T, K>
  : K extends [infer F extends string]
    ? Omit<T, F>
    : K extends [infer F extends string, ...infer R extends string[]]
      ? Omits<Omit<T, F>, R>
      : {}

type PR = Omits<TokenizedValue, ['pos', 'current', 'tex']>

function removeProperties<
T extends Record<string, any>,
K extends Array<keyof T> extends Array<string>
  ? Array<keyof T>
  : never,
>(tokens: T, props: K): Omits<T, K>
function removeProperties<
T extends Record<string, any>,
K extends Array<keyof T> extends Array<string>
  ? Array<keyof T>
  : never,
>(tokens: T[], props: K): Omits<T, K>[]
function removeProperties<
T extends Record<string, any>,
K extends Array<keyof T> extends Array<string>
  ? Array<keyof T>
  : never,
>(tokens: T | T[], props: K): MaybeArray<Omits<T, K>> {
  if (Array.isArray(tokens)) {
    for (const token of tokens) {
      for (const prop of props) {
        if (Object.hasOwn(token, prop))
          delete token[prop]
      }
    }
    return tokens as unknown as Omits<T, K>[]
  }
  else {
    for (const prop of props) {
      if (Object.hasOwn(tokens, prop))
        delete tokens[prop]
    }
    return tokens as unknown as Omits<T, K>
  }
}

function removeTex(tokens: TokenizedValue): Omits<TokenizedValue, ['current', 'pos', 'tex']>
function removeTex(tokens: TokenizedValue[]): Omits<TokenizedValue, ['current', 'pos', 'tex']>[]
function removeTex(tokens: TokenizedValue | TokenizedValue[]) {
  if (Array.isArray(tokens))
    return removeProperties(tokens, ['current', 'pos', 'tex'])
  return removeProperties(tokens, ['current', 'pos', 'tex'])
}

export {
  removeTex,
  removeProperties,
}

export type {
  PR,
  Omits,
}
