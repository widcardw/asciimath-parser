import katex from 'katex'
import type { AsciiMath } from '../../../src'

function renderTex(am: AsciiMath, code: string, display?: boolean) {
  return katex.renderToString(am.toTex(code), { displayMode: !!display })
}

export {
  renderTex,
}
