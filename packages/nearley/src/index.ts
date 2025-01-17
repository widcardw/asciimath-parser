import Nearley from 'nearley'
import initGrammar from './grammar.js'
import initLexer from './lexer.js'
import type { MathVdom } from './math-vdom.js'
import type { Symbols } from './symbols.js'
import initSymbols from './symbols.js'
import initMathML from './to-mathml.js'
import initTex from './to-tex.js'

export type Ast = any
type ReplaceLaw = [RegExp | string, string | ((substring: string, ...args: any[]) => string)]

enum ErrorCode {
  syntaxError = 0,
  otherError = 1,
}
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
        dx: { tex: '{\\text{d}x}', mathml: { tag: 'mrow', children: [{ tag: 'mtext', children: 'd' }, { tag: 'mi', children: 'x' }] } },
        dy: { tex: '{\\text{d}y}', mathml: { tag: 'mrow', children: [{ tag: 'mtext', children: 'd' }, { tag: 'mi', children: 'y' }] } },
        dz: { tex: '{\\text{d}z}', mathml: { tag: 'mrow', children: [{ tag: 'mtext', children: 'd' }, { tag: 'mi', children: 'z' }] } },
        dt: { tex: '{\\text{d}t}', mathml: { tag: 'mrow', children: [{ tag: 'mtext', children: 'd' }, { tag: 'mi', children: 't' }] } },
        ee: { tex: '\\text{e}', mathml: { tag: 'mtext', children: 'e' } },
        ii: { tex: '\\text{i}', mathml: { tag: 'mtext', children: 'i' } },
      },
      ...config?.symbols,
    },
    replaceBeforeTokenizing: [
      // line break compat
      [/\r\n/g, '\n'],
      [/\r/g, '\n'],
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
  private genMathML: ((ast: Ast) => MathVdom)
  private initState: { [key: string]: any; lexerState: Nearley.LexerState }
  constructor(config?: AsciiMathConfig) {
    const { display, throws, symbols, replaceBeforeTokenizing } = resolveConfig(config)
    this.display = display
    this.throws = throws
    this.replaceBeforeTokenizing = replaceBeforeTokenizing
    const allSymbols = initSymbols(symbols)
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    const lexer = this.lexer = initLexer(allSymbols)
    const grammar = initGrammar(lexer)
    const compiledGrammar = Nearley.Grammar.fromCompiled(grammar)
    this.parser = new Nearley.Parser(compiledGrammar)
    this.initState = this.parser.save()
    this.genTex = initTex(allSymbols)
    this.genMathML = initMathML(allSymbols)
  }

  private parse(code: string) {
    code = this.replaceBeforeTokenizing.reduce((prev, curLaw) => {
      // nodejs 14 没有 replaceAll 方法, 不要用 replaceAll
      return prev.replace(new RegExp(curLaw[0], 'g'), curLaw[1] as any)
    }, code)
    this.parser.feed(code)
    if (this.parser.results.length === 0) {
      throw new Error('unexpected end of input')
    }
    if (this.parser.results.length > 1) {
      console.error(this.parser.results)
      throw new Error('ambiguous parse')
    }
  }

  private handleError(e: unknown): { code: ErrorCode; message: string } {
    if (this.throws)
      throw e
    console.error(e)
    const message = String(e)
    let index = message.indexOf(' Instead, I was expecting to see one of the following:')
    if (index > -1)
      return { code: ErrorCode.syntaxError, message: message.slice(0, index) }
    index = message.indexOf(':\n')
    const end = index > -1 ? index : undefined
    return { code: ErrorCode.otherError, message: message.slice(0, end) }
  }

  toTex(code: string, config: ToTexConfig = {}): string {
    this.parser.restore(this.initState)
    try {
      this.parse(code.trim())
      const res = this.genTex(this.parser.results)
      return (config.display ?? this.display) ? `\\displaystyle{ ${res} }` : res
    }
    catch (e) {
      const { code, message } = this.handleError(e)
      if (code === ErrorCode.syntaxError) {
        return this.genTex({
          type: 'opOA',
          value: 'verb',
          $1: { value: message },
        })
      }
      // ErrorCode.otherError
      return `\\text{${message}}`
    }
  }

  public toMathML(code: string, config: ToTexConfig = {}): MathVdom {
    this.parser.restore(this.initState)
    try {
      this.parse(code.trim())
      const res = this.genMathML(this.parser.results)
      if (config.display ?? this.display) {
        res.attr = res.attr || {}
        res.attr.displaystyle = 'true'
      }
      return res
    }
    catch (e) {
      const { code, message } = this.handleError(e)
      if (code === ErrorCode.syntaxError) {
        return this.genMathML({
          type: 'opOA',
          value: 'verb',
          $1: { value: message },
        })
      }
      // ErrorCode.otherError
      return this.genMathML({
        type: 'text',
        value: message,
      })
    }
  }
}

export {
  AsciiMath,
  type AsciiMathConfig,
}
