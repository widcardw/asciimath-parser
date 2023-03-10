import Nearley from 'nearley'
import initGrammar from './grammar.js'
import initLexer from './lexer.js'
import type { Symbols } from './symbols.js'
import initSymbols from './symbols.js'
import initGenerator from './to-tex.js'

export type Ast = any
type ReplaceLaw = [RegExp | string, string | ((substring: string, ...args: any[]) => string)]

interface AsciiMathConfig {
  /**
   * @default true
   * enable displayMode in KaTeX
   */
  display?: boolean
  /**
   * Add custom symbols.
   *
   * For example:
   * {
   *   keyword: {
   *     dx: { tex: '{\\text{d}x}' },
   *     dy: { tex: '{\\text{d}y}' },
   *     dz: { tex: '{\\text{d}z}' },
   *     dt: { tex: '{\\text{d}t}' },
   *   }
   * }
   */
  symbols?: Symbols
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

type RestrictedAmConfig = Required<AsciiMathConfig>

function resolveConfig(config?: AsciiMathConfig): RestrictedAmConfig {
  const defaultConfig: RestrictedAmConfig = {
    display: true,
    symbols: {
      keyword: {
        dx: { tex: '{\\text{d}x}' },
        dy: { tex: '{\\text{d}y}' },
        dz: { tex: '{\\text{d}z}' },
        dt: { tex: '{\\text{d}t}' },
      },
    },
    replaceBeforeTokenizing: [
      [/&#(x?[0-9a-fA-F]+);/g, (_match, $1) =>
        String.fromCodePoint($1[0] === 'x' ? `0${$1}` : $1),
      ],
    ],
  }
  if (typeof config?.display !== 'undefined')
    defaultConfig.display = config?.display
  if (config?.replaceBeforeTokenizing?.length)
    defaultConfig.replaceBeforeTokenizing.push(...config.replaceBeforeTokenizing)

  return defaultConfig
}

class AsciiMath {
  private display: boolean
  private replaceLaws: ReplaceLaw[]
  private compiledGrammar: Nearley.Grammar
  private generator: ((ast: Ast) => string)
  constructor(config?: AsciiMathConfig) {
    const { display, symbols: extSymbols, replaceBeforeTokenizing: replaceBeforeParsing } = resolveConfig(config)
    this.display = display
    this.replaceLaws = replaceBeforeParsing
    const symbols = initSymbols(extSymbols)
    const lexer = initLexer(symbols)
    const grammar = initGrammar(lexer)
    this.generator = initGenerator(symbols)
    this.compiledGrammar = Nearley.Grammar.fromCompiled(grammar)
  }

  toTex(code: string): string {
    try {
      code = this.replaceLaws.reduce((prev, curLaw) => {
        return prev.replaceAll(curLaw[0], curLaw[1] as any)
      }, code)
      const parser = new Nearley.Parser(this.compiledGrammar)
      parser.feed(code)
      if (parser.results.length === 0) {
        throw new Error('unexpected end of input')
      }
      else if (parser.results.length > 1) {
        console.error(parser.results)
        throw new Error('ambiguous parse')
      }
      let res = this.generator(parser.results)
      if (this.display)
        res = `\\displaystyle{ ${res} }`
      return res
    }
    catch (e) {
      console.error(e)
      const message = String(e)
      const index = message.indexOf(':\n')
      const end = index === -1 ? undefined : index
      return `\\text{${message.slice(0, end)}}`
    }
  }
}

export {
  AsciiMath,
  AsciiMathConfig,
}
