import { codegen } from './codegen'
import { parser } from './parser'
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
  extConst?: Array<[string, string]>
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
    extConst: [
      ['dx', '{\\text{d}x}'],
      ['dy', '{\\text{d}y}'],
      ['dz', '{\\text{d}z}'],
      ['dt', '{\\text{d}t}'],
      ['#', '\\displaystyle'],
    ],
    replaceBeforeTokenizing: [
      [/&#(x?[0-9a-fA-F]+);/g, (_match, $1) =>
        String.fromCodePoint($1[0] === 'x' ? `0${$1}` : $1),
      ],
    ],
  }
  if (typeof config?.display !== 'undefined')
    defaultConfig.display = config?.display
  if (config?.extConst?.length)
    defaultConfig.extConst.push(...config.extConst)
  if (config?.replaceBeforeTokenizing?.length)
    defaultConfig.replaceBeforeTokenizing.push(...config.replaceBeforeTokenizing)

  return defaultConfig
}

class AsciiMath {
  private trie: Trie
  private display: boolean
  private replaceLaws: ReplaceLaw[]
  constructor(config?: AsciiMathConfig) {
    const { display, extConst, replaceBeforeTokenizing: replaceBeforeParsing } = resolveConfig(config)
    this.trie = createTrie({ extConst })
    this.display = display
    this.replaceLaws = replaceBeforeParsing
  }

  toTex(code: string): string {
    try {
      code = this.replaceLaws.reduce((prev, curLaw) => {
      // in fact the judgement is no use...
        if (typeof curLaw[1] === 'function')
          return prev.replace(curLaw[0], curLaw[1])
        else
          return prev.replace(curLaw[0], curLaw[1])
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
}
