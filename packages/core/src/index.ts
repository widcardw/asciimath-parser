import { codegen } from './codegen'
import { parser } from './parser'
import type { SymbolValueType } from './symbols'
import { TokenTypes } from './symbols'
import type { Trie } from './trie'
import { createTrie } from './trie'

type ReplaceLaw = [RegExp | string, string | ((substring: string, ...args: any[]) => string)]

interface AsciiMathConfig {
  /**
   * @default true
   * enable displayMode in KaTeX
   */
  display?: boolean
  /**
   * Translate custom keywords into LaTeX expressions
   *
   * For example:
   * [
   *   ['dx', '\text{d}x'],
   *   ['dy', '\text{d}y']
   * ]
   */
  symbols?: Array<[string, SymbolValueType]> | Record<string, SymbolValueType>
  /**
   * Replace target expressions before tokenizing
   *
   * For example:
   * [
   *   [/&#(x?[0-9a-fA-F]+);/g, (match, $1) =>
   *     String.fromCodePoint($1[0] === 'x' ? '0' + $1 : $1)
   *   ],
   *   ...
   * ]
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
    },
    replaceBeforeTokenizing: [
      [/&#(x?[0-9a-fA-F]+);/g, (_match, $1) =>
        String.fromCodePoint($1[0] === 'x' ? `0${$1}` : $1),
      ],
    ],
  }
  if (typeof config?.display !== 'undefined')
    defaultConfig.display = config?.display
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

  toTex(code: string): string {
    try {
      code = this.replaceLaws.reduce((prev, curLaw) => {
        // @ts-expect-error do not check replacement type
        return prev.replaceAll(curLaw[0], curLaw[1])
      }, code)
      let res = codegen(parser(this.trie.tryParsingAll(code)))
      if (this.display)
        res = `\\displaystyle{ ${res} }`
      return res
    }
    catch (e) {
      return `\\text{${String(e)}}`
    }
  }
}

export {
  AsciiMath,
  AsciiMathConfig,
  TokenTypes,
}
