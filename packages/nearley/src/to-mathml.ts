import type { Symbols } from './symbols'

export interface MathVdom {
  tag: string
  attr: Record<string, string>
  children: MathVdom[] | string
}

const initMathML = (symbols: Required<Symbols>) => {
  const toMathML = (): MathVdom => {
    return {
      tag: 'math',
      attr: {},
      children: '',
    }
  }
  return toMathML
}

export default initMathML
