import { codegen } from './codegen'
import { parser } from './parser'
import type { SymbolValueType } from './symbols'
import { TokenTypes } from './symbols'
import type { Trie } from './trie'
import { createTrie } from './trie'

type ReplaceLaw = [RegExp | string, string | ((substring: string, ...args: any[]) => string)]

interface ToTexConfig {
  display?: boolean
}

interface AsciiMathConfig {
  /**
   * @default true
   * enable displayMode in KaTeX
   */
  display?: boolean
  /**
   * Extend tokens of asciimath
   * ```ts
   * {
   *   // Simply transform `d0` to `d theta`
   *   'd0': { type: TokenTypes.Const, tex: '{\\text{d}\\theta}' },
   *   // Token with unary symbol, the `$1` will be replaced with the following symbol
   *   'tsc': { type: TokenTypes.OperatorOA, tex: '\\textsc{$1}' },
   *   // Token with binary symbols, the `$1` and `$2` will be replaced with the following two symbols
   *   'frac': { type: TokenTypes.OperatorOAB, tex: '\\frac{ $1 }{ $2 }' },
   *   // Infix expression, the `$1` and `$2` will be replaced with the previous symbol and next symbol respectively
   *   'over': { type: TokenTypes.OperatorAOB, tex: '{ $1 \\over $2 }' },
   * }
   * ```
   *
   * You can extend the token types mentioned above, but it is *not recommended* to extend all types of [`enum TokenTypes`](https://github.com/widcardw/asciimath-parser/blob/main/packages/core/src/symbols.ts#L1-L20).
   */
  symbols?: Array<[string, SymbolValueType]> | Record<string, SymbolValueType>
  /**
   * Replace target expressions before tokenizing
   * ```ts
   * [
   *   [/&#(x?[0-9a-fA-F]+);/g, (match, $1) =>
   *     String.fromCodePoint($1[0] === 'x' ? '0' + $1 : $1)
   *   ],
   *   ...
   * ]
   * ```
   */
  replaceBeforeTokenizing?: ReplaceLaw[]
}

interface RestrictedAmConfig extends Required<AsciiMathConfig> {
  symbols: Record<string, SymbolValueType>
}

function resolveConfig(config?: AsciiMathConfig): RestrictedAmConfig {
  const defaultConfig: RestrictedAmConfig = {
    display: true,
    symbols: {
      'dx': { type: TokenTypes.Const, tex: '{\\text{d}x}' },
      'dy': { type: TokenTypes.Const, tex: '{\\text{d}y}' },
      'dz': { type: TokenTypes.Const, tex: '{\\text{d}z}' },
      'dt': { type: TokenTypes.Const, tex: '{\\text{d}t}' },
      '#': { type: TokenTypes.Const, tex: '\\displaystyle' },
      'atop': { type: TokenTypes.OperatorAOB, tex: '{ $1 \\atop $2 }' },
    },
    replaceBeforeTokenizing: [
      [/&#(x?[0-9a-fA-F]+);/g, (_match, $1) =>
        String.fromCodePoint($1[0] === 'x' ? `0${$1}` : $1),
      ],
    ],
  }
  if (typeof config?.display !== 'undefined')
    defaultConfig.display = config.display
  if (config?.symbols) {
    if (Array.isArray(config.symbols)) {
      config.symbols.forEach(([k, v]) => {
        defaultConfig.symbols[k] = v
      })
    }
    else {
      defaultConfig.symbols = { ...defaultConfig.symbols, ...config.symbols }
    }
  }
  if (config?.replaceBeforeTokenizing?.length)
    defaultConfig.replaceBeforeTokenizing.push(...config.replaceBeforeTokenizing)

  return defaultConfig
}

class AsciiMath {
  private trie: Trie
  private display: boolean
  private replaceLaws: ReplaceLaw[]
  constructor(config?: AsciiMathConfig) {
    const { display, symbols, replaceBeforeTokenizing: replaceBeforeParsing } = resolveConfig(config)
    this.trie = createTrie({ symbols })
    this.display = display
    this.replaceLaws = replaceBeforeParsing
  }

  toTex(code: string, config?: ToTexConfig): string {
    try {
      code = this.replaceLaws.reduce((prev, curLaw) => {
        // @ts-expect-error do not check replacement type
        return prev.replaceAll(curLaw[0], curLaw[1])
      }, code)
      let res = codegen(
        parser(
          this.trie.tryParsingAll(code),
        ),
      )
      if (typeof config?.display === 'undefined') {
        if (this.display)
          res = `\\displaystyle{ ${res} }`
      }
      else {
        if (config.display)
          res = `\\displaystyle{ ${res} }`
      }
      return res
    }
    catch (e) {
      return `\\text{${String(e)}}`
    }
  }

  toML(code: string, config: ToTexConfig): string {
    try {
      return ''
    }
    catch (e) {
      return String(e)
    }
  }
}

export {
  AsciiMath,
  type AsciiMathConfig,
  TokenTypes,
}
