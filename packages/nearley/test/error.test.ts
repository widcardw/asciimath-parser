import { describe, expect, it } from 'vitest'
import * as AmNearley from '../src/index'

// @deprecated
// describe('test error', () => {
//   const am = new AmNearley.AsciiMath()
//   it('syntax error', () => {
//     expect(am.toTex('/')).toBe(String.raw`\begin{aligned}
// & \texttt{Error:\ Syntax\ error\ at\ line\ 1\ col\ 1:}\\
// & \texttt{}\\
// & \texttt{1\ \ /}\\
// & \texttt{\ \ \ \textasciicircum{}}\\
// & \texttt{Unexpected\ opAOB\ token:\ "/"}
// \end{aligned}`)
//   })
// })

describe('test error', () => {
  const am = new AmNearley.AsciiMath()
  it('syntax error', () => {
    expect(am.toTex('/')).toBe(String.raw`\begin{aligned}
& \verb|Error: Syntax error at line 1 col 1:|\\
& \verb||\\
& \verb|1  /|\\
& \verb|   ^|\\
& \verb|Unexpected opAOB token: "/".|
\end{aligned}`)
  })
})
