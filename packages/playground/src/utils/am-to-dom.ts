import katex from 'katex'
import { amc } from '../asciimath'

function amcToDom(code: string) {
  return katex.renderToString(amc.toTex(code), { throwOnError: false })
}

function amcToDomDisplay(code: string) {
  return katex.renderToString(amc.toTex(code), { displayMode: true, throwOnError: false })
}

export {
  amcToDom,
  amcToDomDisplay,
}
