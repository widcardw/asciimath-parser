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
   * @default false
   * throws error on parse
   */
  throws?: boolean
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
   *     ee: { tex: '\\text{e}' },
   *     ii: { tex: '\\text{i}' },
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
  return {
    display: config?.display ?? true,
    throws: config?.throws ?? false,
    symbols: {
      keyword: {
        dx: { tex: '{\\text{d}x}' },
        dy: { tex: '{\\text{d}y}' },
        dz: { tex: '{\\text{d}z}' },
        dt: { tex: '{\\text{d}t}' },
        ee: { tex: '\\text{e}' },
        ii: { tex: '\\text{i}' },
      },
      ...config?.symbols,
    },
    replaceBeforeTokenizing: [
      // html entity
      [/&#(x?[0-9a-fA-F]+);/g, (_match, $1) =>
        String.fromCodePoint($1[0] === 'x' ? `0${$1}` : $1),
      ],
      ...(config?.replaceBeforeTokenizing || []),
    ],
  }
}

class AsciiMath {
  public display: boolean
  public throws: boolean
  public replaceBeforeTokenizing: ReplaceLaw[]
  public lexer: Nearley.Lexer
  public parser: Nearley.Parser
  private genTex: ((ast: Ast) => string)
  private initState: { [key: string]: any; lexerState: Nearley.LexerState }
  constructor(config?: AsciiMathConfig) {
    const { display, throws, symbols, replaceBeforeTokenizing } = resolveConfig(config)
    this.display = display
    this.throws = throws
    this.replaceBeforeTokenizing = replaceBeforeTokenizing
    const allSymbols = initSymbols(symbols)
    const lexer = this.lexer = initLexer(allSymbols)
    const grammar = initGrammar(lexer)
    const compiledGrammar = Nearley.Grammar.fromCompiled(grammar)
    this.parser = new Nearley.Parser(compiledGrammar)
    this.initState = this.parser.save()
    this.genTex = initGenerator(allSymbols)
  }

  toTex(code: string): string {
    this.parser.restore(this.initState)
    try {
      code = this.replaceBeforeTokenizing.reduce((prev, curLaw) => {
        // nodejs 14 没有 replaceAll 方法, 不要用 replaceAll
        return prev.replace(new RegExp(curLaw[0], 'g'), curLaw[1] as any)
      }, code)
      this.parser.feed(code)
      if (this.parser.results.length === 0) {
        throw new Error('unexpected end of input')
      }
      else if (this.parser.results.length > 1) {
        console.error(this.parser.results)
        throw new Error('ambiguous parse')
      }
      let res = this.genTex(this.parser.results)
      if (this.display)
        res = `\\displaystyle{ ${res} }`
      return res
    }
    catch (e) {
      if (this.throws)
        throw e
      console.error(e)
      const message = String(e)
      let index = message.indexOf(' Instead, I was expecting to see one of the following:')
      if (index > -1) {
        return this.genTex({
          type: 'opOA',
          value: 'verb',
          $1: { value: message.slice(0, index) },
        })
      }

      index = message.indexOf(':\n')
      const end = index > -1 ? index : undefined
      return `\\text{${message.slice(0, end)}}`
    }
  }
}

export {
  AsciiMath,
  AsciiMathConfig,
}
