import { codegen } from './codegen'
import { parser } from './parser'
import type { Trie } from './trie'
import { createTrie } from './trie'

type ReplaceLaw = [RegExp | string, string | ((substring: string, ...args: any[]) => string)]

interface AsciiMathConfig {
  display?: boolean
  extConst?: Array<[string, string]>
  replaceBeforeParsing?: ReplaceLaw[]
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
    ],
    replaceBeforeParsing: [
      [/part(\^\S*)?\s+(\S+)\s+(\([^)]*\)|\S+)/g, (_match, $1, $2, $3) => {
        if (!$1)
          $1 = ''
        if ($3[0] === '(')
          $3 = $3.slice(1, -1).split(/\s+/).join(' del ')
        return `(del${$1} ${$2})/(del ${$3})`
      }],
    ],
  }
  if (config?.display)
    defaultConfig.display = config?.display
  if (config?.extConst?.length)
    defaultConfig.extConst.push(...config.extConst)
  if (config?.replaceBeforeParsing?.length)
    defaultConfig.replaceBeforeParsing.push(...config.replaceBeforeParsing)

  return defaultConfig
}

class AsciiMath {
  private trie: Trie
  private display: boolean
  private replaceLaws: ReplaceLaw[]
  constructor(config?: AsciiMathConfig) {
    const { display: d, extConst: l, replaceBeforeParsing: r } = resolveConfig(config)
    this.trie = createTrie({ extConst: l })
    this.display = d
    this.replaceLaws = r
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
      throw new Error(e)
    }
  }
}

export {
  AsciiMath,
}
